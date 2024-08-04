'use client'
import { auth, firestore } from './db/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation.js';

interface TodoData {
  todo: string;
  done: boolean;
  userID: string;
  timestamp: Timestamp;
  id: string;
}

export default function Home() {
  const router = useRouter();
  const todosRef = collection(firestore, "todos");
  const [data, setData] = useState<Omit<TodoData, 'id'>>({
    todo: "",
    done: false,
    userID: "",
    timestamp: Timestamp.now(),
  });
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [userData, setUserData] = useState({
    name: '',
    profilePic: '',
    uid: '',
    email: ''
  });

  const addTodo = async () => {
    if (data.todo !== "") {
      const docRef = await addDoc(todosRef, { ...data, timestamp: Timestamp.now() });
      console.log("Document added with ID:", docRef.id);
    }
  };

  const toggleDone = async (todoId: string, currentDone: boolean) => {
    if (!todoId) {
      console.error("Invalid todoId provided:", todoId);
      return;
    }
    const todoDoc = doc(firestore, "todos", todoId);
    await updateDoc(todoDoc, {
      done: !currentDone
    });
  };

  const deleteTodo = async (todoId: string) => {
    if (!todoId) {
      console.error("Invalid todoId provided for deletion:", todoId);
      return;
    }
    const todoDoc = doc(firestore, "todos", todoId);
    await deleteDoc(todoDoc);
    console.log("Document deleted with ID:", todoId);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setData((prevData) => ({
          ...prevData,
          userID: user.uid ?? "none"
        }));
        setUserData({
          name: user.displayName ?? "Guest",
          profilePic: user.photoURL ?? "There is not any",
          uid: user.uid,
          email: user.email ?? '',
        });
      } else {
        router.push('/account');
      }
    });

    const unsubscribeSnapshot = onSnapshot(todosRef, (querySnapshot) => {
      const todosArray: TodoData[] = [];
      querySnapshot.forEach((doc) => {
        const todoData = { id: doc.id, ...doc.data() } as TodoData;
        console.log("Todo data retrieved:", todoData);
        if (todoData && todoData.timestamp) {
          todosArray.push(todoData);
        }
      });
      todosArray.sort((a, b) => {
        const aTimestamp = a.timestamp?.seconds || 0;
        const bTimestamp = b.timestamp?.seconds || 0;
        return bTimestamp - aTimestamp;
      });
      setTodos(todosArray);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, [router]);

  const signOutFunction = () => {
    signOut(auth)
      .then(() => {
        router.push('/account');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main className='flex !w-screen !h-screen'>
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <form className='flex flex-grow w-full h-full items-center justofy-self-center mt-4 flex-col ' onSubmit={(event) => {
        event.preventDefault();
        addTodo();
        setData({...data, todo: ''})
      }}>
        <div>
          <input
          type="text"
          className='text-white bg-transparent border-b-4 border-white outline-none h-max indent-3'
          value={data.todo}
          onChange={(e) => {
            setData((prevData) => ({
              ...prevData,
              todo: e.target.value
            }));
          }}
        />
        <button type='submit' className=' border-green-500 bg-green-600 text-white w-10 h-10 rounded-xl ml-3'>Add</button></div>
        

        <div className='flex flex-col w-max text-center mt-3'>
        {todos
          .filter(todo => todo.userID === userData.uid)
          .map((todo) => (
            <div
              key={todo.id}
              className={`p-2 ${todo.done ? 'bg-green-500' : 'bg-red-500'} rounded-md mt-3`}
              onClick={() => toggleDone(todo.id, todo.done)}
            >
              <p className='mt-5'>{todo.todo}</p>
              <button onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
              }} className='w-max text-center hover:text-red-900 duration-500'>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
      </div>
      </form>

      <div className='flex flex-col w-full mt-5 mr-5 items-end'>
        <div className='flex flex-col items-center gap-5 text-center bg-neutral-800 rounded-xl p-2'>
          <img className='rounded-md w-14 h-14 m' src={userData.profilePic} />
          <div className='flex-col'>
            <h1 className='text-sm mb-4 ml-2'>{userData.name}</h1>
            <h1 className='text-sm mb-1 ml-2'>{userData.email}</h1>
            <button
        onClick={signOutFunction}
        className='w-max p-2 bg-red-600 text-white rounded-xl mt-5 hover:bg-red-400 duration-500'
      >
        Sign Out
      </button>
          </div>
        </div>
      </div>
    </main>
  );
}
