import Private from "@/components/auth/Private";
import Layout from "@/components/Layout";
import Link from "next/link";
import {BiCategoryAlt} from 'react-icons/bi'
import {GrUpdate} from 'react-icons/gr';
import {AiFillTags} from 'react-icons/ai';
import {ImBlogger} from 'react-icons/im'
const UserIndex = () => {
  return (
    <Layout>
      <Private>
      <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>User Dashboard</h2>
            </div>
            <div className="container">
              <div className="row row-cols-1 row-cols-lg-5 g-2 g-lg-3">
                <div className="col shadow">
                  <Link href="/blogs" className="d-flex align-items-center">
                    <h4 className="p-3"><BiCategoryAlt className="text-dark"/> </h4>
                    <span>See All Blogs</span>
                  </Link>
                </div>
                
              </div>
            </div>
            {/* <div className="col-md-8">right</div> */}
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;
