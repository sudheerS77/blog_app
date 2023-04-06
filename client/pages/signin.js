import SigninComponent from "@/components/auth/SigninComponent";
import Layout from "../components/Layout";

const Signin = () => {
  return (
    <Layout>
      <h2 className="text-center mt-5 mb-5">signin page</h2>
      <div className="">
        <div className="col-md-4 offset-md-4">
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
