import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Note from "./pages/Note/Note";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/note">New Note</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/note/:id">
            <Note />
          </Route>
          <Route path="/note/">
            <Note />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
