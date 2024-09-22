import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "./helpers";

const Signin = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: "dipendraacharya132@gmail.com",
    password: "dipenn",
    buttonText: "Submit",
  });

  const { email, password } = value;

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
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS");

        // save the response (user,token) Localtorage/cookie\
        authenticate(response, () => {
          setValue({
            ...value,
            email: "",
            password: "",
            buttonText: "Submitted",
          });
          toast.success(`Hey ${response.data.user.name}, Welcome back!`);

          if (isAuth() && isAuth()?.role === "admin") {
            navigate("/admin");
          }else{
            navigate("/private");
          }
        });
      })
      .catch((err) => {
        console.log("SIGNIN ERROR", err.response.data);
        setValue({ ...value, buttonText: "Submit" });
        toast.error(err.response.data.error);
      });
  };

  const signinForm = () => (
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
      <h1 className="p-5">Signin</h1>
      {signinForm()}
      <br />
      <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot password</Link>
    </div>
  );
};

export default Signin;
