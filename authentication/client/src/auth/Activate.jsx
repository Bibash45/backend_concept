import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Activate = () => {
  const token = useParams(); // Get token from URL params
  const [value, setValue] = useState({
    name: "",
    token: "",
    show: true,
    buttonText: "Activate Account",
  });

  useEffect(() => {
    if (token) {
      try {
        const { name } = jwtDecode(token.token); // Decode the token

        setValue({ ...value, name: name, token: token.token });
      } catch (error) {
        console.log("Invalid token");
      }
    }
  }, [token]);

  const clickSubmit = (e) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`, // Assuming this is your activation endpoint
      data: { token: value.token }, // Send the token to the backend
    })
      .then((response) => {
        console.log("ACTIVATION SUCCESS", response);
        setValue({
          ...value,
          name: "",
          token: "",
          buttonText: "Account Activated",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
    <div className=" text-center">
      <h1 className="p-5">Hey {value.name}, Ready to activate your account?</h1>
      <button className="btn btn-outline-primary" onClick={clickSubmit}>
        {value.buttonText}
      </button>
    </div>
  );

  return (
    <div className="col-md-7 offset-md-3 text-center">
      <ToastContainer />
      {activationLink()}
    </div>
  );
};

export default Activate;
