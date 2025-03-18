import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(email: string): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(user_id: string, updateUserDto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(user_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
