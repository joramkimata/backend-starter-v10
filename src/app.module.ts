import { Module } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';
import ormConfig from './config/orm.config';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    SettingsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [ormConfig],
      isGlobal: true,
      ignoreEnvFile: Boolean(process.env.IGNORE_ENV_FILE || false) // when using docker env set to true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    SharedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
