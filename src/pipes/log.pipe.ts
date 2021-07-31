import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
// import { ObjectSchema } from '@hapi/joi';

@Injectable()
export class LogPipes implements PipeTransform {
  // constructor(private readonly schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('333', value, metadata);
    // const { error } = this.schema.validate(value);
    // if (error) {
    //   throw new BadRequestException('Validation failed');
    // }
    return value;
  }
}
