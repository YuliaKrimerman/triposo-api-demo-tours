import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import LocationAutoComplete from "./LocationAutoComplete";
import PoiAutoComplete from "./PoiAutoComplete";
import PageControl from "./PageControl";

class TourForm extends React.Component {
  onSelectLocation = loc => {
    if (loc) {
      this.props.store.location.fromJSON(loc);
      this.props.store.fetchTourTagsForLocation(this.props.store.location.id);
    } else {
      this.props.store.location.reset();
    }
  };

  onSelectPoi = poi => {
    if (poi) {
      this.props.store.poi.fromJSON(poi);
    } else {
      this.props.store.poi.reset();
    }
  };

  handleTagChange = e => {
    e.preventDefault();
    console.log("Tag change");
  };

  buildUrl() {
    const { store } = this.props;
    if (!store.isValid) return "#0";
    return `/${store.location.id}/${store.selectedTag}/${store.poi.id === null
      ? "all"
      : store.poi.id}`;
  }

  render() {
    const { store } = this.props;

    return (
      <div className="tour-form">
        <ul className="form-list form-list-stacked">
          <li>
            <label>Where are you going?</label>
            <LocationAutoComplete
              value={store.location.id ? store.location.name : ""}
              onSelectLocation={this.onSelectLocation}
              include={["images"]}
            />
          </li>

          <li>
            <label>Type of Activity</label>
            <select
              value={store.selectedTag}
              disabled={store.tagOptions.length === 0}
              onChange={this.handleTagChange}
            >
              {store.tagOptions.map(to =>
                <option key={to.label} value={to.label}>
                  {to.name}
                </option>
              )}
            </select>
          </li>
          <li className={store.location.id === null ? "disabled" : "enabled"}>
            <label>Specific place of interest</label>
            <PoiAutoComplete
              disabled={store.location.id === null}
              locationId={store.location.id}
              include={["images"]}
              value={store.poi.id ? store.poi.name : ""}
              onSelectPoi={this.onSelectPoi}
            />
          </li>
        </ul>
        <Link
          className={store.isValid ? "action" : "action disabled"}
          to={this.buildUrl()}
        >
          Fetch Tours
        </Link>

        {store.tours.length
          ? <PageControl
              page={store.page}
              total={store.totalPages}
              prevUrl={
                store.page > 1 ? `${this.buildUrl()}/${store.page - 1}` : ""
              }
              nextUrl={
                store.hasMore ? `${this.buildUrl()}/${store.page + 1}` : ""
              }
            />
          : ""}
      </div>
    );
  }
}

export default observer(TourForm);
