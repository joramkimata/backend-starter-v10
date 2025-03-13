import { Injectable } from "@nestjs/common";
import { AttachmentInput } from "../inputs/attachment.input";
import { EntityManager, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponseAttachment } from "../responses/attachment.response";
import response from "src/shared/helpers/response.helper";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import { Attachment } from "../entities/attachment.entity";
import { BaseService } from "src/shared/services/base.service";
import * as moment from "moment";
import { ResponsePayload } from "src/shared/interfaces/response-payload.interface";
import { deleteFileFromDisk, saveFileToDisk } from "src/shared/helpers/file.helper";


@Injectable()
export class AttachmentService extends BaseService {


    constructor(
        @InjectRepository(Attachment)
        private attachRepo: Repository<Attachment>,
    ) {
        super();
    }

    private rels = [];

    getAttachments(attachableUid: string, attachableType: string) {
        return this.attachRepo.find({
            where: {
                deleted: false,
                attachableType,
                attachableUid
            }
        })
    }

    async deleteAttachment(uuid: string) {
        const res = new ResponseAttachment();

        const dbAtt = await this.attachRepo.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!dbAtt) {
            return response(null, res, 'Attachment not found', HttpStatusCode.NO_FOUND);
        }

        try {
            await deleteFileFromDisk(dbAtt.attachemntDriveLocation);

            dbAtt.deleted = true;

            const saved = await this.attachRepo.save(dbAtt);

            return response(
                this.getEntityById<Attachment>(
                    this.attachRepo,
                    saved.id,
                    this.rels
                ), res
            );
        } catch (e) {
            console.log(e)
            return response(null, res, 'Error while delete file', HttpStatusCode.THROWN_ERROR);
        }


    }

    async saveAttachment(
        {
            attachableUid,
            attachableType,
            attachableFormat,
            attachemntData,
            attachmentExtension,
            attachmentName,
            uuid,
        }: AttachmentInput,
        manager?: EntityManager // Optional transaction manager
    ): Promise<ResponsePayload> {
        const res = new ResponseAttachment();

        const repo = manager ? manager.getRepository(Attachment) : this.attachRepo;

        const dbAtt = await repo.findOne({
            where: {
                deleted: false,
                attachableUid,
                attachableType,
                uuid,
            },
        });

        if (dbAtt) {
            const attachment = dbAtt;

            const _attachmentName = moment().unix().toString();

            attachment.attachableType = attachableType;
            attachment.attachableUid = attachableUid;
            attachment.attachableFormat = attachableFormat;
            attachment.attachmentExtension = attachmentExtension;
            attachment.attachmentName = _attachmentName;
            attachment.attachmentOGName = attachmentName;

            try {
                // Delete the old file
                await deleteFileFromDisk(attachment.attachemntDriveLocation);

                // Save the new file
                const location = await saveFileToDisk(
                    attachemntData,
                    _attachmentName,
                    attachmentExtension.toString().toLowerCase()
                );

                if (location) {
                    attachment.attachemntDriveLocation = location;
                    attachment.attachemntData = attachemntData;

                    const saved = await repo.save(attachment);

                    return response(
                        this.getEntityById<Attachment>(
                            repo,
                            saved.id,
                            this.rels
                        ),
                        res
                    );
                }
            } catch (e) {
                console.error(e);
                throw new Error("Error while saving attachment");
            }
        } else {
            const attachment = new Attachment();

            const _attachmentName = moment().unix().toString();

            attachment.attachableType = attachableType;
            attachment.attachableUid = attachableUid;
            attachment.attachableFormat = attachableFormat;
            attachment.attachmentExtension = attachmentExtension;
            attachment.attachmentName = _attachmentName;
            attachment.attachmentOGName = attachmentName;

            try {
                // Save the new file
                const location = await saveFileToDisk(
                    attachemntData,
                    _attachmentName,
                    attachmentExtension.toString().toLowerCase()
                );

                if (location) {
                    attachment.attachemntDriveLocation = location;
                    attachment.attachemntData = attachemntData;

                    const saved = await repo.save(attachment);

                    return response(
                        this.getEntityById<Attachment>(
                            repo,
                            saved.id,
                            this.rels
                        ),
                        res
                    );
                }
            } catch (e) {
                console.error(e);
                throw new Error("Error while saving attachment");
            }
        }
    }


    // async saveAttachment({ attachableUid, attachableType, attachableFormat, attachemntData, attachmentExtension, attachmentName, uuid }: AttachmentInput): Promise<ResponsePayload> {
    //     const res = new ResponseAttachment();

    //     const dbAtt = await this.attachRepo.findOne({
    //         where: {
    //             deleted: false,
    //             attachableUid,
    //             attachableType,
    //             uuid
    //         }
    //     });




    //     if (dbAtt) {
    //         const attachment = dbAtt;

    //         const _attachmentName = moment().unix().toString();

    //         attachment.attachableType = attachableType;
    //         attachment.attachableUid = attachableUid;
    //         attachment.attachableFormat = attachableFormat;
    //         attachment.attachmentExtension = attachmentExtension;
    //         attachment.attachmentName = _attachmentName;
    //         attachment.attachmentOGName = attachmentName;

    //         try {

    //             await deleteFileFromDisk(attachment.attachemntDriveLocation);

    //             const location = await saveFileToDisk(attachemntData, _attachmentName, attachmentExtension.toString().toLowerCase());

    //             if (location) {
    //                 attachment.attachemntDriveLocation = location;
    //                 attachment.attachemntData = attachemntData;
    //                 const saved = await this.attachRepo.save(attachment);

    //                 return response(
    //                     this.getEntityById<Attachment>(
    //                         this.attachRepo,
    //                         saved.id,
    //                         this.rels
    //                     ), res
    //                 );

    //             }

    //         } catch (e) {
    //             console.log(e)
    //             throw new Error('Error while saving attachment');
    //         }
    //     } else {

    //         const attachment = new Attachment();

    //         const _attachmentName = moment().unix().toString();

    //         attachment.attachableType = attachableType;
    //         attachment.attachableUid = attachableUid;
    //         attachment.attachableFormat = attachableFormat;
    //         attachment.attachmentExtension = attachmentExtension;
    //         attachment.attachmentName = _attachmentName;
    //         attachment.attachmentOGName = attachmentName;

    //         try {
    //             const location = await saveFileToDisk(attachemntData, _attachmentName, attachmentExtension.toString().toLowerCase());

    //             if (location) {
    //                 attachment.attachemntDriveLocation = location;
    //                 attachment.attachemntData = attachemntData;
    //                 const saved = await this.attachRepo.save(attachment);

    //                 return response(
    //                     this.getEntityById<Attachment>(
    //                         this.attachRepo,
    //                         saved.id,
    //                         this.rels
    //                     ), res
    //                 );

    //             }

    //         } catch (e) {
    //             console.log(e)
    //             throw new Error('Error while saving attachment');
    //         }
    //     }

    // }

}