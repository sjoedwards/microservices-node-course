import axios from "axios";

const buildClient = (req) => {
  if (typeof window === "undefined") {
    // on the server, we need to hit the service directly. The server has no idea what ticketing.dev is
    return axios.create({
      // Can only target ClusterIP directly if resources are in the same namespace
      // Need to ask the ingress controller directly
      //protocol://[service-name].[namespace].svc.[cluster-domain]/path
      baseURL: process.env.BASE_URL,
      headers: req.headers,
    });
  } else {
    // on the client, we can just hit ticketing.dev as the base url
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
