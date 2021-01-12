import axios from "axios";

const buildClient = (req) => {
  if (typeof window === "undefined") {
    return axios.create({
      // Can only target ClusterIP directly if resources are in the same namespace
      // Need to ask the ingress controller directly
      //protocol://[service-name].[namespace].svc.[cluster-domain]/path
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
