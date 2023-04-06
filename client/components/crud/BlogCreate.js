import React, { useEffect, useState } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";

import { getCategories } from "@/actions/category";
import { getTags } from "@/actions/tag";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { createBlog } from "../../actions/blog";
import { getCookie, isAuth } from "@/actions/auth";

const BlogCreate = ({ router }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  const [body, setBody] = useState();
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: new FormData(),
    title: "",
    hidePublishButton: false,
  });
  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;
  const token = getCookie("token");
  const f = new FormData();

  useEffect(() => {
    // setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };
  const publishBlog = (e) => {
    e.preventDefault();
    const user_id = isAuth()._id ? isAuth()._id : 0
    formData.set("postedBy",  user_id);
    if(formData.get("photo")) {
      createBlog(formData, token).then((data) => {
        if (data?.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            title: "",
            error: "",
            success: `A new blog titled "${data?.title}" is created`,
          });
          setBody("");
          setCategories([]);
          setTags([]);
        }
      });
    } else {
      setValues({
        ...values,
        title: "",
        error: "Please upload Featured Image",
        success: "",
      });

    }
    // console.log("ready to publishBlog");
  };

  const handleChange = (e) => {
    let name = e.target.name;
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    console.log(name);
    setValues((prev) => {
      return { ...prev, [name]: value, error: "" };
    });
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
    console.log(body);
  };
  const handleToggle = (c) => () => {
    setValues({ ...values, error: "" });
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];
    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setChecked(all);
    formData.set("categories", all);
  };
  const handleTagsToggle = (t) => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedTag = checked.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);
  };
  const ShowCategories = () => {
    return categories?.map((cat, i) => (
      <li key={i} className="list-unstyled">
        <input
          onChange={handleToggle(cat._id)}
          type="checkbox"
          className="mr-2"
        />
        <label className="form-check-label">{cat.name}</label>
      </li>
    ));
  };
  const ShowTags = () => {
    return tags?.map((tag, i) => (
      <li key={i} className="list-unstyled">
        <input
          type="checkbox"
          className="mr-2"
          onChange={handleTagsToggle(tag._id)}
        />
        <label className="form-check-label">{tag.name}</label>
      </li>
    ));
  };
  const ShowError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const ShowSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );
  const CreateBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={BlogCreate.modules}
            formats={BlogCreate.formats}
            value={body}
            placeholder="Write your blog here"
            onChange={(e) => handleBody(e)}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {CreateBlogForm()}
          <div className="pt-3">
            <ShowError />
            <ShowSuccess />
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group">
              <h5>Featured image</h5>
              <hr />
              <small className="text-muted">Max size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload Featured Image
                <input
                  name="photo"
                  onChange={handleChange}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {ShowCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {ShowTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogCreate.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"],
  ],
};

BlogCreate.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
];

export default withRouter(BlogCreate);
