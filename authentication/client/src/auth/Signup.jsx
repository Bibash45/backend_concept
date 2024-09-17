import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Signup = () => {
  const [value, setValue] = useState({
    name: "dipen",
    email: "bibashchaudhary850@gmail.com",
    password: "bibash",
    buttonText: "Submit",
  });

  const { name, email, password } = value;

  const handleChange = (name) => (e) => {
    const { name, value } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    console.log(value);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValue({ ...value, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS");
        setValue({
          ...value,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((err) => {
        console.log("SIGNUP ERROR", err.response.data);
        setValue({ ...value, buttonText: "Submit" });
        toast.error(err.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
      <div className="form-group mb-2">
        <label htmlFor="name" className="text-muted">
          Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Enter name"
          value={value.name}
          onChange={handleChange("name")}
        />
      </div>
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
      <div className="form-group mb-2">
        <label htmlFor="password" className="text-muted">
          Password:
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          placeholder="Enter password"
          value={value.password}
          onChange={handleChange("password")}
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
      {JSON.stringify({ name, email, password })}
      <h1 className="p-5">Signup</h1>
      {signupForm()}
    </div>
  );
};

export default Signup;
