/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/


import { useEffect, useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../library/firebase";
import { useChatStore } from "../../library/chatStore";
import { useUserStore } from "../../library/UserStore";
import upload from "../../library/upload";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState();
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        URL: "",
    });

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const { currentUser } = useUserStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        })

        return () => {
            unSub();
        };
    }, [chatId])

    const handleEmoji = e => {
        setText(prev => prev + e.emoji);
        setOpen(false)
    }

    const handleImg = e => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleSend = async () => {
        if (text === "" && !img.file) return;

        let imgUrl = null;

        try {

            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl })
                })
            })

            const userIDs = [currentUser.id, user.id]

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId)

                    if (text) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                    } else {
                        userChatsData.chats[chatIndex].lastMessage = "Image";
                    }

                    
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();


                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });

        } catch (err) {
            console.log(err)
        }
        setImg({
            file: null,
            url: "",
        })

        setText("")
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar ||"./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className="center">
                {
                    chat?.messages?.map((message) => (
                        <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createAt}>
                            <div className="texts">
                                {message.img && <img src={message.img} alt="" />}
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}
                {img.url && (<div className="message own">
                    <div className="texts">
                        <img src={img.url} alt="" />
                    </div>
                </div>)}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                </div>
                <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You can not type a message, its a blocked chat!" : "Type a message..."}
                    value={text}
                    onChange={e => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked} />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}
export default Chat