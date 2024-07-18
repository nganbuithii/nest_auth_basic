import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
    @Prop()
    filename: string;

    @Prop()
    mimetype: string;

    @Prop()
    size: number;

    @Prop()
    path: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
