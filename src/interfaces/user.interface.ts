// src/interfaces/user.interface.ts

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    isDeleted?: Date;
    deleteAt?: Date;
    role:string;
}
