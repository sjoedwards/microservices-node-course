import React from "react";
import PropTypes from "prop-types";

const Home = ({ color }) => {
  console.log("color", color);
  return <div>Landing Page</div>;
};

Home.propTypes = {
  color: PropTypes.string,
};

export default Home;

// Executes on the server side rendering process
export const getServerSideProps = () => {
  console.log("I am on the server");

  return { props: { color: "red" } };
};
