import { isAuth } from "@/actions/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Admin = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    if (!isAuth()) router.push("/signin");
    else if (isAuth().role !== "1") router.push("/");
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default Admin;
