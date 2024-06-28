/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/

import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../library/UserStore";
import { useChatStore } from "../../library/chatStore"
import { auth, db } from "../../library/firebase"
import "./detail.css"

const Detail = () => {

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id)

        try {

            await updateDoc(userDocRef,{
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })
            changeBlock()
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>{user?.email}</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./37038814.jpeg" alt="" />
                                <span>Photo_2024_1.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./37038814.jpeg" alt="" />
                                <span>Photo_2024_1.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./37038814.jpeg" alt="" />
                                <span>Photo_2024_1.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./37038814.jpeg" alt="" />
                                <span>Photo_2024_1.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>{
                isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked!" : "Block User"
                }</button>
                <button className="logout" onClick={() => { auth.signOut() }}>Logout</button>
            </div>

        </div>
    )
}
export default Detail