import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: Int!
    username: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    recipes: [Recipe!]
    menus: [Menu!]!
  }

  type Recipe {
    id: Int!
    name: String!
    description: String
    recipeIngredients: [RecipeIngredient!]!
    createdBy: User!
    userId: Int!
  }

  type RecipeIngredient {
    ingredient: Ingredient!
    quantity: Float!
  }

  type Menu {
    id: Int!
    name: String!
    description: String
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

  input IngredientInput {
    ingredientId: Int!
    quantity: Float!
    unit: String!
  }

  input CreateRecipeInput {
    name: String!
    description: String
    ingredients: [IngredientInput!]!
    userId: Int!
  }

  type Ingredient {
    id: Int!
    name: String!
    category: String
    unit: Unit
  }

  type Unit {
    id: Int!
    unit: String!
  }

  type Query {
    user(id: Int!): User
    users: [User!]!
    recipe(id: Int!): Recipe
    recipes: [Recipe!]!
    searchIngredients(searchTerm: String!): [Ingredient!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createRecipe(input: CreateRecipeInput!): Recipe!
  }
`;
