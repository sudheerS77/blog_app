import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
// import { QuillModules, QuillFormats } from "../../helpers/quill";

const BlogUpdate = ({ router }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  const [body, setBody] = useState("");
  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: new FormData(),
    title: "",
    body: "",
  });

  const { error, success, formData, title } = values;
  const token = getCookie("token");

  useEffect(() => {
    // setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);
  const initCategories = () => {
    getCategories().then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data?.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data?.error });
      } else {
        setTags(data);
      }
    });
  };
  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data?.error) {
        } else {
          setValues({ ...values, title: data?.title });
          setBody(data?.body);
          setCategoriesArray(data?.categories);
          setTagsArray(data?.tags);
        }
      });
    }
  };
  const setCategoriesArray = (blogCategories) => {
    let ca = [];
    blogCategories?.map((c, i) => {
      ca.push(c._id);
    });
    setChecked(ca);
  };
  const setTagsArray = (blogTags) => {
    let ta = [];
    blogTags?.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  const handleChange = (name) => (e) => {
    console.log(e);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
    console.log({ name }, formData.get("photo"));
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
  };

  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data?.error });
      } else {
        setValues({
          ...values,
          //   title: "",
          success: `Blog titled "${data?.title}" is successfully updated`,
        });
        // if (isAuth() && isAuth().role === 1) {
        //     // Router.replace(`/admin/crud/${router.query.slug}`);
        //     Router.replace(`/admin`);
        // } else if (isAuth() && isAuth().role === 0) {
        //     // Router.replace(`/user/crud/${router.query.slug}`);
        //     Router.replace(`/user`);
        // }
      }
    });
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
    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTag(all);
    formData.set("tags", all);
  };
  const findOutCategories = (c) => {
    const result = checked.indexOf(c);
    if (result !== -1) return true;
    return false;
  };
  const findOutTag = (t) => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) return true;
    return false;
  };
  const ShowCategories = () => {
    return categories?.map((cat, i) => (
      <li key={i} className="list-unstyled">
        <input
          onChange={handleToggle(cat._id)}
          checked={findOutCategories(cat._id)}
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
          onChange={handleTagsToggle(tag._id)}
          checked={findOutTag(tag._id)}
          type="checkbox"
          className="mr-2"
        />
        <label className="form-check-label">{tag.name}</label>
      </li>
    ));
  };
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={BlogUpdate.modules}
            formats={BlogUpdate.formats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            {showSuccess()}
            {showError()}
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
                  onChange={(e) => {
                    console.log("e value", e);
                    handleChange(e);
                  }}
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
BlogUpdate.modules = {
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

BlogUpdate.formats = [
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

export default withRouter(BlogUpdate);
