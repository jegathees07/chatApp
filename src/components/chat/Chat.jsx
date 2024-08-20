import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaPhone, FaVideo, FaInfo, FaImage, FaCamera, FaMicrophone, FaFaceSmile } from 'react-icons/fa6';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../library/firebase';
import { useChatStore } from '../../library/chatStore';
import { useUserStore } from '../../library/userStore';
import upload from '../../library/upload';

const Chat = () => {
  const [chat, setChat] = useState(false);
  const [emojiPick, setEmojiPick] = useState(false);
  const [text, setText] = useState("");
  const { chatId, user, isCurrentUserBlocked,isCurrentReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);
  const [img, setImg] = useState({ file: null, url: "" });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unsub();
    }
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setEmojiPick(false);
  }

  const handleSend = async () => {
    setText("");
    if (text === "" && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: Date.now(), // Ensure a unique identifier for each message
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chats.findIndex((c) => c.chatId === chatId);
          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = text;
            userChatData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
            userChatData.chats[chatIndex].updateAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            });
          }
        }
      });

      setImg({ file: null, url: "" }); // Reset image state after sending

    } catch (err) {
      console.log(err);
    }
  }

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  return (
    <div className='flex-[2] border-x-[1px] h-[100%] flex flex-col'>
      <div className='top flex p-5 items-center justify-between border-b-[1px]'>
        <div className='flex items-center gap-5'>
        <img className='w-10 bg-gray-700 p-1 rounded-md' src={user.avatar} alt="" />
          <div className='flex-row gap-2'>
            <span className='text-xl'>{user.username}</span>
            <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div className='flex text-xl gap-5'>
          <span className='cursor-pointer'><FaPhone /></span>
          <span className='cursor-pointer'><FaVideo /></span>
          <span className='cursor-pointer'><FaInfo /></span>
        </div>
      </div>

      <div className='middle flex-1 p-5 h-[100vh] overflow-x-scroll my-5 py-5 flex '>
        <div className={`flex-row`}>
          {
            chat?.messages?.map((message) => {
              const messageKey = message?.id || message?.createdAt?.toString() || Date.now().toString();
              return (
                <div
                  key={messageKey}
                  className={`message p-3 rounded-lg mb-3  ${
                    message.senderId === currentUser?.id ? "justify-between" : ""
                  }  `}
                >
                  <div className={` p-2 text-xl text-black font-extralight  ${
                    message.senderId === currentUser?.id ? "bg-green-200 rounded-l-xl inline-block      " : "bg-red-200 rounded-r-xl inline-block  "
                  }`}>
                    <div className=' inline-block'>
                      {message.img && <img src={message.img} alt="" className="max-w-[100px] rounded-md" />}
                      <div>
                        <p>{message.text}</p>  
                      </div>
                    </div>
                  </div><br />
                  <span className='text-[8px] text-black bg-white py-[2px] px-[4px] rounded-full opacity-50'>1 min ago</span>
                </div>
              );
            })
          }
          {img.url && (
            <div>
              <img src={img.url} alt="" className="max-w-[100px] rounded-md" />
            </div>
          )}
          <div ref={endRef}></div>
        </div>
      </div>

      <div className='mt-auto bottom border-t-[1px] flex items-center justify-between p-5'>
        <div className='flex items-center gap-5 text-xl'>
          <label htmlFor="file">
            <span className='cursor-pointer'><FaImage /></span>
          </label>
          <input type="file" id='file' style={{ display: "none" }} onChange={handleImg} />
          <span className='cursor-pointer'><FaCamera /></span>
          <span className='cursor-pointer'><FaMicrophone /></span>
        </div>

        <input
          className='text-black px-3 py-1 outline-none rounded-sm w-[350px] h-[40px]'
          value={text}
          disabled={isCurrentUserBlocked || isCurrentReceiverBlocked}
          type="text"
          placeholder='type something....'
          onChange={e => setText(e.target.value)}
        />

        <div className='flex-row items-center gap-5 relative'>
          <span onClick={() => setEmojiPick((prev) => !prev)} className='cursor-pointer text-2xl'><FaFaceSmile /></span>
          <div className='absolute bottom-12'>
            <EmojiPicker open={emojiPick} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button onClick={handleSend} disabled={isCurrentUserBlocked || isCurrentReceiverBlocked} className='bg-black px-3 py-2 rounded-sm'>Send</button>
      </div>
    </div>
  );
}

export default Chat;
