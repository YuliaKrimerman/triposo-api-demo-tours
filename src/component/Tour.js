import React from "react";

import Article from "./Article";
import Sources from "./Sources";
import Loading from "./Loading";

import { apiRequest } from "../utils";

import "../style/poi.css";

export default class Tour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tour: null
    };
  }

  componentDidMount() {
    apiRequest(
      `tour.json?id=${this.props
        .tourId}&fields=name,id,content,images,score,vendor_tour_url,price`
    )
      .then(json => {
        this.setState({ tour: json.results[0] });
      })
      .catch(rejected => {
        console.log("REJECTED: ", rejected);
      });
  }

  render() {
    return (
      <div>
        {this.state.tour ? <PoiBody poi={this.state.tour} /> : <Loading />}
      </div>
    );
  }
}

class PoiBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false
    };
  }

  renderImage() {
    const { poi } = this.props;
    if (poi.images.length) {
      if (poi.images[0].sizes.medium) {
        return (
          <div
            className="header-image"
            style={{
              backgroundImage: `url('${poi.images[0].sizes.medium.url}')`
            }}
          />
        );
      }
    }
    return "";
  }

  componentDidMount() {
    this.setState({ shown: true });
  }

  render() {
    const { poi } = this.props;
    return (
      <div className={this.state.shown ? "poi shown" : "poi"}>
        <h1>
          {poi.name}
          {poi.vendor_tour_url
            ? <a
                className="action-book"
                href={poi.vendor_tour_url}
                target="_blank"
              >
                Book{" "}
                {poi.price
                  ? <span className="price">
                      {poi.price.amount} <em>{poi.price.currency}</em>
                    </span>
                  : ""}
              </a>
            : ""}
        </h1>
        {this.renderImage()}
        {poi.content ? <Article sections={poi.content.sections} /> : ""}

        {poi.content && poi.content.attribution
          ? <Sources sources={poi.content.attribution} />
          : ""}
      </div>
    );
  }
}
