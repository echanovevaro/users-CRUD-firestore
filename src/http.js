import { QueryClient } from "@tanstack/react-query"
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"

export const queryClient = new QueryClient()

export const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let data = [];
  querySnapshot.forEach((d) => {data.push({...d.data(), id: d.id})});
  console.log(data);
  return data;
}

export const fetchUser = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data= {...docSnap.data(), id: docSnap.id};
    console.log(data);
    return data;
  } else {
    throw new Error("User not found", {status: 404});
  }
}
export const createUser = async (user) => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })

  return response.json()
}
