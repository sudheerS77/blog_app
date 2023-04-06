import moment from "moment/moment";
import Link from "next/link";
import React from "react";

const Card = ({ blog }) => {

  const API = "http://localhost:8000/api";
  const showBlogCategories = (blog) =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <button className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</button>
      </Link>
    ));

  const showBlogTags = (blog) =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <button className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {t.name}
        </button>
      </Link>
    ));
  return (
    <div className="lead pb-4 mt-5 mb-5 shadow container">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <h4 className="pt-3 pb-3 font-weight-bold">{blog.title}</h4>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Write by {blog?.postedBy?.name} | Published{" "}
          {moment(blog?.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {/* {showBlogCategories(blog)}
        {showBlogTags(blog)} */}
        <br />
        <br />
      </section>
      <div className="row">
        <div className="col-md-4">
          <img
            className="img img-fluid"
            style={{ maxHeight: "150px", width: "auto" }}
            src={`${API}/blog/photo/${blog.slug}`}
            alt={blog.title}
          />
        </div>
        <div className="col-md-8">
          <div
            className="pb-3 fs-5"
            dangerouslySetInnerHTML={{ __html: blog.excerpt }}
          ></div>
          <Link href={`/blogs/${blog.slug}`}>
            <button className="btn btn-primary pt-2">Read more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
