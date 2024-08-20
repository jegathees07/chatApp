// Detail.jsx

import React from 'react';
import { FaChevronCircleDown } from 'react-icons/fa';
import { auth } from '../../library/firebase';
import { useChatStore } from '../../library/chatStore';
import { useUserStore } from '../../library/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../library/firebase'; // Add this line to import db

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isCurrentReceiverBlocked, setLoadingSignIn, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBLock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isCurrentReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='flex-1 p-5'>
      <div className='flex flex-col items-center'>
        <img src={user?.avatar} className='w-32 text-3xl p-2  rounded-full' alt='User avatar'></img>
        <h1 className='text-2xl mt-1'>{user?.username}</h1>
        <p className='text-xl my-1'>Lorem ipsum dolor sit amet.</p>
      </div>
      <hr />
      <div className='mt-2'>
        <div className='py-3'>
          <div className='flex justify-between'>
            <span>Chat settings</span>
            <span className='cursor-pointer'><FaChevronCircleDown /></span>
          </div>
        </div>
        <div className='py-3'>
          <div className='flex justify-between'>
            <span>Chat settings</span>
            <span className='cursor-pointer'><FaChevronCircleDown /></span>
          </div>
        </div>
        <div className='py-3'>
          <div className='flex justify-between'>
            <span>privacy & help</span>
            <span className='cursor-pointer'><FaChevronCircleDown /></span>
          </div>
        </div>
        <div className='py-3'>
          <div className='flex justify-between'>
            <span>Shared photos</span>
            <span className='cursor-pointer'><FaChevronCircleDown /></span>
          </div>
        </div>
        <div className='py-3'>
          <div className='flex justify-between'>
            <span>Shared Files</span>
            <span className='cursor-pointer'><FaChevronCircleDown /></span>
          </div>
        </div>
        <div className='flex flex-col justify-center'>
          <button onClick={handleBLock} className='px-20 rounded-sm hover:bg-yellow-950 py-2 bg-black'>
            {isCurrentUserBlocked ? " you are blocked" : isCurrentReceiverBlocked ? "user Blocked" : "Block user"}
          </button>
          <button onClick={() => auth.signOut()} className='mt-5 px-20 rounded-sm hover:bg-yellow-950 py-2 bg-black'>Log out</button>
        </div>
      </div>
    </div>
  );
};

export default Detail;
