import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { PaginatedInput } from "src/shared/inputs/pagination.input";
import { HasPermission } from "../decorators/has-permission.decorator";
import { Role } from "../entities/role.entity";
import { PermissionGroupName } from "../enums/permission-group-name.enum";
import { AssignPermissionsInput } from "../inputs/assign-permissions.input";
import { RoleInput } from "../inputs/role.input";
import { ResponseRole, ResponseRolePaginated } from "../responses/role.response";
import { RoleService } from "../services/role.service";
import { GqlAuthGuard } from "src/auth/guards/graphql.guard";
import { PermissionGuard } from "src/auth/guards/permission.guard";


@Resolver(of => Role)
@UseGuards(GqlAuthGuard, PermissionGuard)
@HasPermission({
    name: "VIEW_ROLES",
    displayName: "View Roles",
    description: "View Roles",
    permissionGroupName: PermissionGroupName.UAA,
})
export class RoleResolver {

    constructor(private roleService: RoleService) { }

    @HasPermission({
        name: "SAVE_ROLES",
        displayName: "Save Roles",
        description: "Save Roles",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseRole)
    createRole(
        @Args('input') input: RoleInput
    ) {
        return this.roleService.createRole(input);
    }

    @HasPermission({
        name: "UPDATE_ROLES",
        displayName: "Save Roles",
        description: "Save Roles",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseRole)
    updateRole(
        @Args('uuid') uuid: string,
        @Args('updateRoleInput') updateRoleInput: RoleInput
    ) {
        return this.roleService.updateRole(uuid, updateRoleInput);
    }

    @HasPermission({
        name: "DELETE_ROLES",
        displayName: "Delete Roles",
        description: "Delete Roles",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseRole)
    deleteRole(
        @Args('uuid') uuid: string,
    ) {
        return this.roleService.deleteRole(uuid);
    }

    @Query(returns => [Role],)
    getRoles() {
        return this.roleService.getRoles();
    }

    @Query(returns => ResponseRolePaginated,)
    getRolesPaginated(
        @Args('input')
        input: PaginatedInput
    ) {
        return this.roleService.getRolesPaginated(input);
    }

    // Query for Get One
    @Query(returns => Role, { nullable: true })
    getRole(
        @Args('uuid') uuid: string
    ) {
        return this.roleService.getRole(uuid);
    }

    @HasPermission({
        name: "ASSIGN_PERMISSIONS",
        displayName: "Assign Permissions to Role",
        description: "Assign Permissions to Role",
        permissionGroupName: PermissionGroupName.UAA,
    })
    @Mutation(returns => ResponseRole)
    assignPermissions(
        @Args('input')
        input: AssignPermissionsInput
    ) {
        return this.roleService.assignPermissions(input);
    }
}