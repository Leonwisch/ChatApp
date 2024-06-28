/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/
import ChatList from "./chatList/ChatList"
import "./list.css"
import UserInfo from "./userInfo/UserInfo"

const List = () => {
    return(
        <div className="list">
            <UserInfo/>
            <ChatList/>
        </div>
    )
}
export default List