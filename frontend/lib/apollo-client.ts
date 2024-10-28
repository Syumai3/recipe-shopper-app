import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// 環境変数の確認用ログ（開発時のみ）
if (process.env.NODE_ENV === 'development') {
  console.log('GraphQL Endpoint:', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
}

// URIが未定義の場合のフォールバックも修正
const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4001/graphql',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
