import React from "react";
import Autocomplete from "react-autocomplete";

import { apiRequest } from "../utils";

import "../style/autocomplete.css";

const styles = {
  item: {
    padding: "2px 6px",
    cursor: "default"
  },

  highlightedItem: {
    color: "white",
    background: "hsl(200, 50%, 50%)",
    padding: "2px 6px",
    cursor: "default"
  },

  menu: {
    border: "solid 1px #ccc"
  }
};

export default class LocationAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      items: []
    };
  }

  componentDidMount() {
    if (this.props.value) this.setState({ value: this.props.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  fetchLocations(t) {
    let include = "id,name,country_id";
    let url = `location.json?annotate=trigram:${encodeURIComponent(
      t
    )}&trigram=>0.25&fields=${include}&order_by=-score&count=10`;
    apiRequest(url).then(
      response => {
        this.setState({ items: response.results });
      },
      reject => console.log(reject)
    );
  }

  render() {
    return (
      <div className="auto-complete">
        <Autocomplete
          inputProps={{ id: "location-autocomplete" }}
          value={this.state.value}
          items={this.state.items}
          getItemValue={item => item.name}
          onSelect={(value, item) => {
            this.setState({ value, items: [item] });
            this.props.onSelectLocation(item);
          }}
          onChange={(event, value) => {
            this.setState({ value });
            this.fetchLocations(value);
          }}
          renderItem={(item, isHighlighted) =>
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.id}
            >
              {item.name}
            </div>}
        />
      </div>
    );
  }
}
