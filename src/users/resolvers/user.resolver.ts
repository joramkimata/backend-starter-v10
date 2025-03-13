import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";
import { PaginatedInput } from "src/shared/inputs/pagination.input";
import { HasPermission } from "../decorators/has-permission.decorator";
import { User } from "../entities/user.entity";
import { PermissionGroupName } from "../enums/permission-group-name.enum";
import { AssignRolesInput } from "../inputs/assign-roles.input";
import { ResponseUserPaginated, ResponseUser } from "../responses/user.response";
import { UserService } from "../services/user.service";
import { GqlAuthGuard } from "src/auth/guards/graphql.guard";
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { UserInput } from "../inputs/user.input";


@Resolver(of => User)
@UseGuards(GqlAuthGuard, PermissionGuard)
@HasPermission({ displayName: "View Users", name: "VIEW_USERS", permissionGroupName: PermissionGroupName.UAA })

export class UserResolver {

    constructor(
        private userService: UserService
    ) { }


    @Mutation(returns => ResponseUser)
    createUser(
        @Args('input')
        input: UserInput
    ) {
        return this.userService.createUser(input);
    }

    @Query(returns => User, { nullable: true })
    getUser(
        @Args('uid') uid: string
    ) {
        return this.userService.getUser(uid);
    }

    @Query(returns => ResponseUserPaginated)
    getAllUsersPaginated(
        @Args('input')
        input: PaginatedInput
    ) {
        return this.userService.getAllUsersPaginated(input);
    }

    @HasPermission({
        name: "ACTIVATE_USERS",
        displayName: "Activate Users",
        description: "Activate Users",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseUser)
    activateUser(
        @Args('uuid')
        uuid: string,
    ) {
        return this.userService.activateUser(uuid);
    }

    @HasPermission({
        name: "BLOCK_USERS",
        displayName: "Block Users",
        description: "Block Users",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseUser)
    blockUser(
        @Args('uuid')
        uuid: string,
    ) {
        return this.userService.blockUser(uuid);
    }

    @HasPermission({
        name: "CHANGE_USER_PASSWORD",
        displayName: "Change User Password",
        description: "Change User Password",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseUser)
    changeUserPassword(
        @Args('uuid')
        uuid: string,
        @Args('password')
        password: string,
        @Args('confirmPassword')
        confirmPassword: string
    ) {
        return this.userService.changeUserPassword(uuid, password, confirmPassword);
    }

    @HasPermission({
        name: "ASSIGN_ROLES",
        displayName: "Assign Roles to Users",
        description: "Assign Roles to Users",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseUser)
    assignRoles(
        @Args('assignRolesInput')
        assignRolesInput: AssignRolesInput
    ) {
        return this.userService.assignRoles(assignRolesInput);
    }
}