import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { AuthMessages } from "../enums/auth-message.enum";


@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    handleRequest(err: any, user: any, info: any) {

        if (err || !user) {
            throw err || new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        return user;
    }
} 