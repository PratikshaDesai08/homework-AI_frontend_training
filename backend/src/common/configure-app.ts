import { BadRequestException, type INestApplication, ValidationPipe, type ValidationError } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Turns class-validator errors into one message per field:
 * { statusCode: 400, message: "Please fix the highlighted fields.", errors: { email: "Enter a valid email…" } }
 * The frontend shows `errors.<field>` under each input and `message` at the top of the form.
 */
function validationExceptionFactory(validationErrors: ValidationError[]) {
  const errors: Record<string, string> = {};
  for (const error of validationErrors) {
    const constraints = error.constraints ?? {};
    const messages = Object.values(constraints);
    // A missing value shows "X is required." rather than every other rule it also fails
    if (messages.length > 0) errors[error.property] = constraints.isNotEmpty ?? messages[messages.length - 1];
  }
  return new BadRequestException({ statusCode: 400, message: 'Please fix the highlighted fields.', errors });
}

/** Shared by main.ts and the e2e tests, so tests run the exact production setup. */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drop unknown fields
      forbidNonWhitelisted: true, // …and reject them with 400
      transform: true, // query strings → numbers, trimming
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // CORS_ORIGINS: comma-separated list, e.g. "http://localhost:3000,https://homework-ai-frontend-training.vercel.app"
  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins });

  const swagger = new DocumentBuilder()
    .setTitle('Student Admin API')
    .setDescription('CRUD API for the AI Frontend Training homework (HW2)')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, swagger));
}
