import { HttpStatusCode } from '../enums/http-codes.enum';

export interface ResponsePayload {
  code: HttpStatusCode | string | number;

  data?: any;

  status?: boolean;

  errorDescription?: string;
}