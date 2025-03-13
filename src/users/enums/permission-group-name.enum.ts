import { registerEnumType } from "@nestjs/graphql";


export enum PermissionGroupName {
    "UAA" = "UAA",
    "SETTINGS" = "SETTINGS",
    "DASHBOARD" = "DASHBOARD",
    "PURCHASES" = "PURCHASES",
    "SALES" = "SALES",
    "BILLS" = "BILLS",
    "EXPENSES" = "EXPENSES",
    "RECONCILIATION" = "RECONCILIATION",
    "REPORT" = "REPORT",
}

registerEnumType(PermissionGroupName, {
    name: "PermissionGroupName"
})