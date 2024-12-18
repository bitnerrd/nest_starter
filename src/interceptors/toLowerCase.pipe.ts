import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToLowerCasePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async transform(value: any, _metadata: ArgumentMetadata): Promise<any> {
    // validate against DTO
    if (value.email) {
      value.email = value.email.toLowerCase();
    }
    return value;
  }
}
