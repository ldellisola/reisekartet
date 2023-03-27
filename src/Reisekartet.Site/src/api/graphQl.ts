import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";

const httpLink = createHttpLink({
    uri: "/api/graphql"
});

const cache = new InMemoryCache();

export const graphQlClient = new ApolloClient({
    link: httpLink,
    cache
});
