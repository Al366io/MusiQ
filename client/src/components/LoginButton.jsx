import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function LoginButton({text}) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <button className="login" onClick={() => loginWithRedirect()}>{text}</button>
    )
  );
}

export default LoginButton;
