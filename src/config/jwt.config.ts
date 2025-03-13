import { JwtModuleOptions } from "@nestjs/jwt";


export default (): JwtModuleOptions => ({
    secret: process.env.SECURITY_KEY,
    signOptions: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    }
});