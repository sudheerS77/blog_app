import { authenticate, isAuth, Signin } from "@/actions/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SigninComponent = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  useEffect(() => {
    isAuth() && router.push(`/`);
  }, []);

  const { email, password, error, loading, message, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    Signin(user).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {         
          if (isAuth() && isAuth().role === "1") router.push(`/admin`);
          else router.push("/user");
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
  const SigninForm = () => {
    return (
        <></>
    );
  };

  return (
    <React.Fragment>
      <ShowLoading />
      <ShowError />
      <ShowMessage />
      {showForm ? 
      (
        <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"></div>
          <div className="form-group">
            <input
              value={email}
              onChange={handleChange("email")}
              type="email"
              className="form-control"
              placeholder="Type your email"
            />
          </div>

          <div className="form-group">
            <input
              value={password}
              onChange={handleChange("password")}
              type="password"
              className="form-control"
              placeholder="Type your password"
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary form-control">Signin</button>
          </div>
        </form>
      </div>
      )
      
      : <></>}
    </React.Fragment>
  );
};

export default SigninComponent;
