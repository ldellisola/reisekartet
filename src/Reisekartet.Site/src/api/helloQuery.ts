import {graphQlClient} from "@/api/graphQl";
import gql from "graphql-tag";

export const helloWorld = async () => {
    const {data, errors} = await graphQlClient.query({
        query: gql`
            query {
                hello
            }
        `
    });
    return data.hello;
}
