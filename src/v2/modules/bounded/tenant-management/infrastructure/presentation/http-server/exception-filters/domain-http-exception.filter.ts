import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundException } from '../../../../core/domain/exceptions/entity/entity-not-found.exception';
import { InvalidValueObjectException } from '../../../../core/domain/exceptions/validation/invalid-value-object.exception';
import { DomainValidationException } from '../../../../core/domain/exceptions/validation/domain-validation.exception';
import { NoActiveLicenseException } from '../../../../core/domain/exceptions/application/no-active-license.exception';
import { LicenseLimitExceededException } from '../../../../core/domain/exceptions/application/license-limit-exceeded.exception';

type ErrorResponseBody = {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, unknown>;
};

@Catch(
  InvalidValueObjectException,
  DomainValidationException,
  EntityNotFoundException,
  NoActiveLicenseException,
  LicenseLimitExceededException,
)
export class DomainHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const body: ErrorResponseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Unexpected error',
    };

    if (exception instanceof EntityNotFoundException) {
      body.statusCode = HttpStatus.NOT_FOUND;
      body.error = 'Not Found';
      body.message = exception.message;
      return void res.status(body.statusCode).json(body);
    }

    if (exception instanceof InvalidValueObjectException) {
      body.statusCode = HttpStatus.BAD_REQUEST;
      body.error = 'Bad Request';
      body.message = exception.message;
      body.details = { field: exception.field };
      return void res.status(body.statusCode).json(body);
    }

    if (exception instanceof DomainValidationException) {
      body.statusCode = HttpStatus.BAD_REQUEST;
      body.error = 'Bad Request';
      body.message = exception.message;
      return void res.status(body.statusCode).json(body);
    }

    if (exception instanceof NoActiveLicenseException) {
      body.statusCode = HttpStatus.FORBIDDEN;
      body.error = 'Forbidden';
      body.message = exception.message;
      return void res.status(body.statusCode).json(body);
    }

    if (exception instanceof LicenseLimitExceededException) {
      body.statusCode = HttpStatus.FORBIDDEN;
      body.error = 'Forbidden';
      body.message = exception.message;
      body.details = { limit: exception.limitType };
      return void res.status(body.statusCode).json(body);
    }

    return void res.status(body.statusCode).json(body);
  }
}
