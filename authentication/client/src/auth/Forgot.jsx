import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Forgot = () => {
  const [value, setValue] = useState({
    email: "",
    buttonText: "Request password reset link",
  });

  const { email } = value;

  const handleChange = (name) => (e) => {
    const { name, value } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValue({ ...value, buttonText: "Submitting" });
    console.log('send request');
    
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log("FORGOT PASSWORD  SUCCESS");

        toast.success(response.data.message)
        setValue({ ...value, buttonText: "Requested" });
      })
      .catch((err) => {
        console.log("FORGOT PASSWORD ERROR", err.response.data);
        setValue({ ...value, buttonText: "Request password reset link" });
        toast.error(err.response.data.error);
      });
  };

  const passwordForgotForm = () => (
    <form>
      <div className="form-group mb-2">
        <label htmlFor="email" className="text-muted">
          Email:
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          placeholder="Enter email"
          value={value.email}
          onChange={handleChange("email")}
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {value.buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="col-d-6 offset-md-3">
      <ToastContainer />
      <h1 className="p-5">Forgot password</h1>
      {passwordForgotForm()}
    </div>
  );
};

export default Forgot;
