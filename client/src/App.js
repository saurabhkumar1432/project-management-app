import Header from "./components/header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Clients from "./components/client";
import Projects from "./components/project";
import AddClientModal from "./components/AddClientModal";
import AddProjectModal from "./components/AddProjectModal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Project from "./pages/Project";
import NotFound from "./pages/NotFound";

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
  uri: "http://localhost:5000/graphql",
  cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="d-flex gap-3 mb-4">
                      <AddClientModal />
                      <AddProjectModal />
                    </div>
                    <Projects />
                    <hr />
                    <Clients />
                  </>
                }
              />
              <Route path="/projects/:id" element={<Project />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
