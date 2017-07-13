import React from "react";
import { observer } from "mobx-react";
import TourItem from "./TourItem";

class TourResult extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <div className="tour-result">
        <div className="tour-list">
          {store.tours.map(t => {
            return <TourItem key={t.id} tour={t} />;
          })}
        </div>
      </div>
    );
  }
}

export default observer(TourResult);
