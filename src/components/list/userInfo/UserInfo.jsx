/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/
import { useUserStore } from "../../../library/UserStore";
import "./userInfo.css"

const UserInfo = () => {

    const {currentUser} = useUserStore();

    return(
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png" }alt=""/>
                <h2>{currentUser.username}</h2>
            </div>
            
        </div>
    )
}
export default UserInfo