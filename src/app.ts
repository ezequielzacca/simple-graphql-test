import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express, { json, Request, text } from "express";
import http from "http";

import path from "path";
import { buildSchema } from "type-graphql";
import { MyResolver } from "./resolver";




const startServer = async () => {
    const app = express();
    app.use(json({ limit: "5mb" }));
    app.use(text({ limit: "5mb" }));
    app.use(cors());
    app.use(express.static(path.join(__dirname, "wwwroot")));
    const httpServer = new http.Server(app);

    const schema = await buildSchema({
        resolvers: [MyResolver]
    });


    //const schema = await gqlSchema();
    const server = new ApolloServer({
        introspection: true,
        playground: true,
        schema
    });
    //this is a commentary

    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);

    const apolloGraphQLServerUrl = `localhost:${process.env.PORT || 4002}${server.graphqlPath
        }`;

    // This `listen` method launches a web-server.  Existing apps
    const PORT = +(process.env.PORT || 4002);
    // can utilize middleware options, which we'll discuss later.
    httpServer.listen({ port: PORT }, async () => {
        console.log(`🚀 Server ready at http://${apolloGraphQLServerUrl}`);
        console.log(`🚀 Subscriptions ready at ws://${apolloGraphQLServerUrl}`);
    });
    return apolloGraphQLServerUrl;

    //Register endpoint for listen knime LOGS
};

startServer()
    .catch(console.log);
process.on("warning", (e) => console.warn(e.stack));
