import React from "react";
import Admin from "@/components/auth/Admin";
import Layout from "@/components/Layout";
import Category from "@/components/crud/Category";
import Tag from "@/components/crud/Tag";

const CateforyTag = () => {
  return (
    <Layout>
      <Admin>
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">Manage Categories and Tags</div>
          <div className="col-md-6">
            <Category />
          </div>
          <div className="col-md-6">
            <Tag />
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default CateforyTag;
