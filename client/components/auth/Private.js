import { isAuth } from "@/actions/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Private = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    if (!isAuth()) router.push("/signin");
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default Private;
