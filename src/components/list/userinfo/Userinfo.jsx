import React from 'react'
import { FaEllipsis } from 'react-icons/fa6'
import { FaVideo } from 'react-icons/fa6'
import { FaPenToSquare } from 'react-icons/fa6'
import { useUserStore } from '../../../library/userStore'

const Userinfo = () => {
  const {currentUser}=useUserStore()
  return (
    <div className='flex p-5 items-center justify-between' >
      <div className='flex items-center gap-5'>
        <img src={currentUser.avatar || "./avatar.png"} className='bg-gray-600 px-2 py-2 w-20 rounded-full'></img>
        <h2>{currentUser.username}</h2>
      </div>
      <div className='flex gap-5'>
     <span className='cursor-pointer'><FaEllipsis/></span>
     <span className='cursor-pointer'><FaVideo/></span>
     <span className='cursor-pointer'><FaPenToSquare/></span>
      </div>
    </div>
  )
}

export default Userinfo
