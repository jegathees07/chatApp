import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import Userinfo from '../userinfo/Userinfo';
import Adduser from '../../adduser/Adduser';
import { useUserStore } from '../../../library/userStore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../library/firebase';
import { useChatStore } from '../../../library/chatStore';

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const unsub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item) => {
          if (!item.receiverId) {
            console.error('Receiver ID is undefined for chat item:', item);
            return null;
          }
          const userDocRef = doc(db, 'users', item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          if (!user) {
            console.error('User data not found for receiver ID:', item.receiverId);
            return null;
          }

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.filter(chat => chat !== null).sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unsub();
      };
    }
  }, [currentUser]);

  const filteredChats = chats.filter((c) =>
    c.user.username?.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = async (chat) => {
    changeChat(chat.chatID, chat.user);
  };

  return (
    <div className="p-5 h-[80vh] overflow-auto pt-5">
      <div className="flex gap-5 items-center">
        <div className="flex gap-5 items-center bg-blue-600 py-2 px-2 rounded-lg">
          <FaSearch />
          <input
            className="rounded-xl px-2 text-sm py-1 outline-none text-black"
            type="text"
            placeholder="search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button
          onClick={() => setAddMode((prev) => !prev)}
          className="text-xl bg-blue-700 p-3 rounded-xl"
        >
          {addMode ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      {filteredChats.map((chat) => (
        <div onClick={() => handleSelect(chat)} className="mt-10" key={chat.chatID}>
          <div className="flex cursor-pointer items-center gap-5 mt-5 border-b-2 pb-5">
            <img
              src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || './avatar.png'}
              alt={chat.user?.name}
              className="text-xl bg-blue-700 p-1 rounded-full w-12 h-12"
            />
            <div>
              <span className="text-xl">{chat.user.blocked.includes(currentUser.id) ? "user" : chat.user.username}</span>
              <p className="text-sm">{chat.lastMessage}</p>
            </div>
          </div>
        </div>
      ))}
      {addMode && <Adduser />}
    </div>
  );
};

export default Chatlist;
