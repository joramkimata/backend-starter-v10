import { HttpStatusCode } from "../enums/http-codes.enum";

export interface GenericResponsePayload<T> {
  code: HttpStatusCode | string | number;
  data?: T;
  status?: boolean;
  errorDescription?: string;
}