import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { Public } from '../../common/decorators';

@Controller('contact')
export class ContactController {
    constructor(private readonly mailService: MailService) { }

    @Public()
    @Post()
    @HttpCode(HttpStatus.OK)
    async sendMessage(@Body() body: { name: string; email: string; subject: string; message: string }) {
        // Send email to admin
        await this.mailService.sendContactMessageToAdmin(body);

        // Send auto-reply to user
        await this.mailService.sendContactAutoReplyToUser({ name: body.name, email: body.email });

        return { message: 'Message sent successfully' };
    }
}
