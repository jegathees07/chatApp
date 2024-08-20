import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../library/firebase';
import { useUserStore } from '../../library/userStore';

const Adduser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error searching user:', err);
    }
  };

  const handleAdd = async () => {
    if (!user || !currentUser) {
      console.error('User or currentUser is undefined');
      return;
    }
  
    const chatRef = collection(db, 'chats');
    const userChatRef = collection(db, 'userchats');
  
    try {
      const newChatRef = doc(chatRef);
  
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      const userChatDocRef = doc(userChatRef, user.id);
      const currentUserChatDocRef = doc(userChatRef, currentUser.id);
  
      const userChatDoc = await getDoc(userChatDocRef);
      const currentUserChatDoc = await getDoc(currentUserChatDocRef);
  
      if (!userChatDoc.exists()) {
        await setDoc(userChatDocRef, {
          chats: []
        });
      }
  
      if (!currentUserChatDoc.exists()) {
        await setDoc(currentUserChatDocRef, {
          chats: []
        });
      }
  
      await updateDoc(userChatDocRef, {
        chats: arrayUnion({
          chatID: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
  
      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion({
          chatID: newChatRef.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
  
      console.log('New chat created with ID:', newChatRef.id);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };
  

  return (
    <div className="w-max h-max p-8 bg-slate-800 rounded-md absolute top-0 bottom-0 left-0 right-0 m-auto">
      <form onSubmit={handleSearch} className="flex gap-8" action="">
        <input
          className="px-5 py-2 rounded-lg outline-none text-black"
          type="text"
          name="username"
          placeholder="username"
          id=""
        />
        <button className="px-4 py-1 bg-black rounded-xl">Search</button>
      </form>
      {user && (
        <div className="flex justify-around items-center">
          <div className="mt-12 flex items-center justify-around gap-8">
            <img
              className="w-12 h-12 rounded-full bg-cover"
              src={user.avatar || './avatar.png'}
              alt=""
            />
            <h1>{user.username}</h1>
          </div>
          <button onClick={handleAdd} className="mt-12 px-4 py-1 bg-black rounded-xl">
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default Adduser;
