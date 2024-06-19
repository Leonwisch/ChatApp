import List from "./components/list/List"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import Login from "./components/login/Login.jsx"
import Notification from "./components/notification/notification.jsx"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./library/firebase.js"
import { useUserStore } from "./library/UserStore.js";

const App = () => {


  const {currentUser, isLoading, fetchUserInfo} = useUserStore();

  useEffect(()=>{
    const unknownP = onAuthStateChanged(auth, (user)=>{
      fetchUserInfo(user?.uid)
    });

    return () =>{
      unknownP();
      };

  },[fetchUserInfo])

  if(isLoading) return <div className="Loading">Loading</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            <Chat />
            <Detail />
          </>
        ) : (
          <Login />
        )}
        <Notification />
    </div>
  )
}

export default App