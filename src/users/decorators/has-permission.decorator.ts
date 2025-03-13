import { SetMetadata } from "@nestjs/common";
import { PermissionGroupName } from "../enums/permission-group-name.enum";


export interface IPermission {
    name: string,
    displayName: string,
    description?: string,
    permissionGroupName: PermissionGroupName
}

export const HasPermission = (ipermission: IPermission) => SetMetadata('permission', ipermission);