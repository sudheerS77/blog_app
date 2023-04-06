import { listBlogsWithCategoriesAndTags } from "@/actions/blog";
import Card from "@/components/blog/Card";
import Layout from "@/components/Layout";
import Link from "next/link";
import { withRouter } from "next/router";
import React, { useState } from "react";

const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  blogsLimit,
  blogSkip,
  router,
}) => {
  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);
  const showAllblogs = () => {
    return blogs?.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };
  const showAllCategories = () => {
    return categories?.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i}>
        <button className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</button>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags?.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i}>
        <button className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {t.name}
        </button>
      </Link>
    ));
  };
  const showLoadedBlogs = () => {
    return loadedBlogs?.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
      </article>
    ));
  };
  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data?.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data?.blogs]);
        setSize(data?.size);
        setSkip(toSkip);
      }
    });
  };
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-primary btn-lg">
          Load More
        </button>
      )
    );
  };
  return (
    <Layout>
      <main className="">
        <div className="container-fluid ">
          <header>
            <div className="col-md-12 pt-3">
              <h2 className="display-6 font-weight-bold text-center">
                Programming blogs and tutorials
              </h2>
            </div>
            <section>
              {/* <div className="pb-5 text-center">
                {showAllCategories()}
                <br />
                {showAllTags()}
              </div> */}
            </section>
          </header>
        </div>
        <div className="container-fluid">{showAllblogs()}</div>
        <div className="container-fluid">{showLoadedBlogs()}</div>
        <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
      </main>
    </Layout>
  );
};

Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 2;
  return listBlogsWithCategoriesAndTags().then((data) => {
    if (data?.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data?.blogs,
        categories: data?.categories,
        tags: data?.tags,
        totalBlogs: data?.size,
        blogsLimit: limit,
        blogSkip: skip,
      };
    }
  });
};

export default withRouter(Blogs);
