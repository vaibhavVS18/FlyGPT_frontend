import "./Sidebar.css";
import {useContext, useEffect} from "react";
import {MyContext} from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

import blacklogo from '../assets/blacklogo.png';

function Sidebar(){
    // allThreads will have only title and threadId of all threads
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads= async()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/threads`);
            const res = await response.json();
            const filterData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filterData);
            // console.log(filterData);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getAllThreads();
    }, [currThreadId])


    const createNewChat =()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId)=>{
        setCurrThreadId(newThreadId);

        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/thread/${newThreadId}`);
            const res = await response.json();
            console.log("////",res);
            setPrevChats(res);
            setNewChat(false);

            setReply(null);    //imp.- to do latestReply==null in Chat.jsx to print last message content directly
        }
        catch(err){
            console.log(err);
        }
    }

    const deleteThread = async(threadId)=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/thread/${threadId}`, {method:"DELETE"});
            const res = await response.json();
            console.log(res);

            // update threads state 
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId===currThreadId){
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            
            <section className="sidebar">
                    <button onClick={createNewChat}>
                        <img src={blacklogo} alt="gpt logo" className="logo"></img>
                        <span><i className="fa-solid fa-pen-to-square"></i></span>
                    </button>


                <ul className="history">
                    {
                        allThreads?.map((thread, idx)=>(
                            <li key={idx}
                                onClick={(e)=>changeThread(thread.threadId)}
                                className={thread.threadId===currThreadId? "highLighted":""}
                            >{thread.title}
                            
                            <i className="fa-solid fa-trash"
                                onClick={(e)=>{
                                    e.stopPropagation();    // to stop event bubbling, (bcoz when we click on child icon ,parent list will also be clicked)
                                    deleteThread(thread.threadId);
                                }}  
                            ></i>
                            </li>

                        ))
                    }
                </ul>


                <div className="sign">
                    <p>By FlyGPT &hearts;</p>
                </div>
            </section>

        </div>
    )
};

export default Sidebar;