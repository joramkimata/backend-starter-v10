import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { PermissionService } from './services/permission.service';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionResolver } from './resolvers/permission.resolver';
import { RoleResolver } from './resolvers/role.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { DiscoveryModule } from '@nestjs/core';
import { DiscoveryService } from '@golevelup/nestjs-discovery';

@Module({
    imports: [
        AuthModule,
        DiscoveryModule,
        TypeOrmModule.forFeature([
            User,
            Role,
            Permission
        ])
    ],
    providers: [
        UserResolver,
        UserService,
        DiscoveryService,
        RoleService,
        RoleResolver,
        PermissionService,
        PermissionResolver
    ],
    exports: [
        UserService
    ]
})
export class UsersModule implements OnModuleInit {

    constructor(
        private permissionService: PermissionService,
        private roleService: RoleService,
        private userService: UserService,
        private discoveryService: DiscoveryService
    ) { }

    async onModuleInit() {
        await this.roleService.seedPermanentRoles();
        await this.permissionService.seedPermissions(this.discoveryService);
        await this.userService.seedAdmin();
    }
}

