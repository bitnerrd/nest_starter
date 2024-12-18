import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import fileConfig from './config/file.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { EntitiesModule } from './entities/entities.module';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/auth.config';
import mailConfig from './config/mail.config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigService } from './mail/mail-config.service';
import { UserModule } from './user/user.module';
import { StripeSubscriptionsModule } from './stripe-subscriptions/stripe-subscriptions.module';
import { StripeCustomersModule } from './stripe-customers/stripe-customers.module';
import { StripeSetupIntentModule } from './stripe-setup-intent/stripe-setup-intent.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import stripeConfig from './config/stripe.config';
import { ZoomModule } from './zoom/zoom.module';
import { ChatSocketModule } from './chat-socket/chat-socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        // fileConfig,
        authConfig,
        // mailConfig,
        // stripeConfig,
      ],
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    EntitiesModule,
    AuthModule,
    UserModule,
    // MailModule,
    // StripeSubscriptionsModule,
    // StripeCustomersModule,
    // StripeSetupIntentModule,
    // WebhooksModule,
    // ZoomModule,
    // ChatSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
