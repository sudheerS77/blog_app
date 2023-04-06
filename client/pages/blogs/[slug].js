import { listRelated, singleBlog } from "@/actions/blog";
import SmallCard from "@/components/blog/SmallCard";
import Layout from "@/components/Layout";
import moment from "moment";
import Link from "next/link";
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";


const SingleBlog = ({ blog, router }) => {
  const API = "http://localhost:8000/api";
  const [related, setRelated] = useState();
  console.log({blog});
  const loadRelated = () => {
    listRelated({ blog }).then((data) => {
      if (data?.error) {
        console.log(data?.error);
      } else {
        setRelated(data);
      }
    });
  };
  useEffect(() => {
    loadRelated();
  }, []);

  const showBlogCategories = () => {
    return blog?.categories?.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i}>
        <button className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</button>
      </Link>
    ));
  };

  const showBlogTags = () => {
    return blog?.tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i}>
        <button className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {t.name}
        </button>
      </Link>
    ));
  };
  const showRelaedBlog = () => {
    return related?.map((blog, i) => (
      <div className="col-md-4">
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  };
  console.log(blog);
  console.log(related);
  return (
    <React.Fragment>
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row">
                  {/* <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    className="img img-fluid featured-image"
                  /> */}
                </div>
              </section>
              <section>
                <p className="lead mt-3 mark">
                  Written by {blog.postedBy?.name} | published{" "}
                  {moment(blog.updatedAt).fromNow()}
                </p>
                <div className="mb-5">
                  {showBlogCategories()}
                  {showBlogTags()}
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div dangerouslySetInnerHTML={{ __html: blog.body }}></div>
              </section>
            </div>
            <div className="container">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <div className="row">{showRelaedBlog()}</div>
            </div>

            <div className="container pb-5">
              <p>show comments</p>
            </div>
          </article>
        </main>{" "}
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then((data) => {
    console.warn(data);
    if (data?.error) {
      console.log(data?.error);
    } else {
      return {
        blog: data,
      };
    }
  });
};
export default withRouter(SingleBlog);
