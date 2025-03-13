import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import { hashing } from "src/shared/helpers/hashing.helper";
import { PaginatedInput } from "src/shared/inputs/pagination.input";
import { BaseService } from "src/shared/services/base.service";
import { Repository, In } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { PermissionGroupName } from "../enums/permission-group-name.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import response from "src/shared/helpers/response.helper";
import { ResponseUser } from "../responses/user.response";
import { AssignRolesInput } from "../inputs/assign-roles.input";
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { GroupedByPermissionGroupNameDto } from "../dto/grouped-by-permission-group-name.dto";
import { IPermission } from "../decorators/has-permission.decorator";


@Injectable()
export class PermissionService {


    private logger = new Logger(PermissionService.name);

    constructor(
        @InjectRepository(Permission)
        private permissionReposity: Repository<Permission>,
        @InjectRepository(Role)
        private roleRepo: Repository<Role>
    ) { }

    getPermissions() {
        return this.permissionReposity.find({
            where: {
                deleted: false
            }
        });
    }

    getAllPermissionsByGroupName(groupName: PermissionGroupName) {
        console.log('Calling...[getAllPermissionsByGroupName]')
    }

    async seedPermissions(discoveryService: DiscoveryService) {
        try {
            const methodLevelPermissions = await discoveryService.providerMethodsWithMetaAtKey<IPermission>('permission');
            const classLevelPermissions = await discoveryService.providersWithMetaAtKey<IPermission>('permission');

            const permissions = [
                ...methodLevelPermissions.map(p => p.meta),
                ...classLevelPermissions.map(p => p.meta),
            ];

            const newPermissions: Permission[] = [];

            for (const permissionMeta of permissions) {
                const existingPermission = await this.permissionReposity.findOne({
                    where: {
                        name: permissionMeta.name,
                        deleted: false,
                        permissionGroupName: permissionMeta.permissionGroupName,
                    },
                });

                if (!existingPermission) {
                    const newPermission = new Permission();
                    Object.assign(newPermission, {
                        displayName: permissionMeta.displayName,
                        name: permissionMeta.name,
                        permissionGroupName: permissionMeta.permissionGroupName,
                        description: permissionMeta.description,
                    });

                    await this.permissionReposity.save(newPermission);
                    newPermissions.push(newPermission);
                }
            }

            if (newPermissions.length > 0) {
                this.logger.debug(`**** ${newPermissions.length} Permissions seeded successfully ****`);
            } else {
                this.logger.debug(`**** No new permissions to seed ****`);
            }
        } catch (error) {
            this.logger.error('An error occurred while seeding permissions:', error);
        }
    }

    async getAllPermissionsGroupedByPermissionGroupName(roleUuid: string) {

        const role = await this.roleRepo.findOne({
            where: {
                deleted: false,
                uuid: roleUuid
            },
            relations: ['permissions']
        });

        if (!role) return [];

        const permxUuids = role.permissions.map(p => p.uuid);


        const all = Object.values(PermissionGroupName).map(async g => {
            const dto = new GroupedByPermissionGroupNameDto();
            dto.permissionGroupName = g;

            const permissions = await this.permissionReposity.find({
                where: {
                    deleted: false,
                    permissionGroupName: g
                }
            });

            dto.permissions = permissions.map(p => {

                if (permxUuids.includes(p.uuid)) {
                    p.belongToThisRole = true;
                } else {
                    p.belongToThisRole = false;
                }

                return p;
            });

            return dto;
        });

        return Promise.all(all);
    }

}