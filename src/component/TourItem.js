import React from "react";
import { observer } from "mobx-react";
import Tour from "./Tour";
import Portal from "./Portal";
import classNames from "classnames";

import "../style/poiitem.css";

class TourItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      show: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ show: true });
    }, 200 + Math.round(Math.random() + 600));
  }

  openAction = e => {
    if (e) e.preventDefault();
    this.setState({ open: true });
  };

  renderPortal = () => {
    return <Tour tourId={this.props.tour.id} />;
  };

  onClosePortal = () => {
    this.setState({ open: false });
  };

  render() {
    const { tour } = this.props;

    const cls = classNames({
      "poi-item": true,
      "poi-item-shown": this.state.show
    });

    return (
      <div className={cls}>
        <div
          className="poi-image"
          style={{ backgroundImage: `url('${tour.getMediumImage()}')` }}
          onClick={() => this.setState({ open: true })}
        />

        <h3>
          <a className="name" href="#" onClick={this.openAction}>
            {tour.name}
          </a>
          {tour.price
            ? <span className="price">
                {tour.price} <em>{tour.currency}</em>
              </span>
            : ""}
        </h3>
        {tour.vendor
          ? <h4>
              {tour.vendor}
            </h4>
          : ""}

        {this.state.open
          ? <Portal render={this.renderPortal} onClose={this.onClosePortal} />
          : ""}
      </div>
    );
  }
}

export default observer(TourItem);
