import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";

// _app.js is where we add anything globally
const App = ({ Component, pageProps }) => {
  return (
    <div className="container">
      <Component {...pageProps} />
    </div>
  );
};

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default App;
