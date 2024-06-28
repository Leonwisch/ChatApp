/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/

import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css";
import { db } from "../../../../library/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../library/UserStore";

const AddUser = () => {
    const [user, setUser] = useState(null)

    const { currentUser } = useUserStore();
    const handleSearch = async e => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const email = formData.get("email");

        try {

            const userRef = collection(db, "users");

            const q = query(userRef, where("email", "==", email));

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }

        } catch (err) {
            console.log(err)
        }
    }

    const handleAdd = async () => {
        const chatRef = collection(db, "chats")
        const userChatsRef = collection(db, "userchats")

        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })
            })

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                })
            })

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Email" name="email" />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}

export default AddUser;