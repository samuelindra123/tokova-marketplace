import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private mg: ReturnType<Mailgun['client']> | null = null;
  private domain: string;
  private from: string;
  private appName: string;
  private appUrl: string;
  private frontendUrl: string;
  private vendorUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('mailgun.apiKey');
    this.domain = this.configService.get<string>('mailgun.domain') || '';
    this.from = this.configService.get<string>('mailgun.from') || '';
    this.appName = this.configService.get<string>('app.name') || 'Marketplace';
    this.appUrl = this.configService.get<string>('app.url') || '';
    this.frontendUrl = this.configService.get<string>('app.frontendUrl') || '';
    this.vendorUrl = this.configService.get<string>('app.vendorUrl') || 'http://localhost:3002';

    if (apiKey) {
      const mailgun = new Mailgun(FormData);
      // Check if EU region is used (set MAILGUN_EU=true in .env for EU region)
      const useEU = this.configService.get<string>('mailgun.eu') === 'true';
      this.mg = mailgun.client({
        username: 'api',
        key: apiKey,
        url: useEU ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net',
      });
      this.logger.log(`Mailgun configured with ${useEU ? 'EU' : 'US'} region`);
    } else {
      this.logger.warn('Mailgun API key not configured. Emails will be logged only.');
    }
  }

  private async sendEmail(to: string, subject: string, html: string) {
    if (!this.mg) {
      this.logger.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
      this.logger.debug(`[EMAIL BODY] ${html}`);
      return;
    }

    try {
      await this.mg.messages.create(this.domain, {
        from: `${this.appName} <${this.from}>`,
        to: [to],
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${this.frontendUrl}/verify-email?token=${token}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>Thank you for registering! Please click the button below to verify your email address:</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verifyUrl}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Verify your email - ${this.appName}`, html);
  }

  async sendVendorVerificationEmail(email: string, token: string, storeName: string) {
    const verifyUrl = `${this.vendorUrl}/verify-email?token=${token}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #222; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: #ee4d2d; color: white; padding: 24px 30px; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 30px; }
          .content h2 { color: #222; margin: 0 0 16px; font-size: 18px; }
          .content p { color: #555; margin: 0 0 16px; font-size: 14px; }
          .button { display: inline-block; background: #ee4d2d; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; }
          .button:hover { background: #d73211; }
          .link { word-break: break-all; color: #ee4d2d; font-size: 13px; }
          .note { background: #fff8f6; border: 1px solid #ffebe6; border-radius: 4px; padding: 16px; margin-top: 20px; }
          .note p { margin: 0; color: #666; font-size: 13px; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Vendor Center</h1>
              <p>Verify Your Email</p>
            </div>
            <div class="content">
              <h2>Hello, Welcome!</h2>
              <p>Thank you for registering your store <strong>"${storeName}"</strong> on our platform. To continue, please verify your email by clicking the button below:</p>
              <p style="text-align: center; margin: 24px 0;">
                <a href="${verifyUrl}" class="button">Verify Email</a>
              </p>
              <p>Or copy and paste the following link into your browser:</p>
              <p class="link">${verifyUrl}</p>
              <div class="note">
                <p><strong>Note:</strong> This link will expire in 24 hours. After your email is verified, our team will review your store application within 1-3 business days.</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Vendor Center. All rights reserved.</p>
            <p>This email was sent automatically, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Verify Your Email - Vendor Center`, html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Reset your password - ${this.appName}`, html);
  }

  async sendPasswordResetSuccessEmail(email: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.appName}</h1>
          </div>
          <div class="content">
            <h2>Password Reset Successful</h2>
            <p>Your password has been successfully reset.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Password changed - ${this.appName}`, html);
  }

  async sendWelcomeEmail(email: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${this.appName}! 🎉</h1>
          </div>
          <div class="content">
            <h2>Your email has been verified!</h2>
            <p>Thank you for joining ${this.appName}. We're excited to have you on board!</p>
            <p>You now have full access to all features. Start exploring our marketplace today.</p>
            <p style="text-align: center;">
              <a href="${this.frontendUrl}" class="button">Start Shopping</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Welcome to ${this.appName}!`, html);
  }

  async sendVendorApprovedEmail(email: string, storeName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Congratulations! 🎉</h1>
          </div>
          <div class="content">
            <h2>Your store "${storeName}" has been approved!</h2>
            <p>Great news! Your vendor application has been approved. You can now start selling on ${this.appName}.</p>
            <p style="text-align: center;">
              <a href="${this.frontendUrl}/vendor/dashboard" class="button">Go to Vendor Dashboard</a>
            </p>
            <p>Here are some tips to get started:</p>
            <ul>
              <li>Add your first products</li>
              <li>Set up your store profile</li>
              <li>Configure your payment settings</li>
            </ul>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Your store has been approved! - ${this.appName}`, html);
  }

  async sendVendorRejectedEmail(email: string, storeName: string, reason?: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <h2>Store Application Not Approved</h2>
            <p>We're sorry, but your vendor application for "${storeName}" was not approved at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>If you believe this was a mistake or would like to appeal, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Store application update - ${this.appName}`, html);
  }

  async sendOrderConfirmationEmail(
    email: string,
    orderNumber: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    total: number,
  ) {
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      `,
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-table th { background: #667eea; color: white; padding: 10px; text-align: left; }
          .total { font-size: 18px; font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Your order <strong>#${orderNumber}</strong> has been confirmed and is being processed.</p>
            <table class="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <p class="total" style="text-align: right;">Total: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Order Confirmed #${orderNumber} - ${this.appName}`, html);
  }

  async sendOrderShippedEmail(
    email: string,
    orderNumber: string,
    trackingNumber: string,
  ) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tracking { background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order is On Its Way! 🚚</h1>
          </div>
          <div class="content">
            <h2>Order #${orderNumber} has been shipped!</h2>
            <p>Great news! Your order is on its way to you.</p>
            <div class="tracking">
              <p style="margin: 0;">Tracking Number:</p>
              <p style="font-size: 24px; font-weight: bold; color: #4facfe; margin: 10px 0;">${trackingNumber}</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Your order is on its way! - ${this.appName}`, html);
  }
  async sendVendorPasswordResetEmail(email: string, otp: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background: #ee4d2d; color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 40px 30px; text-align: center; }
          .otp-code { 
            background: #fff8f6; 
            border: 2px dashed #ee4d2d; 
            color: #ee4d2d; 
            font-size: 32px; 
            font-weight: 800; 
            letter-spacing: 4px; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 30px 0; 
            display: inline-block;
          }
          .footer { text-align: center; margin-top: 24px; color: #888; font-size: 13px; }
          .expiry { color: #666; font-size: 14px; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Reset Password</h1>
            </div>
            <div class="content">
              <h2>OTP Verification Code</h2>
              <p>Use the following code to reset your Vendor account password:</p>
              
              <div class="otp-code">${otp}</div>
              
              <p class="expiry">This code will expire in 1 hour.</p>
              <p style="margin-top: 30px; font-size: 13px; color: #888;">
                If you did not request a password reset, please ignore this email.
                Your account security is our priority.
              </p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Reset Vendor Password - ${this.appName}`, html);
  }
  async sendContactMessageToAdmin(data: { name: string; email: string; subject: string; message: string }) {
    const adminEmail = 'mesakzitumpul@gmail.com'; // Hardcoded as requested
    const subject = `[Contact Form] ${data.subject}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; }
          .header { background: #f4f4f4; padding: 10px; border-bottom: 1px solid #ddd; }
          .content { padding: 20px 0; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Message</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">From:</span> ${data.name} (${data.email})
            </div>
            <div class="field">
              <span class="label">Subject:</span> ${data.subject}
            </div>
            <div class="field">
              <span class="label">Message:</span><br>
              <p>${data.message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(adminEmail, subject, html);
  }

  async sendContactAutoReplyToUser(data: { name: string; email: string }) {
    const subject = `Thank you for contacting ${this.appName}`;
    // User mentioned "dari renungankristensite@gmail.com" as example, but we use the system sender for auth/validity
    // We can assume the system sender is configured correctly.
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fbb03b 0%, #ff6b6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>${this.appName} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(data.email, subject, html);
  }
}
