import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;
    @Prop()
    age: number;
    @Prop()
    gender: string;

    @Prop()
    role: string;

    @Prop()
    refeshToken: string;
    // nếu là HR
    @Prop({type:Object})
    company: {
        _id:mongoose.Schema.Types.ObjectId;
        email:string;
    }


    // muốn sử dụng soft delete thì phải thêm 2 trường nay
    @Prop()
    isDeleted: Date;

    @Prop()
    deleteAt: Date;

    @Prop({ type : Object})
    createdBy:{
        _id: mongoose.Schema.Types.ObjectId;
        email:string
    }


    @Prop({ type: Object})
    updatefBy:{
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({type:Object})
    deletedBy:{
        _id:mongoose.Schema.Types.ObjectId;
        email:string;
    }

    @Prop()
    createdDate: Date

    @Prop()
    updatedDate:Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
