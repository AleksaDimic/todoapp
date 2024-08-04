'use client'
import { googleProvider, auth } from '../db/firebase'
import { onAuthStateChanged, signInWithPopup, signOut} from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation.js';

const LoginPage = () => {
    const router = useRouter()
    const googleSignin = () => {
        signInWithPopup(auth, googleProvider)
        .then(() => {
            router.push('/')
        })
        .catch((e) => {
            console.log(e)
        })
    }
   
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/')
            }
        })
    }, [])
    return ( 
        <main className='w-screen h-screen flex justify-center items-center'>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <div className='border-neutral-400 p-10 bg-neutral-500 rounded-xl flex flex-col'>

            <h1 className='mb-2'>Log in with Google</h1>
            <button onClick={googleSignin} className='p-2 bg-white text-black rounded-xl'>Google<i className="fa-brands fa-google ml-2"></i></button>

            </div>
           
        </main>
     );
}
export default LoginPage;