import React from "react";
import "./index.css";

import { Helmet } from "react-helmet";

function NotFound(props) {
  return (
    <>
      <Helmet>
        <title>Not Found</title>
      </Helmet>

      <section className="page-section my-3 search">
        <div className="container">
          <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
            Not Found
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line" />
            <div className="divider-custom-icon">
              <i className="fas fa-star" />
            </div>
            <div className="divider-custom-line" />
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              <img src={"assets/img/404.svg"} className="not-found" alt="404" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
