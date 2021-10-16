import {
    ApolloClient,
    NormalizedCacheObject,
    // connect Apollo Client to React
    ApolloProvider,
    gql,
    useQuery
  } from '@apollo/client';
  import { cache } from './cache';
  import React from 'react';
  import ReactDOM from 'react-dom';
  import Pages from './pages';
  import injectStyles from './styles';
  import Login from './pages/login';

  // client-side extended schema to query local data in Apollo cache
  export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;

// tell Apollo Client not to fetch field's value from the server
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}
  
  // Initialize ApolloClient
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
    // to verify whether user has permission
    headers: {
        // server can ignore token when resolving operations don't require it
        authorization: localStorage.getItem('token') || '',
      },
      typeDefs
  });
  
  injectStyles();
  
  // Pass the ApolloClient instance to the ApolloProvider component
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
  );
  
  


  