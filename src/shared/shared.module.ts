import { Module } from '@nestjs/common';
import { SharedResolver } from './resolvers/shared.resolver';

@Module({
  providers: [SharedResolver]
})
export class SharedModule {}
