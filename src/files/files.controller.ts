import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // VALIDATE FILE
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(
  // validate file của nest js
  @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        // fileType: 'jpeg',
        fileType:/^(jpg|png|jpeg|image\/jpeg|gif|txt|pdf|application\/pdf|docx|doc|text\/plain)$/i,
        // chỉ cho phép up file dạng này
      })
      .addMaxSizeValidator({
        maxSize: 100*1024*1024 // = 1mb
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        // mã lỗi 422
      }),
  
) file : Express.Multer.File)
{
  console.log(file)
}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
