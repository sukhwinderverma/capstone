import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Import Apollo Client

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4005/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}> {/* Wrap your app with ApolloProvider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
