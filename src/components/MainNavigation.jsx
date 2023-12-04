import { Form, NavLink, useSubmit } from "react-router-dom";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const credentials = useLoaderData();
  const isAdmin = credentials?.isAdmin || false;
  const token = credentials?.token;
  const submit = useSubmit();
  useEffect(() => {
    if (!token) return;
    const expiration = localStorage.getItem("expiration");
    if (expiration && new Date(expiration) <= new Date()) {
      submit("/logout", { method: "post" });
    }
    const timeout = setTimeout(() => {
      submit("/logout", { method: "post" });
    }, new Date(expiration) - new Date());

    return () => clearTimeout(timeout);
  }, [token]);
  return (
    <header
      className={classes.header}
      style={
        token
          ? { justifyContent: "space-between" }
          : { justifyContent: "flex-end" }
      }
    >
      {token && (
        <NavLink
          to="/users"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
          end
        >
          Home
        </NavLink>
      )}
      <nav>
        <ul className={classes.list}>
          {token && (
            <>
              {isAdmin && (
                <li>
                  <NavLink
                    to="/users/new"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    New User
                  </NavLink>
                </li>
              )}
              <li>
                <Form method="post" action="/logout">
                  <button>Logout</button>
                </Form>
              </li>
            </>
          )}
          {!token && (
            <>
              <li>
                <NavLink
                  to="/auth?mode=login"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                >
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/auth?mode=signup"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                >
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
