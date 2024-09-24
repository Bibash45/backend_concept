import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import axios from "axios";

const Google = ({ informParent }) => {
  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token);

    axios({
      method: "POST",
      url: `http://localhost:8000/api/google-login`,
      data: { idToken: token },
    })
      .then((response) => {
        console.log("GOOGLE SIGNIN SUCCESS", response);
        // inform parent component
        informParent(response);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  return (
    <div className="pb-3">
      <GoogleOAuthProvider clientId="1036966200104-qrqoqh3bqi2luaf7un4c8jvv4cjhibo8.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Google;
