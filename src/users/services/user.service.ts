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
import { AssignRolesInput } from "../inputs/assign-roles.input";
import { ResponseUser } from "../responses/user.response";
import response from "src/shared/helpers/response.helper";
import { UserInput } from "../inputs/user.input";


@Injectable()
export class UserService extends BaseService {



    private logger = new Logger(UserService.name);

    private relations = ['roles', 'roles.permissions']

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>
    ) {
        super();
    }

    async createUser(input: UserInput) {
        const res = new ResponseUser()

        const dbUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                username: input.username
            }
        });

        if (dbUser) {
            return response(null, res, `User exists`, HttpStatusCode.DUPLICATE)
        }

        const newUser = new User();
        newUser.fullName = input.fullName;
        newUser.email = input.email;
        newUser.username = input.username;
        newUser.userType = UserTypeEnum.STAFF;
        newUser.password = await hashing(input.password);

        const saved = await this.userRepository.save(newUser);

        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    getUser(uid: string) {
        return this.userRepository.findOne({
            where: {
                deleted: false,
                uuid: uid,
            },
            relations: this.relations
        });
    }

    async changeUserPassword(uuid: string, password: string, confirmPassword: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        if (password !== confirmPassword) {
            return response(null, res, `Password mismatches`, HttpStatusCode.PASSWORD_MISMATCH);
        }

        existingUser.password = await hashing(password);

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    async blockUser(uuid: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        existingUser.active = false;

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    async activateUser(uuid: string) {
        const res = new ResponseUser();

        const existingUser = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!existingUser) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        existingUser.active = true;

        const saved = await this.userRepository.save(existingUser);


        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    getAllUsersPaginated(input: PaginatedInput) {
        return this.getPaginatedDataWhere(
            this.userRepository,
            input.pageNumber,
            input.pageSize,
            { deleted: false } as any,
            this.relations,
        );
    }

    async seedAdmin() {

        const em = "admin"

        const dbUser = await this.userRepository.findOne({
            where: {
                username: em,
                deleted: false,
                active: true
            }
        });

        let adminRole = await this.getAdminRoleWithLatestPermissions();

        if (!dbUser) {
            const user = new User();
            user.username = em;
            user.active = true;
            user.fullName = 'Administrator';
            user.password = await hashing('admin.2024');
            user.userType = UserTypeEnum.ADMIN;
            user.roles = [adminRole];
            await this.userRepository.save(user);
            this.logger.debug('**** Administrator was created successfully!');

        }

        // console.log(await hashing('admin.2022'))
    }

    private async getAdminRoleWithLatestPermissions() {
        const dbRole = await this.roleRepository.findOne({
            where: {
                name: 'ADMIN',
                deleted: false
            }
        });

        const permissions = await this.permissionRepository.find({
            where: {
                deleted: false,
                // permissionGroupName: In([
                //     PermissionGroupName.UAA,
                //     PermissionGroupName.SETTINGS,
                // ])
            }
        });


        if (!dbRole) {
            const role = new Role();
            role.name = 'ADMIN';
            role.description = 'Administrator';
            role.displayName = 'Administrator';
            role.isPermanent = true;

            if (permissions.length) {
                role.permissions = permissions;
            }

            const adminRole = await this.roleRepository.save(role);

            return adminRole;
        } else {
            // delete all role permissions of admin
            await this.deleteRolePermissions(dbRole.id);

            if (permissions.length) {
                dbRole.permissions = permissions;
                this.logger.debug('**** Administrator Permissions was updated successfully');
            }

            const adminRole = await this.roleRepository.save(dbRole);

            return adminRole;
        }
    }

    private deleteRolePermissions(id: number) {
        return this.roleRepository.query(`delete from ${process.env.DB_PREFIX}_role_permissions where role_id=${id}`)
    }


    async assignRoles(assignRolesInput: AssignRolesInput) {
        const res = new ResponseUser();

        const { userUUID: uuid, roleUUIDs } = assignRolesInput;

        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!user) {
            return response(null, res, `User not found!`, HttpStatusCode.NO_FOUND);
        }

        let roles: Role[] = [];

        try {
            roles = await this.validateRoles(roleUUIDs);
        } catch (err) {
            return response(null, res, `${err.message}`, HttpStatusCode.THROWN_ERROR);
        }

        if (roles.length > 0) {
            // delete roles assigned user
            await this.deleteRoles(user.id);

            user.roles = roles;
        }


        const saved = await this.userRepository.save(user);

        return response(
            this.getEntityById(
                this.userRepository,
                saved.id,
                this.relations
            ),
            res
        );
    }

    private validateRoles(uuids: string[]): Role[] | PromiseLike<Role[]> {
        const promise: Promise<Role[]> = new Promise(async (resolve, reject) => {

            const roles = uuids.map(async uuid => {
                const role = await this.roleRepository.findOne({
                    where: {
                        deleted: false,
                        uuid
                    }
                });
                if (!role) {
                    reject(`Role ${uuid} not message`)
                }

                return role;
            });

            const mroles = await Promise.all(roles);

            resolve(mroles);

        });

        return promise;
    }

    private deleteRoles(id: number) {
        return this.userRepository.query(`delete from ${process.env.DB_PREFIX}_user_roles where user_id=${id}`);
    }

}