import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { Job, JobSchema } from '@/jobs/schemas/job.schema';
import { Resume, ResumeSchema } from '@/resumes/schemas/resume.schema';
import { Permission, PermissionSchema } from '@/permissions/schemas/permission.schema';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    MongooseModule.forFeature([{name: Resume.name, schema: ResumeSchema}]),
    MongooseModule.forFeature([{name: Permission.name, schema: PermissionSchema}]),

  ],
  // khi muốn tạo fake data thì ta sẽ viết trực tiếp trong database services

})
export class DatabasesModule { }
