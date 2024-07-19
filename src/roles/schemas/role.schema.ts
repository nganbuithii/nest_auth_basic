import { Permission } from "@/permissions/schemas/permission.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type RoleDocument = HydratedDocument<Role>;



@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string
    @Prop()
    description: string
    @Prop()
    isActive: boolean
    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
    permissions: Permission[]

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string
    }


    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Date })
    createdDate: Date;

    @Prop({ type: Date })
    updatedDate: Date;

    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt:Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);