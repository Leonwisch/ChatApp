/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/
import { useState } from "react";
import { toast } from "react-toastify";
import "./login.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../library/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../library/upload";

const Login = () => {
    const [avatar, setAvatar] = useState({
        fill: null,
        url: ""
    });

    const [loading, setloading] = useState(false);

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setloading(true);

        const formData = new FormData(e.target);

        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setloading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setloading(true)

        const formData = new FormData(e.target);

        const { username, email, password } = Object.fromEntries(formData);

        if (!username || !email || !password) return toast.warn("Please fill out all inputs!");

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return toast.warn("Select another username");
        }

        try {

            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = await upload(avatar.file);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });



            toast.success("Account is created! You can Log in!")

        } catch (err) {
            console.log(err);
            toast.error(err.message)
        } finally {
            setloading(false)
        }
    }

    return (
        <div className="login">
            <div className="item">
                <h2>Login, Welcome back!</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an Image</label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login