import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";


export const GetGqlUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const context = GqlExecutionContext.create(ctx);

        const { user } = context.getContext().req;

        return user;
    }
)