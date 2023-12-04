import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  const data = useActionData();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Sign up"}</h1>
        {data?.message && (
          <small style={{ color: "red" }}>{data.message}</small>
        )}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
          {data?.errors?.email && (
            <small style={{ color: "red" }}>{data?.errors?.email}</small>
          )}
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
          {data?.errors?.password && (
            <small style={{ color: "red" }}>{data?.errors?.password}</small>
          )}
        </p>
        {!isLogin && (
          <>
            <p>
              <label htmlFor="password2">Confirm password</label>
              <input id="password2" type="password" name="password2" required />
            </p>
            {data?.errors?.password2 && (
              <small style={{ color: "red" }}>{data?.errors?.password2}</small>
            )}
            <p>
              <label htmlFor="avatarUrl">Avatar url</label>
              <input id="avatarUrl" type="text" name="avatarUrl" required />
              {data?.errors?.avatarUrl && (
                <small style={{ color: "red" }}>
                  {data?.errors?.avatarUrl}
                </small>
              )}
            </p>
            <p>
              <label htmlFor="displayName">User name</label>
              <input id="displayName" type="text" name="displayName" required />
              {data?.errors?.displayName && (
                <small style={{ color: "red" }}>
                  {data?.errors?.displayName}
                </small>
              )}
            </p>
            <p>
              <label htmlFor="photoUrl">Photo url</label>
              <input id="photoUrl" type="text" name="photoUrl" required />
              {data?.errors?.photoUrl && (
                <small style={{ color: "red" }}>{data?.errors?.photoUrl}</small>
              )}
            </p>
            <p>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                type="text"
                name="description"
                required
              />
              {data?.errors?.description && (
                <small style={{ color: "red" }}>
                  {data?.errors?.description}
                </small>
              )}
            </p>
          </>
        )}
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Not registered?" : "Already registered?"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Send"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
