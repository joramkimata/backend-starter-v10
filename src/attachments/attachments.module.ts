import { Module } from '@nestjs/common';
import { AttachmentService } from './services/attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { AttachmentResolver } from './resolvers/attachment.resolver';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Attachment
        ])
    ],
    providers: [
        AttachmentService,
        AttachmentResolver
    ],
    exports: [
        AttachmentService
    ]
})
export class AttachmentsModule { }
