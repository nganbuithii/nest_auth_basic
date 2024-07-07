
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;
export class Company {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    description: string;

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
export const CompanySchema = SchemaFactory.createForClass(Company);