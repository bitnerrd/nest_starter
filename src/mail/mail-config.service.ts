import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// const nodemailer = require("nodemailer");
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailConfigService implements MailerOptionsFactory {
  constructor(private configService: ConfigService) { }

  async createMailerOptions(): Promise<MailerOptions> {

    // let testAccount = await nodemailer.createTestAccount()

    return {
      transport: {
        host: this.configService.get('mail.host') || "smtp.ethereal.email",
        port: this.configService.get('mail.port') || 587,
        ignoreTLS: this.configService.get('mail.ignoreTLS') || false,
        secure: this.configService.get('mail.secure') || false,
        requireTLS: this.configService.get('mail.requireTLS') || false,
        auth: {
          user: this.configService.get('mail.user'),
          pass: this.configService.get('mail.password'),
        },
      },
      defaults: {
        from: `"${this.configService.get(
          'mail.defaultName',
        )}" <${this.configService.get('mail.defaultEmail')}>`,
      },
      template: {
        dir: path.join(
          this.configService.get('app.workingDirectory'),
          'mail-templates',
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    } as MailerOptions;
  }
}
