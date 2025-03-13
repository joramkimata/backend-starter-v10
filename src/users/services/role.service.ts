import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import { PaginatedInput } from "src/shared/inputs/pagination.input";
import { BaseService } from "src/shared/services/base.service";
import { Repository, Not } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";
import { AssignPermissionsInput } from "../inputs/assign-permissions.input";
import { ResponseRole } from "../responses/role.response";
import response from "src/shared/helpers/response.helper";
import { RoleInput } from "../inputs/role.input";


interface IRole {
    name: string,
    displayName: string,
    description: string,
    isPermanent: boolean
}

@Injectable()
export class RoleService extends BaseService {

    relations = ['permissions'];

    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>
    ) {
        super();
    }

    private logger = new Logger(RoleService.name);

    private permanentRoles: IRole[] = [
        {
            displayName: "Saler",
            description: "Saler",
            isPermanent: true,
            name: "SALER"
        },
        {
            displayName: "Manager",
            description: "Manager",
            isPermanent: true,
            name: "MANAGER"
        }
    ];

    async seedPermanentRoles() {
        for (let role of this.permanentRoles) {
            const dbRole = await this.roleRepository.findOne({
                where: {
                    deleted: false,
                    name: role.name
                }
            });

            if (!dbRole) {
                const newRole = new Role();
                newRole.name = role.name;
                newRole.displayName = role.displayName,
                    newRole.description = role.description;
                newRole.isPermanent = role.isPermanent;

                await this.roleRepository.save(newRole);

                this.logger.log(`ROLE: ${role.name} was seeded successiful...`);
            }
        }
    }


    async assignPermissions(input: AssignPermissionsInput) {

        const { roleUUID: uuid, permissionUUIDs } = input;
        const res = new ResponseRole();

        const dbRole = await this.roleRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!dbRole) {
            return response(null, res, `Role ${uuid} not found`, HttpStatusCode.NO_FOUND);
        }

        let permissions: Permission[] = [];

        try {
            permissions = await this.validatePermissions(permissionUUIDs);

        } catch (err) {
            return response(null, res, `${err.message}`, HttpStatusCode.THROWN_ERROR);
        }

        if (permissions.length > 0) {
            // delete assigned permissions
            await this.deleteRolePermissions(dbRole.id);

            // re-populate new ones
            dbRole.permissions = permissions;
        } else {
            await this.deleteRolePermissions(dbRole.id);
        }


        const saved = await this.roleRepository.save(dbRole);

        return response(
            this.getEntityById(
                this.roleRepository,
                saved.id,
                this.relations
            ),
            res
        );


    }

    private deleteRolePermissions(id: number) {
        return this.roleRepository.query(`delete from ${process.env.DB_PREFIX}_role_permissions where role_id=${id}`);
    }

    private validatePermissions(permissionUUIDs: string[]): Permission[] | PromiseLike<Permission[]> {
        const promise: Promise<Permission[]> = new Promise(async (resolve, reject) => {

            const permissions = permissionUUIDs.map(async ruuid => {
                const permission = await this.permissionRepository.findOne({
                    where: {
                        uuid: ruuid,
                        deleted: false,
                    }
                });

                if (!permission) {
                    reject(`Permission: ${ruuid} not found`);
                }

                return permission;
            });

            const mpermissions = await Promise.all(permissions);

            resolve(mpermissions);
        });

        return promise;
    }

    getRole(uuid: string) {
        return this.roleRepository.findOne({
            where: {
                uuid,
                deleted: false,
            },
            relations: this.relations
        });
    }

    getRoles() {
        return this.roleRepository.find({
            where: {
                deleted: false,
            },
            relations: this.relations
        });
    }

    getRolesPaginated({ pageNumber, pageSize, searchTerm }: PaginatedInput) {

        if (searchTerm) {
            return this.searchPaginated(this.roleRepository, searchTerm, pageNumber, pageSize);
        }

        return this.getPaginatedDataWhere<Role>(this.roleRepository, pageNumber, pageSize, null, ['permissions'])
    }


    async deleteRole(uuid: string) {
        const res = new ResponseRole();
        const mRole = await this.roleRepository.findOne({
            where: {
                uuid,
                deleted: false,
            }
        });

        if (!mRole) {
            return response(null, res, `Role not found`, HttpStatusCode.NO_FOUND);
        }

        mRole.deleted = true;

        const saved = await this.roleRepository.save(mRole);

        return response(
            this.getEntityById(
                this.roleRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    async updateRole(uuid: string, updateRoleInput: RoleInput) {
        const res = new ResponseRole();

        const { description, displayName, name } = updateRoleInput;

        const mRole = await this.roleRepository.findOne({
            where: {
                uuid,
                deleted: false,
            }
        });

        if (!mRole) {
            return response(null, res, `Role not found`, HttpStatusCode.NO_FOUND);
        }

        const dbRole = await this.roleRepository.findOne({
            where: {
                name,
                deleted: false,
                id: Not(mRole.id)
            }
        });

        if (dbRole) {
            return response(null, res, `Role exists`, HttpStatusCode.DUPLICATE);
        }

        mRole.name = name;
        mRole.displayName = displayName;
        mRole.description = description;

        const saved = await this.roleRepository.save(mRole);

        return response(
            this.getEntityById(
                this.roleRepository,
                saved.id,
                this.relations
            ),
            res
        );

    }

    async createRole(input: RoleInput) {
        const res = new ResponseRole();
        const { description, displayName, name } = input;
        const dbRole = await this.roleRepository.findOne({
            where: {
                name,
                deleted: false,
            }
        });

        if (dbRole) {
            return response(null, res, `Role exists`, HttpStatusCode.DUPLICATE);
        }

        const role = new Role();
        role.name = name;
        role.displayName = displayName;
        role.description = description;

        const saved = await this.roleRepository.save(role);

        return response(
            this.getEntityById(
                this.roleRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

}