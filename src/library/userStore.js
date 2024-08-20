import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import { get } from 'firebase/database'

export const useUserStore = create((set) => ({
   currentUser:null,
   setLoadingsingin:true,
   fetchUserInfo: async (uid) =>{
    if(!uid)   return set({currentUser:null, setLoadingsingin:false})

        try{
          
             const docRef = doc(db,"users",uid)
             const docSnap = await getDoc(docRef)

             if(docSnap.exists()){
                set({currentUser:docSnap.data(),setLoadingsingin:false})
             }else{
                set({currentUser:null,setLoadingsingin:false})
             }
        }catch(err){
            console.log(err.message)
            return set({currentUser:null, setLoadingsingin:false})
        }
      
   }
 
}))