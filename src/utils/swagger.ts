import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('ggo-geet API Docs')
    .setDescription('ggo-geet  API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
