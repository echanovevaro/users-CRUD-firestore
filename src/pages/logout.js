import { redirect } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const action = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error('An error ocurred while loging out', {status: 500});
    }
    return redirect('/auth?mode=login');
}