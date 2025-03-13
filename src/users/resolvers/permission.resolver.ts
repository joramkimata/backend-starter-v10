
import { Resolver, Args, Query } from "@nestjs/graphql";
import { HasPermission } from "../decorators/has-permission.decorator";
import { GroupedByPermissionGroupNameDto } from "../dto/grouped-by-permission-group-name.dto";
import { Permission } from "../entities/permission.entity";
import { PermissionGroupName } from "../enums/permission-group-name.enum";
import { PermissionService } from "../services/permission.service";


@Resolver(of => Permission)
@HasPermission({
    name: 'VIEW_PERMISSIONS',
    displayName: 'Can View Permissions',
    description: 'Can View Permissions',
    permissionGroupName: PermissionGroupName.UAA
})
export class PermissionResolver {
    constructor(
        private permissionService: PermissionService
    ) { }

    @Query(returns => [Permission])
    getAllPermissions() {
        return this.permissionService.getPermissions();
    }

    @Query(returns => [GroupedByPermissionGroupNameDto])
    getAllPermissionsGroupedByPermissionGroupName(
        @Args('roleUuid') roleUuid: string
    ) {
        return this.permissionService.getAllPermissionsGroupedByPermissionGroupName(roleUuid);
    }
}