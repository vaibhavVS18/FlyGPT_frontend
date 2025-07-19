import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from "./MyContext.jsx";
import {useContext, useState, useEffect} from "react";

import {ScaleLoader} from "react-spinners";

function ChatWindow(){

    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);    // no need to be a part of context
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async()=>{
        setLoading(true);
        setNewChat(false);

        console.log("message", prompt);

        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, options);
            const res = await response.json();
            // console.log(res);
            setReply(res.reply);
        }
        catch(err){
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats =>(
                [...prevChats, {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
                ]
            ))
        }

        setPrompt("");

    }, [reply]);

    const handleProfileClick =()=>{
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>FlyGPT <i className="fa-solid fa-chevron-down"></i></span>     
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>       
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-right-from-bracket"></i>Log out</div>
                </div>
            }

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                            value={prompt}
                            onChange= {(e)=>setPrompt(e.target.value)}
                            onKeyDown={(e)=> e.key==='Enter'? getReply(): ""}
                    ></input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">FlyGPT can make mistakes. Check important info. See Cookie Preferences.</p>
            </div>
        </div>
    )
};

export default ChatWindow;