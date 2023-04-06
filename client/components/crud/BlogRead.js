import { getCookie, isAuth } from "@/actions/auth";
import { list, removeBlog } from "@/actions/blog";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BlogRead = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");
  useEffect(() => {
    loadBlogs();
  }, []);
  const loadBlogs = () => {
    list().then((data) => {
      if (data?.error) {
        console.log(data?.error);
      } else {
        setBlogs(data);
      }
    });
  };
  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data?.error) {
        console.log(data?.error);
      } else {
        setMessage(data?.message);
        loadBlogs();
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };
  const showUpdateButton = (blog) => {
    const role = parseInt(isAuth()?.role);
    console.log(isAuth() && role === 0);
    if (isAuth() && role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <button className="btn btn-warning btn-sm">Update</button>
        </Link>
      );
    } else if (isAuth() && role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <button className="ml-2 btn btn-warning btn-sm">Update</button>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    console.log(blogs);
    return blogs?.map((blog, i) => (
      <div className="px-5 py-3 my-5 border shadow rounded" key={i}>
        <h3>{blog?.title}</h3>
        <p className="mark">
          Written by {blog?.postedBy?.name} | Published on{" "}
          {moment(blog.updatedAt).fromNow()}
        </p>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => deleteConfirm(blog?.slug)}
        >
          Delete
        </button>
        {showUpdateButton(blog)}
      </div>
    ));
  };
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogRead;
