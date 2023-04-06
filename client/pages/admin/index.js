import Admin from "@/components/auth/Admin";
import Layout from "@/components/Layout";
import Link from "next/link";
import {BiCategoryAlt} from 'react-icons/bi'
import {GrUpdate} from 'react-icons/gr';
import {AiFillTags} from 'react-icons/ai';
import {ImBlogger} from 'react-icons/im'
const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="container">
              <div className="row row-cols-1 row-cols-lg-5 g-2 g-lg-3">
                <div className="col shadow">
                  <Link href="/admin/crud/category-tag" className="d-flex align-items-center">
                    <h4 className="p-3"><BiCategoryAlt className="text-dark"/> </h4>
                    <span>Create Category</span>
                  </Link>
                </div>
                <div className="col shadow">
                  <Link href="/admin/crud/category-tag" className="d-flex align-items-center">
                    <h4 className="p-3"><AiFillTags /></h4>
                    <span>Create Tag</span>
                  </Link>
                </div>
                <div className="col shadow">
                  <Link href="/admin/crud/blog" className="d-flex align-items-center">
                    <h4 className="p-3"><ImBlogger /></h4>
                    <span>Create Blog</span>
                  </Link>
                </div>
                <div className="col shadow">
                  <Link href="/admin/crud/blogs" className="d-flex align-items-center">
                    <h4 className="p-3"><GrUpdate /></h4>
                    <span>Update / Delete Blogs</span>  
                  </Link>
                </div>
              </div>
              <div className="row row-cols-1 row-cols-lg-5 g-2 g-lg-3">
                <div className="col shadow">
                  <Link href="/blogs" target="_blank" className="d-flex align-items-center">
                    <h4 className="p-3"><BiCategoryAlt className="text-dark"/> </h4>
                    <span>See All Blogs</span>
                  </Link>
                </div>
                
              </div>
            </div>
            {/* <div className="col-md-8">right</div> */}
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
