import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 

const Reset = () => {
  const params = useParams();

  const [value, setValue] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset password",
  });

  useEffect(() => {
    const token = params.token;
    console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token correctly
        setValue((prevValue) => ({
          ...prevValue,
          name: decoded.name || "User", // Default to "User" if name isn't in the token
          token,
        }));
      } catch (error) {
        console.error("Token decoding error:", error);
        toast.error("Invalid or expired token");
      }
    }
  }, [params.token]);

  const { name, newPassword, buttonText } = value;

  const handleChange = (e) => {
    setValue((prevValue) => ({
      ...prevValue,
      newPassword: e.target.value,
    }));
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValue({ ...value, buttonText: "Submitting" });

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: value.token },
    })
      .then((response) => {
        console.log("RESET PASSWORD SUCCESS", response);
        toast.success(response.data.message);
        setValue({ ...value, buttonText: "Done" });
      })
      .catch((err) => {
        console.log("RESET PASSWORD ERROR", err.response.data);
        setValue({ ...value, buttonText: "Reset password" });
        toast.error(err.response.data.error);
      });
  };

  const passwordResetForm = () => (
    <form>
      <div className="form-group mb-2">
        <label htmlFor="newPassword" className="text-muted">
          New password:
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="newPassword"
          placeholder="Type new password"
          value={newPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="col-d-6 offset-md-3">
      <ToastContainer />
      <h1 className="p-5">Hey {name}, Type your new password </h1>
      {passwordResetForm()}
    </div>
  );
};

export default Reset;
