import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
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
import { Public, CurrentUser } from '../../common/decorators';
import { JwtRefreshGuard } from '../../common/guards';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register/customer')
    @ApiOperation({ summary: 'Register as customer' })
    @ApiResponse({ status: 201, description: 'Customer registered successfully' })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async registerCustomer(@Body() dto: RegisterCustomerDto) {
        return this.authService.registerCustomer(dto);
    }

    @Public()
    @Post('register/vendor')
    @ApiOperation({ summary: 'Register as vendor' })
    @ApiResponse({ status: 201, description: 'Vendor registered successfully' })
    @ApiResponse({ status: 409, description: 'Email or store name already taken' })
    async registerVendor(@Body() dto: RegisterVendorDto) {
        return this.authService.registerVendor(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Public()
    @UseGuards(JwtRefreshGuard)
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    async refreshToken(@CurrentUser() user: { id: string; email: string }) {
        return this.authService.refreshToken(user.id, user.email);
    }

    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @Public()
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({ status: 200, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Public()
    @Post('verify-reset-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify reset token/OTP' })
    @ApiResponse({ status: 200, description: 'Token valid' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async verifyResetToken(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyResetToken(dto.token);
    }

    @Public()
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify email with token' })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid verification token' })
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto);
    }

    @Public()
    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resend verification email' })
    @ApiResponse({ status: 200, description: 'Verification email resent if account exists and is not verified' })
    async resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Current password is incorrect' })
    async changePassword(
        @CurrentUser('id') userId: string,
        @Body() dto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(userId, dto);
    }

    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
    async getProfile(@CurrentUser('id') userId: string) {
        return this.authService.getProfile(userId);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user (alias for /profile)' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    async getMe(@CurrentUser('id') userId: string) {
        return this.authService.getProfile(userId);
    }
}
