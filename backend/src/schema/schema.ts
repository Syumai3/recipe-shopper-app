import { gql } from "apollo-server";

export const typeDefs = gql`
 scalar DateTime

type User {
    id:ID!
    username:String!
    email:String!
    createdAt: DateTime!
    updatedAt: DateTime!
    recipes:[Recipe!]
    menus: [Menu!]!
}

type Recipe {
    id:ID!
    name:String!
    description:String
    ingredients:[String!]!
    createdBy:User!
    userId: ID! 
}

type Menu {
    id:ID!
    name:String!
    description:String
    startDate: DateTime!
    endDate: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
}

input CreateUserInput {
  username: String!
  email: String!
  password: String!
}

input IngredientInput{
    ingredientId:ID!,
    quantity:Float!,
    unit:String!
}

type Query {
    user(id:ID!):User
    users:[User!]!
    recipe(id:ID!):Recipe
    recipes:[Recipe!]!
}

type Mutation {
    createUser(input: CreateUserInput!): User!
    createRecipe(name:String!, description:String, ingredients:[IngredientInput!]!, userId:ID!):Recipe!
}
`;
