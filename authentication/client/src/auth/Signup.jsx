import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "./helpers";

const Signup = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    name: "dipen",
    email: "bibashchaudhary850@gmail.com",
    password: "bibash",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = value;

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (isAuth()) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (name) => (e) => {
    setValue({ ...value, [name]: e.target.value });
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
          value={name}
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
          value={email}
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
          value={password}
          onChange={handleChange("password")}
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
      <h1 className="p-5">Signup</h1>
      {signupForm()}
      <br />
      <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot password</Link>
    </div>
  );
};

export default Signup;
