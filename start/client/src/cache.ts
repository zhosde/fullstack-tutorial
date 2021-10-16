import { InMemoryCache, Reference, makeVar } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
            // define field policies to tell Apollo Client how to query those fields
            // field func be called whenever that field is queried
            isLoggedIn: {
                read() {
                  return isLoggedInVar();
                }
              },
              cartItems: {
                read() {
                  return cartItemsVar();
                }
              },
          launches: {
            keyArgs: false,
            merge(existing, incoming) {
              let launches: Reference[] = [];
              if (existing && existing.launches) {
                launches = launches.concat(existing.launches);
              }
              if (incoming && incoming.launches) {
                launches = launches.concat(incoming.launches);
              }
              return {
                ...incoming,
                launches,
              };
            }
          }
        }
      }
    }
  });

// reactive variables for client-side schema fields to store local data

// Initializes to true if localStorage includes a 'token' key,
// false otherwise
export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem('token'));

// Initializes to an empty array
export const cartItemsVar = makeVar<string[]>([]);


  
  
