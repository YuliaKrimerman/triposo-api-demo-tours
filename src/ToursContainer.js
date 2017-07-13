import React from "react";
import { observer } from "mobx-react";
import PropTypes from "prop-types";

import Loading from "./component/Loading";
import TourForm from "./component/TourForm";
import TourResult from "./component/TourResult";

class ToursContainer extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (this.props.params) {
      this.updateStore(this.props.params);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateStore(nextProps.params);
  }

  updateStore(params) {
    const { store } = this.props;

    if (params.page) {
      store.page = parseInt(params.page, 10);
    }

    store.fetchTours(params.locationId, params.tag, params.poi);
    if (params.locationId) {
      store.fetchTourTagsForLocation(params.locationId);
    }
  }

  render() {
    const { store } = this.props;

    return (
      <div className="tours-container">
        <TourForm store={store} />
        <TourResult store={store} />
        {store.toursLoading ? <Loading /> : ""}
      </div>
    );
  }
}

export default observer(ToursContainer);
