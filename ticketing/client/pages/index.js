import React from "react";
import PropTypes from "prop-types";

const Home = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You need to sign in</h1>
  );
};

Home.propTypes = {
  currentUser: PropTypes.object,
};

export default Home;
