import React from 'react';
import { gql, useMutation } from '@apollo/client';

import { LoginForm, Loading } from '../components';
import * as LoginTypes from './__generated__/Login';

import { isLoggedInVar } from '../cache'; 

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      token
    }
  }
`;

// login is the mutate function called to execute the mutation
// whenever user submits the login form, login mutation is called
export default function Login() {
  const [login, { loading, error }] = useMutation<
    LoginTypes.Login,
    LoginTypes.LoginVariables
  >(LOGIN_USER,
    {
      // callback to interact with mutation's result data as soon as it's available
      // to persist user's token and id, store them in localStorage
      onCompleted({ login }) {
        if (login) {
          localStorage.setItem('token', login.token as string);
          localStorage.setItem('userId', login.id as string);
          isLoggedInVar(true);
        }
      }
    }
    )


  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}
