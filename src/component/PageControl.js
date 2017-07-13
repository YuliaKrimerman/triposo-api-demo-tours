import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import "../style/pagecontrol.css";

class PageControl extends React.Component {
  actionNext = e => {
    if (this.props.nextUrl === "") e.preventDefault();
  };

  actionPrev = e => {
    if (this.props.prevUrl === "") e.preventDefault();
  };

  render() {
    const { page, nextUrl, prevUrl } = this.props;
    return (
      <div className="page-control">
        <div className="page-container">
          <Link
            to={prevUrl}
            onClick={this.actionPrev}
            className={classNames({
              prev: true,
              disabled: prevUrl === ""
            })}
          >
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </Link>
          <span>
            {page}
          </span>
          <Link
            to={nextUrl}
            onClick={this.actionNext}
            className={classNames({
              next: true,
              disabled: nextUrl === ""
            })}
          >
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </Link>
        </div>
        <div className="total">
          of est. {this.props.total} pages
        </div>
      </div>
    );
  }
}

export default observer(PageControl);
