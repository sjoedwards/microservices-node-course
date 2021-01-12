import React from "react";
import PropTypes from "prop-types";
import buildClient from "../api/buildClient";

const Home = ({ currentUser }) => {
  console.log("🚀 ~ file: index.js ~ line 7 ~ Home ~ currentUser", currentUser);
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

// Executes on the server side rendering process
export const getServerSideProps = async ({ req }) => {
  const { data } = await buildClient(req).get(`/api/users/currentuser`);
  console.log(
    "🚀 ~ file: index.js ~ line 23 ~ getServerSideProps ~ data",
    data
  );

  return { props: { ...data } };
};
