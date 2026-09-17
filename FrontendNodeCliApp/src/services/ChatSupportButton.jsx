import { TbMessageCircleSearch } from "react-icons/tb";
import socket from "../socket";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
const ChatSupportButton = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState([]);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const typingTimeout = useRef(null)
    const messageEndRef = useRef(null)

    useEffect(() => {

        const handleChatHistory = (messages) => {
            console.log("Chat history:", messages);
            setNewMessages(messages);
        };
        const handleNewMessage = (msg) => {
            setNewMessages((prev) => [
                ...prev, msg
            ])
            if (msg.sender?.role === 'admin') {
                socket.emit('chat:read')
            }
        }
        const handleTyping = ({ role }) => {
            if (role === "admin") {
                setIsAdminTyping(true);
            }
            console.log('admin is typing');
        }

        const handleStopTyping = ({ role }) => {
            if (role === "admin") {
                setIsAdminTyping(false);
            }
            console.log('admin stopped typing');
        }
        const handleRead = ({ readAt }) => {
            setNewMessages((prev) =>
                prev.map((msg) => {
                    if (msg.sender?.role !== 'admin') {
                        return {
                            ...msg, readAt
                        }
                    }
                    return msg;
                })
            )
        }




        socket.on("chat:history", handleChatHistory);
        socket.on('chat:message', handleNewMessage);
        socket.on('chat:typing', handleTyping)
        socket.on('chat:stopTyping', handleStopTyping)
        socket.on('chat:read', handleRead)
        return () => {
            socket.off("chat:history", handleChatHistory);
            socket.off('chat:message', handleNewMessage);
            socket.off("chat:typing", handleTyping);
            socket.off('chat:stopTyping', handleStopTyping);
            socket.off("chat:read", handleRead);
        };
    }, []);

   useEffect(()=>{
      setTimeout(() => {
    socket.emit("test:message", {
      text: "Hello from client A"
    });
  }, 2000);
socket.on("test:message", (data) => {
  console.log("CLIENT A RECEIVED:", data);
});
   },[])


    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [newMessages, isAdminTyping])

    const handleChatSupport = () => {
        socket.emit("chat:join");
        socket.emit("chat:read");
    };
    const handleSendMessage = () => {
        if (!message.trim()) return;
        socket.emit('chat:message', {
            text: message
        });
        setMessage("")
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {open && (
                <div className="z-50 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-white">
                        <div>
                            <p className="text-sm font-semibold">Customer Support</p>
                            <p className="text-[10px] text-green-100">We usually reply quickly</p>
                        </div>
                        <button
                            onClick={() => {
                                socket.emit("chat:leave");
                                setOpen(false);
                            }}
                            className="rounded-full p-1.5 text-white/90 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close chat"
                        >
                            <RxCross2 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex max-h-[360px] min-h-[260px] flex-col bg-slate-50">
                        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
                            {newMessages.map((message) => {
                                const isAdmin = message.sender?.role === 'admin';
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[75%] ${isAdmin ? 'text-left' : 'text-right'}`}>
                                            <div className="mb-1 text-[10px] font-medium text-slate-500">
                                                {message.sender?.name}
                                                {isAdmin ? ' (admin)' : ''}
                                            </div>

                                            <div
                                                className={`rounded-2xl px-3 py-2 shadow-sm ${isAdmin
                                                    ?
                                                    'bg-white text-slate-700 rounded-bl-md' : 'bg-emerald-500 text-white rounded-br-md'
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                                    {message.text}
                                                </p>
                                                <div
                                                    className={`mt-1 text-[10px] ${isAdmin ? 'text-gray-400' : 'text-white'
                                                        }`}
                                                >

                                                    <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                                                    {!isAdmin && (
                                                        <span>{message.readAt ? '✔️✔️' : '✓'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {isAdminTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2 shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-400 mr-1">
                                                Admin is typing
                                            </span>

                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messageEndRef} />
                        </div>

                        <div className="border-t border-slate-200 bg-white p-2">
                            <div className="flex items-center gap-2">
                                <input
                                    maxLength={60}
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value)
                                        socket.emit('chat:typing')
                                        clearTimeout(typingTimeout.current)
                                        typingTimeout.current = setTimeout(() => {
                                            socket.emit("chat:stopTyping")
                                        }, 1000)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendMessage()
                                        }
                                    }}
                                    required
                                    placeholder="Type for help..."
                                    className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                                />

                                <button
                                    onClick={handleSendMessage}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
                                    aria-label="Send message"
                                >
                                    <IoSend className="h-4 w-4" />
                                </button>
                            </div>
                            <button onClick={() => {
                                socket.emit('chat:leave')
                                setOpen(!open)
                            }} className="bg-red-400 w-full rounded-md py-2 mt-1">End Session </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => {
                    setOpen(!open)
                    if (!open) {
                        handleChatSupport();
                    }
                }}
                type="button"
                className={`
                    ${open ? 'bg-red-400' : 'bg-emerald-500'}
                    flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg
                    transition-all duration-200 hover:scale-105 active:scale-110
                `}
                aria-label="Open chat support"
            >
                {open ? <RxCross2 className="h-7 w-7" /> : <TbMessageCircleSearch className="h-7 w-7" />}
            </button>
        </div>
    );
};

export default ChatSupportButton;