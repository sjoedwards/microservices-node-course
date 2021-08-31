import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";
import buildClient from "../api/buildClient";
import Header from "../components/header";

// _app.js is where we add anything globally
const TicketingApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="container">
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
};

TicketingApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  currentUser: PropTypes.object,
};
export default TicketingApp;

// Executes on the server side rendering process

TicketingApp.getInitialProps = async (appContext) => {
  // Because we've added getInitialProps this on _app, now we're not calling the one on page - we need to call it explcitly
  // However we're using getServerSide props so don't need to worry
  const client = await buildClient(appContext.ctx.req);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};
