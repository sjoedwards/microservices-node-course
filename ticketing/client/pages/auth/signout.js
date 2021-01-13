import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

const SignOut = () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      Router.push("/");
    },
  });

  // This request has to be done in the browser as the cookie needs to be removed.
  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return <div>{errors ? errors : <p>Signing you out...</p>}</div>;
};

export default SignOut;
