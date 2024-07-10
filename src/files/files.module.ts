import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './Schemas/file.schema';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  MulterModule.registerAsync({
    useClass:MulterConfigService,
  })
],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
