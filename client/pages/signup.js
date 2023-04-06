import SignupComponent from "@/components/auth/SignupComponent";
import Layout from "../components/Layout";

const signup = () => {
  return (
    <Layout>
      <h2 className="text-center">signup page</h2>
      <div className="row p-4">
        <div className="col-md-4 offset-md-4">
          <SignupComponent />
        </div>
      </div>
    </Layout>
  );
};

export default signup;
