import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Store from "./store/Store";

import ToursContainer from "./ToursContainer";

import "./style/core.css";
import "./style/typography.css";
import "./style/ui.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: new Store()
    };
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Route
            path="/:locationId?/:tag?/:poi?/:page?"
            render={routeProps =>
              <ToursContainer
                params={routeProps.match.params}
                store={this.state.store}
              />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
