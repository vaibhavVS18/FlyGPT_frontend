import "./Chat.css"
import {useContext, useState, useEffect} from "react";
import {MyContext} from "./MyContext";

// formatting of Gpt reply using - react-markdown, rehype-highlight
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


export default function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(()=>{
        if(reply === null){
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" ");   // individual words in array content

        let idx = 0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" "));

            idx++;
            if(idx>=content.length) clearInterval(interval);
        }, 40);

        return ()=> clearInterval(interval);
    },[prevChats, reply])


    return(
        <>
        {newChat && <h1>Start a new chat</h1>}
        
        <div className="chats">
            {
                prevChats?.slice(0,-1).map((chat,idx)=>
                    <div className={chat.role==="user"? "userDiv":"gptDiv"} key={idx}>
                        {
                            chat.role==="user"?
                            <p className="userMessage">{chat.content}</p>:
                            // <p className="gptMessage">{chat.content}</p>
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )
            }

            {
                prevChats.length>0 &&(
                    <>
                        {
                            latestReply !== null ?(
                                <div className="gptDiv" key={"typing"}>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                            ):(
                                <div className="gptDiv" key={"typing"}>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                </div>
                            )
                        }
                    </>
                )
            }

        </div>
        </>
    ) 
}
