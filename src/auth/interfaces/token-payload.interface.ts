import { User } from "src/users/entities/user.entity";


export interface TokenPayload {
    user: User,
    refreshToken: boolean,
    permissions?: String[]
}