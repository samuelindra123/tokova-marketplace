import {
    Injectable,
    Inject,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import slugify from 'slugify';

import { DATABASE_CONNECTION, type Database } from '../../database/database.module';
import * as schema from '../../database/schema';
import {
    LoginDto,
    RegisterCustomerDto,
    RegisterVendorDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    VerifyEmailDto,
    ChangePasswordDto,
    ResendVerificationDto,
} from './dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: Database,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
    ) { }

    async registerCustomer(dto: RegisterCustomerDto) {
        // Check if user exists
        const existingUser = await this.db.query.users.findFirst({
            where: eq(schema.users.email, dto.email.toLowerCase()),
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verificationToken = uuidv4();

        // Create user
        const [user] = await this.db
            .insert(schema.users)
            .values({
                email: dto.email.toLowerCase(),
                password: hashedPassword,
                role: 'CUSTOMER',
                verificationToken,
            })
            .returning();

        // Create customer profile
        await this.db.insert(schema.customers).values({
            userId: user.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
        });

        // Send verification email
        await this.mailService.sendVerificationEmail(user.email, verificationToken);

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        return {
            message: 'Registration successful. Please verify your email.',
            ...tokens,
        };
    }

    async registerVendor(dto: RegisterVendorDto) {
        // Check if user exists
        const existingUser = await this.db.query.users.findFirst({
            where: eq(schema.users.email, dto.email.toLowerCase()),
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Check if store name exists
        const storeSlug = slugify(dto.storeName, { lower: true, strict: true });
        const existingStore = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.storeSlug, storeSlug),
        });

        if (existingStore) {
            throw new ConflictException('Store name already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verificationToken = uuidv4();

        // Create user
        const [user] = await this.db
            .insert(schema.users)
            .values({
                email: dto.email.toLowerCase(),
                password: hashedPassword,
                role: 'VENDOR',
                verificationToken,
            })
            .returning();

        // Create vendor profile
        await this.db.insert(schema.vendors).values({
            userId: user.id,
            storeName: dto.storeName,
            storeSlug,
            description: dto.description,
            phone: dto.phone,
            status: 'PENDING',
        });

        // Send verification email (vendor-specific template)
        await this.mailService.sendVendorVerificationEmail(user.email, verificationToken, dto.storeName);

        return {
            message:
                'Registration successful. Please verify your email. Your store will be reviewed by admin.',
        };
    }

    async login(dto: LoginDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, dto.email.toLowerCase()),
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Check vendor status if vendor - only block SUSPENDED vendors
        if (user.role === 'VENDOR') {
            const vendor = await this.db.query.vendors.findFirst({
                where: eq(schema.vendors.userId, user.id),
            });

            // Only SUSPENDED should block login
            // PENDING and REJECTED vendors can login but frontend will show appropriate pages
            if (vendor?.status === 'SUSPENDED') {
                throw new UnauthorizedException('Your store has been suspended');
            }
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            ...tokens,
        };
    }

    async refreshToken(userId: string, email: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId),
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Access denied');
        }

        return this.generateTokens(user.id, user.email, user.role);
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, dto.email.toLowerCase()),
        });

        if (!user) {
            throw new NotFoundException('Email tidak terdaftar');
        }

        if (dto.requiredRole && user.role !== dto.requiredRole) {
            throw new ForbiddenException(`Email tidak terdaftar sebagai ${dto.requiredRole}`);
        }

        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        let resetToken: string;

        if (user.role === 'VENDOR') {
            // Generate 6-digit OTP for Vendor
            resetToken = Math.floor(100000 + Math.random() * 900000).toString();
            await this.mailService.sendVendorPasswordResetEmail(user.email, resetToken);
        } else {
            resetToken = uuidv4();
            await this.mailService.sendPasswordResetEmail(user.email, resetToken);
        }

        await this.db
            .update(schema.users)
            .set({
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            })
            .where(eq(schema.users.id, user.id));

        return { message: 'If email exists, password reset link has been sent' };
    }

    async verifyResetToken(token: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.resetPasswordToken, token),
        });

        if (!user || !user.resetPasswordExpires) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (new Date() > user.resetPasswordExpires) {
            throw new BadRequestException('Reset token has expired');
        }

        return { isValid: true };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.resetPasswordToken, dto.token),
        });

        if (!user || !user.resetPasswordExpires) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (new Date() > user.resetPasswordExpires) {
            throw new BadRequestException('Reset token has expired');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.db
            .update(schema.users)
            .set({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id));

        await this.mailService.sendPasswordResetSuccessEmail(user.email);

        return { message: 'Password reset successful' };
    }

    async verifyEmail(dto: VerifyEmailDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.verificationToken, dto.token),
        });

        if (!user) {
            throw new BadRequestException('Invalid verification token');
        }

        if (user.isVerified) {
            return { message: 'Email already verified' };
        }

        await this.db
            .update(schema.users)
            .set({
                isVerified: true,
                verificationToken: null,
                updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id));

        await this.mailService.sendWelcomeEmail(user.email);

        return { message: 'Email verified successfully' };
    }

    async resendVerification(dto: ResendVerificationDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, dto.email),
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return { message: 'Jika email terdaftar dan belum terverifikasi, email verifikasi akan dikirim ulang' };
        }

        if (user.isVerified) {
            return { message: 'Email sudah terverifikasi. Silakan login.' };
        }

        // Generate new verification token
        const verificationToken = randomBytes(32).toString('hex');

        await this.db
            .update(schema.users)
            .set({
                verificationToken,
                updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id));

        // Check if user is vendor
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, user.id),
        });

        if (vendor) {
            await this.mailService.sendVendorVerificationEmail(user.email, verificationToken, vendor.storeName);
        } else {
            await this.mailService.sendVerificationEmail(user.email, verificationToken);
        }

        return { message: 'Email verifikasi telah dikirim ulang. Silakan cek inbox atau folder spam Anda.' };
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId),
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.currentPassword,
            user.password,
        );
        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this.db
            .update(schema.users)
            .set({
                password: hashedPassword,
                updatedAt: new Date(),
            })
            .where(eq(schema.users.id, userId));

        return { message: 'Password changed successfully' };
    }

    async getProfile(userId: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId),
            with: {
                customer: true,
                vendor: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { password, verificationToken, resetPasswordToken, ...safeUser } =
            user;

        return safeUser;
    }

    private async generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('jwt.secret'),
                expiresIn: 900, // 15 minutes
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('jwt.refreshSecret'),
                expiresIn: 604800, // 7 days
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
