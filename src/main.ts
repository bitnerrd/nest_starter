import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import "colors";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Exception } from "./common/middlewares/exception";
import * as dotenv from "dotenv";
// import { name } from "./common/services/googleapis";

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.setGlobalPrefix("/v1/api");
  // In NestJS, the useStaticAssets() method is used to serve static assets files, such as images and documents.
  // The ServeStaticModule is used to serve static content, such as Single Page Applications (SPAs).
  app.useStaticAssets("public/uploads", {
    prefix: "/public/uploads",
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Trader Metrix")
    .setDescription("--")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  await app.listen(process.env.PORT || 6206, () => {
    // name();
    console.log(
      `${process.env.NODE_ENV} Server revving up on ${process.env.PORT} after mongoose on board!`
        .bgBlue.bold
    );
  });
}

bootstrap();
