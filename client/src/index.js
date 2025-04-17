import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client'; 

const client = new ApolloClient({

  link: ApolloLink.from([
    new HttpLink({
      uri: 'https://capstone-server2-2qh1.onrender.com/graphql',  
      credentials: 'include',  
    }),
  ]),
  cache: new InMemoryCache(),
  headers: {
 
    Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}> 
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
