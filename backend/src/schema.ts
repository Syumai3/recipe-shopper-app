import { gql } from "apollo-server";

export const typeDefs = gql`

type User {
    id:ID!
    username:String!
    email:String!
    recipes:[Recipe!]
}

type Recipe {
    id:ID!
    title:String!
    description:String
    ingredients:[String!]!
    cereateBy:User!
}

type Query {
    user(id:ID!):User
    users:[User!]!
    recipe(id:ID!):Recipe
    recipes:[Recipe!]!
}

type Mutation {
    createUser(username:String!, email:String!):User!
    createRecipe(title:String!, description:String, ingredients:[String!]!, userId:ID!):Recipe!
}
`;
