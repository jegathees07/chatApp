import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../library/firebase'
import { db } from '../../library/firebase'
import { doc,setDoc } from 'firebase/firestore'
import upload from '../../library/upload'

const Login = () => {

  const [avatar,setAvatar]=useState({
    file:null,
    url:""
  })

  const [loadingsingup,setLoadingsingup]=useState(false)
  const [loadingsingin,setLoadingsingin]=useState(false)

  const handleAvatar=e=>{
    if(e.target.files[0]){
        setAvatar({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
    }
   
  }

  const handlelogin =async(e)=>{
    e.preventDefault()
    setLoadingsingin(true)
    const  formData= new FormData(e.target)
    const formEntries=Object.fromEntries(formData.entries())
   const {email,password}=formEntries

    try{
       await signInWithEmailAndPassword(auth,email,password)
    }
    catch(err){
      console.log(err)
      toast.error(err.message)
    }
    finally{
      setLoadingsingin(false)
    }
    
  }

 
  
  const handleRegister = async (e)  =>{
    e.preventDefault()

    setLoadingsingup(true)

    const  formData= new FormData(e.target)
     const formEntries=Object.fromEntries(formData.entries())
    const {username,email,password}=formEntries
   

    try{
     
        const res = await createUserWithEmailAndPassword(auth,email,password)

        const imgUrl=await upload(avatar.file)

        await setDoc(doc(db, "userschats", res.user.uid), {
         chats:[]
          });


          await setDoc(doc(db, "users", res.user.uid), {
            username,
            email,
            avatar:imgUrl,
            id:res.user.uid,
            blocked:[],
            
            });
      
    toast.success("Account created! you can login now!")
    }catch(err){
        console.log(err.message)
        toast.error(err.message)
    }
    finally{
      setLoadingsingup(false)
    }
    
  }






  return (
    <div className='form-container'>
     <div className='  flex flex-col items-center gap-5'>
        <h2 className='text-4xl text-black font-semibold'>
            welcome ,back
        </h2>
        <form onSubmit={handlelogin} className='flex flex-col items-center justify-center gap-5' action="">
            <input className='px-5 py-3 outline-none' type="text" placeholder='Email' name='email' />
            <input className='px-5 py-3 outline-none ' type="password" placeholder='Password' name='password' />
            <button disabled={loadingsingin} className='px-10 text-black font-bold py-3 outline-none bg-white rounded-sm'>{loadingsingin?"Loading...":"Sign in"}</button>
        </form>
     </div>
     <div className='h-4/5 w-[2px] bg-white'>

     </div>
     <div className=' flex flex-col items-center gap-5'>
        <h2>
            Create an account
        </h2>
        <form onSubmit={handleRegister} className='flex flex-col items-center justify-center gap-5' action="">
            <label className='cursor-pointer w-full flex items-center justify-around text-black  font-extrabold' htmlFor="file">
                <img className='w-14 h-14 rounded-xl object-cover' src={avatar.url || "./avatar.png"} alt="" />
                Upload an image</label>
            <input  type="file" id='file' name='file' style={{display:"none"}} onChange={handleAvatar}/>
            <input className='px-5 py-3 outline-none ' type="text" placeholder='UserName' name='username' />
            <input className='px-5 py-3 outline-none ' type="text" placeholder='Email' name='email' />
            <input className='px-5 py-3 outline-none' type="text" placeholder='Password' name='password' />
            <button  disabled={loadingsingup}  className='px-10 text-black font-bold py-3 outline-none bg-white rounded-sm disabled:cursor-not-allowed'>{loadingsingup?"Loading...":"Sign Up"}</button>
        </form>
     </div>
    </div>
  )
}

export default Login
