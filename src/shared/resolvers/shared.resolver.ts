import { Query, Resolver } from '@nestjs/graphql';


@Resolver(of => String)
export class SharedResolver {

    @Query(returns => String)
    sayHello() {
      return "Hello GraphQL!";
    }

}