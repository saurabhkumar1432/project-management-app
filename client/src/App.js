import Header from "./components/header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Clients from "./components/client";
import Projects from "./components/project";
import AddClientModal from "./components/AddClientModal";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        Clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
        },
      },
    },
  },
}


   });


const client = new ApolloClient({
  uri: "https://project-management-graphql-8r5z.onrender.com/graphql",
  cache,
});

function App() {
  return (
    <>
    <ApolloProvider client={client}>
    <Header/>
    <AddClientModal />
    
    <div className="container">
    
      <Clients />
    </div>
    </ApolloProvider>
    </>
    
  );
}

export default App;
