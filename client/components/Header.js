import React, { useEffect, useState } from "react";
import Link from "next/link";
import { APP_NAME } from "../config";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { isAuth, signout } from "@/actions/auth";
import { useRouter } from "next/router";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("0")
  const [userName, setUserName] = useState("")
  const router = useRouter();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const user = isAuth()
    setRole(user?.role)
    setUserName(user?.name)
  }, [])

  if (role === "1") {    
    return (
      <div>
        <Navbar color="light" light expand="md">
          <Link href="/" style={{textDecoration: "none", fontSize: "2rem"}}>BLOGGER</Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>

              <React.Fragment>
                <NavItem>
                  <div onClick={() => router.replace("/admin")}>
                    {`${userName} Admin`} 
                  </div>
                </NavItem>
              </React.Fragment>

              <React.Fragment>
                <NavItem>
                  <div
                  className="btn text-light btn-danger mr-1 ml-1 mt-3"
                    onClick={() => signout(() => router.replace("/signin"))}
                  >
                    signout
                  </div>
                </NavItem>
              </React.Fragment>

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  } else if(role === '0') {
      return (
        <Navbar color="light" light expand="md">
          <Link href="/" style={{textDecoration: "none", fontSize: "2rem"}}>BLOGGER</Link>
          <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <React.Fragment>
                  <NavItem>
                  <NavLink
                  className="btn text-light btn-danger mr-1 ml-1 mt-3"
                    onClick={() => signout(() => router.replace("/signin"))}
                  >
                    signout
                  </NavLink>
                  </NavItem>                  
                </React.Fragment>
              </Nav>
            </Collapse>
        </Navbar>
      )
  }else {
    return (
      <div>
        <Navbar color="light" light expand="md">
        <Link href="/" style={{textDecoration: "none", fontSize: "2rem"}}>BLOGGER</Link>
          <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <React.Fragment>
                  <NavItem>
                    <Link href="/signin">
                      <button className="btn btn-outline-primary mr-1 ml-1 mt-3">Signin</button>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/signup">
                      <button className="btn btn-outline-primary mr-1 ml-1 mt-3">Signup</button>
                    </Link>
                  </NavItem>
                </React.Fragment>
              </Nav>
            </Collapse>
        </Navbar>
      </div>
    );
  }
};

export default Header;
