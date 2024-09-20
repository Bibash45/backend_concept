import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { getCookie, isAuth, updateUser } from "../auth/helpers";

const Admin = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response);
        const { role, name, email } = response.data;
        setValue({ ...value, role, email, name });
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);

        if (error.response.status === 401) {
          navigate("/signin");
        }
      });
  };

  const { role, name, email, password, buttonText } = value;

  const handleChange = (name) => (e) => {
    setValue({ ...value, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValue({ ...value, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/update`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },

      data: { name, password },
    })
      .then((response) => {
        console.log("PROFILE UPDATE SUCCESS", response);

        updateUser(response, () => {
          setValue({
            ...value,
            buttonText: "Submitted",
          });
          toast.success("Profile updated sucessfully");
        });
      })
      .catch((err) => {
        console.log("PROFILE UPDATE ERROR", err.response.data.error);
        setValue({ ...value, buttonText: "Submit" });
        toast.error(err.response.data.error);
      });
  };

  const updateForm = () => (
    <form>
      <div className="form-group mb-2">
        <label htmlFor="role" className="text-muted">
          Role:
        </label>
        <input
          type="text"
          className="form-control"
          id="role"
          name="role"
          defaultValue={role}
          disabled
        />
      </div>
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
          defaultValue={email}
          disabled
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
      <h1 className="pt-5 text-center">Private</h1>
      <p className="lead text-center">Profile update</p>
      {updateForm()}
    </div>
  );
};

export default Admin;
