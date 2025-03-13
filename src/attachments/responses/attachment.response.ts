import { ObjectType } from "@nestjs/graphql";
import { Attachment } from "../entities/attachment.entity";
import { genericResponsePayload } from "src/shared/helpers/graphql.helper";
import { responsePaginated } from "src/shared/helpers/response.helper";



@ObjectType()
export class ResponseAttachment extends genericResponsePayload(Attachment) { }

@ObjectType()
export class ResponseAttachmentPaginated extends responsePaginated(Attachment) { }