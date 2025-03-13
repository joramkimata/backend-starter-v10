import { Args, Query, Resolver } from "@nestjs/graphql";
import { Attachment } from "../entities/attachment.entity";
import { AttachmentService } from "../services/attachments.service";
import { AttachmentQueryInput } from "../inputs/attachment-query.input";


@Resolver(of => Attachment)
export class AttachmentResolver {

    constructor(
        private attachmentService: AttachmentService
    ) { }

    @Query(returns => [Attachment])
    getAttachments(
        @Args('input')
        input: AttachmentQueryInput
    ) {
        return this.attachmentService.getAttachments(input.attachableUuid, input.attachableType);
    }
}