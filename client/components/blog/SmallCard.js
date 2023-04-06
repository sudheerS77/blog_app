import { API } from "@/config";
import moment from "moment";
import Link from "next/link";
import React from "react";

const SmallCard = ({ blog }) => {
  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <img
            src={`${API}/blog/photo/${blog.slug}`}
            className="img img-fluid"
            style={{ maxHeight: "auto", width: "100%" }}
            alt={`${blog.title}`}
          />
        </Link>
      </section>
      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <h5 className="card-title">{blog.title}</h5>
          </Link>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: blog.excerpt }}
          ></p>
        </section>
        <div className="card-body">
          Posted {moment(blog.updatedAt).fromNow()} by{" "}
          <Link href={`/`} className="float-right">
            {blog.postedBy?.name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
