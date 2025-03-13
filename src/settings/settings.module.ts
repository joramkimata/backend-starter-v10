import { Module } from '@nestjs/common';
import { UomResolver } from './resolvers/uom.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uom } from './entities/uom.entity';
import { UomService } from './services/uom.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Uom
    ])
  ],
  providers: [
    UomResolver,
    UomService
  ]
})
export class SettingsModule {}
