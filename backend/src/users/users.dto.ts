import { IsEmail } from "class-validator"

export class UserDto {
    @IsEmail()
    email!: String
    password!: String
}