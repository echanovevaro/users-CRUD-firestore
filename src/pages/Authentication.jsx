import { json, redirect, useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { loginSchema, registerSchema, passwordSchema } from "../validation";
import { logOut } from "../utils/auth";

import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const isEmailNotVerified = searchParams.get("emailNotVerified") !== null;
  const isPasswordReset = searchParams.get("passwordReset") !== null;
  return (
    <>
      {isEmailNotVerified && (
        <div
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "0.8rem",
            borderRadius: "10px",
          }}
        >
          <p>Please, check your email to verify your address!</p>
        </div>
      )}
      {isPasswordReset && (
        <div
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "0.8rem",
            borderRadius: "10px",
          }}
        >
          <p>Please, check your email to reset password!</p>
        </div>
      )}
      <h1>
        {mode === "login"
          ? "Log in"
          : mode === "signup"
          ? "Sign up"
          : "Update password"}
      </h1>
      <AuthForm />
    </>
  );
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");

  if (mode !== "login" && mode !== "signup" && mode !== "password") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
  }
  const formData = await request.formData();

  let data = Object.fromEntries(formData.entries());

  let validations;
  if (mode === "signup") {
    validations = registerSchema.safeParse(data);
  } else if (mode === "login") {
    validations = loginSchema.safeParse(data);
  } else {
    validations = passwordSchema.safeParse(data);
  }

  if (!validations.success) {
    const errors = {};
    for (const error of validations.error.errors) {
      if (!errors[error.path[0]]) errors[error.path[0]] = [error.message];
      else errors[error.path[0]].push(error.message);
    }
    console.log(errors);
    return json({ message: "Validation failed", errors }, { status: 422 });
  }

  data = validations.data;

  let userCredentials;
  try {
    if (mode === "signup") {
      userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
    } else if (mode === "login") {
      userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
    } else {
      await sendPasswordResetEmail(auth, data.email, {
        url: "http://localhost:5173/auth?mode=login",
      });
      return redirect("/auth?mode=login&passwordReset=true");
    }
  } catch (e) {
    console.log(e);
    if (e.code === "auth/invalid-email") {
      return json({ message: "Invalid email" }, { status: 422 });
    } else if (e.code === "auth/weak-password") {
      return json(
        { message: "You must enter a password with at least 6 characters" },
        { status: 422 }
      );
    } else if (e.code === "auth/invalid-credential") {
      return json({ message: "Invalid credentials" }, { status: 422 });
    } else if (e.code === "auth/email-already-in-use") {
      return json({ message: "Email alrady registered" }, { status: 422 });
    } else if (e.code === "auth/too-many-requests") {
      return json(
        {
          message:
            "Account temporary disabled due to many login failed attepmts. Restore your password",
        },
        { status: 422 }
      );
    } else throw e;
  } finally {
    if (userCredentials) {
      const { user } = userCredentials;
      localStorage.setItem("token", user.accessToken);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());

      if (mode === "signup") {
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
            photoUrl: data.photoUrl,
            description: data.description,
            isAdmin: false,
          });
          await sendEmailVerification(auth.currentUser, {
            url: "http://localhost:5173/auth?mode=login",
          });
          logOut();
        } catch (e) {
          console.log(e);
          return json({ message: "Something went wrong" }, { status: 500 });
        }
        return redirect("/auth?mode=login&emailNotVerified=true");
      } else {
        if (!user.emailVerified) {
          console.log("email not verified");
          logOut();
          return redirect("/auth?mode=login&emailNotVerified=true");
        }

        return redirect("/users");
      }
    }
  }
}
