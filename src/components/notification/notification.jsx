/* 
Author: Leon Fässler
Date: 28.06.2024
Version: 1.0
Description: This is a chat app in the browser to chat with people.
*/
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
    return(
        <div className="notification">
            <ToastContainer position="bottom-right"/>
        </div>
    )
}

export default Notification