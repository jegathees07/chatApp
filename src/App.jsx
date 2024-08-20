import Chat from './components/chat/Chat'
import List from './components/list/List'
import Detail from './components/detail/Detail'
import Login from './components/login/login';
import Notification from './components/notification/Notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './library/firebase';
import { useUserStore } from './library/userStore';
import { useChatStore } from './library/chatStore';

function App() {


  const {currentUser,setLoadingsingin,fetchUserInfo}=useUserStore()
  const { chatId } = useChatStore();



  useEffect(()=>{
     const unSub=onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid)

     })

     return()=>{
        unSub();
     }


  },[fetchUserInfo])

  if(setLoadingsingin) return <div className='p-12 text-4xl rounded-xl bg-gray-800'>Loading... </div>

  return (
   <div className="container w-[90vw] h-[90vh] bg-blue-400 rounded-xl filter backdrop-saturate-50 opacity-90"> 

      {
         currentUser ? (<div className="container w-[90vw] h-[90vh] bg-blue-400 rounded-xl filter backdrop-saturate-50 opacity-90  flex">
          <List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
          </div>):(
         <Login/>
         )
      }
    <Notification/>

   </div>
  )
}

export default App
