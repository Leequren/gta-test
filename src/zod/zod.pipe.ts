import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}
  transform(value: any) {
    const res = this.schema.safeParse(value);
    if (!res.success) {
      const errors = res.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new BadRequestException('[VALIDATION FAILED] ', errors);
    }
    return res.data;
  }
}
