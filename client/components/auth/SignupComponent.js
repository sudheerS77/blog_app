import { signup } from "@/actions/auth";
import React, { useRef, useState } from "react";

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });
  const ref = useRef()
  const { name, email, password, error, loading, message, showForm } = values;
  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };

    signup(user).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        console.log(data);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: data?.message,
          showForm: false,
        });
      }
    });
  };
  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
    console.log(values);
  };
  const ShowLoading = () =>
    loading ? <div className="alert alert-info">Loading ...</div> : "";
  const ShowError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const ShowMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";
  const SignupForm = () => {
    return (
      <></>
    );
  };

  return (
    <React.Fragment>
      <ShowLoading />
      <ShowError />
      <ShowMessage />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
            ref={ref}
            autoComplete="off"
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="user name"
            
            />
          </div>
          <div className="form-group">
            <input
            ref={ref}
            autoComplete="off"
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type your email"
            />
          </div>

          <div className="form-group">
            <input
            ref={ref}
            autoComplete="off"
              value={password}
              onChange={handleChange("password")}
              type="password"
              className="form-control"
              placeholder="Type your password"
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary form-control">Signup</button>
          </div>
        </form>
      </div>
      <SignupForm />
    </React.Fragment>
  );
};

export default SignupComponent;
