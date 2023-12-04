import { json, redirect } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { loginSchema, registerSchema } from "../validation";

import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
  }
  const formData = await request.formData();

  let data;
  if (mode === "signup") {
    data = Object.fromEntries(formData.entries());
  } else {
    data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
  }

  let validations;
  if (mode === "signup") {
    validations = registerSchema.safeParse(data);
  } else {
    validations = loginSchema.safeParse(data);
  }
  console.log(validations);
  if (!validations.success) {
    const errors = {};
    for (const error of validations.error.errors) {
      if (!errors[error.path[0]]) errors[error.path[0]] = error.message;
    }
    console.log(errors);
    return json({ message: "Validation failed" }, { errors }, { status: 422 });
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
    } else {
      userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
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
    } else throw e;
  } finally {
    if (userCredentials) {
      console.log("userCredentials", userCredentials);
      const { user } = userCredentials;
      console.log(user);
      localStorage.setItem("token", user.accessToken);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());

      if (mode === "signup") {
        console.log(user.uid);

        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
            photoUrl: data.photoUrl,
            description: data.description,
            isAdmin: false,
          });
        } catch (e) {
          console.log(e);
          return json({ message: "Something went wrong" }, { status: 500 });
        }
      }
      return redirect("/users");
    }
  }
}
