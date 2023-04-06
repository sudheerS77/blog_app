import { getCookie } from "@/actions/auth";
import { create, getCategories, removeCategory } from "@/actions/category";
import React, { useEffect, useState } from "react";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false,
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie("token");
  useEffect(() => {
    loadCategories();
  }, [reload]);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, categories: data });
      }
    });
  };
  const clickSubmit = (e) => {
    e.preventDefault();
    create({ name }, token).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: "",
          success: true,
          name: "",
          removed: false,
          reload: !reload,
        });
      }
    });
  };
  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: "",
    });
  };
  const CategoryForm = () => {
    return (
      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={name}
            required
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    );
  };
  const ShowCategories = () => {
    return categories?.map((cat, i) => {
      return (
        <button
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
          key={i}
          title="Double click to delete"
          onDoubleClick={() => deleteConfirm(cat.slug)}
        >
          {cat.name}
        </button>
      );
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure to delete");
    if (answer) DeleteCategory(slug);
  };
  const DeleteCategory = (slug) => {
    removeCategory(slug, token).then((data) => {
      if (data?.error) {
        console.log(data?.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: "",
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };
  const ShowSuccess = () => {
    if (success) {
      return <p className="text-success">Category is created</p>;
    }
  };

  const ShowError = () => {
    if (error) {
      return <p className="text-danger">Category already exist</p>;
    }
  };

  const ShowRemoved = () => {
    if (removed) {
      return <p className="text-danger">Category is removed</p>;
    }
  };

  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: false, success: false, removed: "" });
  };
  return (
    <React.Fragment>
      <ShowSuccess />
      <ShowError />
      <ShowRemoved />
      <div onMouseMove={mouseMoveHandler}>
        {CategoryForm()}
        <ShowCategories />
      </div>
    </React.Fragment>
  );
};

export default Category;
