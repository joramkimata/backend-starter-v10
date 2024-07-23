import { registerEnumType } from '@nestjs/graphql';
import { changeEnumToObject } from '../utils/enum.util';

export enum HttpStatusCode {
  SUCCESS = 9000,
  DUPLICATE = 9001,
  NO_FOUND = 9002,
  BAD_REQUEST = 9003,
  PASSWORD_MISMATCH = 9004,
  THROWN_ERROR = 7000,
}

registerEnumType(HttpStatusCode, {
  name: 'HttpStatusCode',
});

export const HttpCodes = { ...changeEnumToObject(HttpStatusCode) };