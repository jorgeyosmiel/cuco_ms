import { Module, Logger } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [],
  controllers: [StorageController],
  providers: [StorageService, Logger],
})
export class StorageModule {}
