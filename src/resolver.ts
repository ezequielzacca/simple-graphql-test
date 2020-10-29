import { Arg, Field, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from "type-graphql";

@ObjectType()
class Person {
    @Field()
    name!: string;
}

@Resolver()
export class MyResolver {

    _person: Person = { name: "John Doe" };

    @Query(returns => Person)
    async person() {
        return this._person;
    }

    @Mutation(returns => Person)
    async updatePerson(@Arg("name") name: string, @PubSub() pubSub: PubSubEngine) {
        this._person.name = name;
        await pubSub.publish("NAME_CHANGE", this._person);
        return this._person;
    }

    @Subscription({
        topics: "NAME_CHANGE"
    })
    personUpdateFeed(@Root() payload: Person): Person {
        return payload;
    }
}