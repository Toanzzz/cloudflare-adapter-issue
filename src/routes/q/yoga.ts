import { createYoga, createSchema } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { SiweMessage } from "siwe";

export const yoga = createYoga({
  schema: createSchema({
    typeDefs: `#graphql
      type Query {
        hello: String
      }
      type Mutation {
        siwe_init(input: SiweInitInput!): String!
        siwe_verify(input: SiweVerifyInput!): String!
      }
      
      input SiweInitInput {
        address: String!
      }
      input SiweVerifyInput {
        message: String!
        signature: String!
      }
    `,
    resolvers: {
      Query: { hello: () => "world" },
      Mutation: {
        siwe_init: (_, { input }) =>
          new SiweMessage({
            domain: "localhost",
            address: input.address,
            uri: "http://localhost/login",
            version: "1",
            chainId: 1,
          }).prepareMessage(),
        siwe_verify: async (_, { input: { message, signature } }) => {
          const result = await new SiweMessage(message).verify({ signature });
          if (!result.success) throw new GraphQLError("Invalid signature");

          // Verified, generate and return access token
          // (removed for the sake of simplicity)
          return "this.is.your.accesstoken";
        },
      },
    },
  }),
  graphqlEndpoint: "/q",
  fetchAPI: globalThis,
});
