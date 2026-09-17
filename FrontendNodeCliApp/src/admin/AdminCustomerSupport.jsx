import { useEffect, useRef, useState } from "react"
import adminSocket from "../adminSocket";
import { CgProfile } from "react-icons/cg";
import { IoSend } from "react-icons/io5";


const AdminCustomerSupport = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setselectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [adminMsg, setAdminMsg] = useState("")
  const [left, setLeft] = useState("")
  const [isUserTyping, setIsUserTyping] = useState(false);
  let typingTimeout = useRef(null);
  const messageEndRef = useRef(null)



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const handleConnection = () => {
      console.log("Admin socket connected:", adminSocket.id);
      adminSocket.emit("admin:getRooms")
    }
    const handleRooms = (rooms) => {
      console.log(rooms);
      setActiveUsers(rooms)
    }
    const handleError = (error) => {
      console.error("Admin socket error:", error.message);
    };
    const handleChatHistory = (messages) => {
      console.log("Admin chat history:", messages);
      setMessages(messages);
    }
    const handleNewMessage = (message) => {
      console.log("New message:", message);
      setMessages((prev) => [
        ...prev,
        message,
      ]);
      console.log('sender role in message', message.sender.role);

      if (message.sender?.role !== 'admin') {
        const userId = message.room.replace("support:", "");
        adminSocket.emit("admin:read", { userId: userId })
      }
    }


    const handleCustomerLeave = (msg) => {
      setLeft(`${msg} left the chat`)
    }
    const handleTyping = ({ userId }) => {
      console.log("User typing:", userId);
      setIsUserTyping(true);

    };

    const handleStopTyping = (({ userId }) => {
      console.log("User stopped typing:", userId);
      setIsUserTyping(false);
    })

    const handleRead = ({ readAt }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.sender?.role === "admin") {
            return {
              ...msg,
              readAt,
            };
          }

          return msg;
        })
      );
    };


    adminSocket.on("support:rooms", handleRooms);
    adminSocket.on("connect", handleConnection);
    adminSocket.on("connect_error", handleError);
    adminSocket.on('chat:history', handleChatHistory)
    adminSocket.on('chat:message', handleNewMessage)
    adminSocket.on('chat:leave', handleCustomerLeave);
    adminSocket.on('chat:typing', handleTyping)
    adminSocket.on('chat:stopTyping', handleStopTyping)
    adminSocket.on('admin:read', handleRead)



    adminSocket.auth = { token };
    if (!adminSocket.connected) {
      adminSocket.connect();
    }else{
      adminSocket.emit('admin:getRooms')
    }

    return () => {
      adminSocket.emit("admin:leave")
      adminSocket.off("support:rooms", handleRooms);
      adminSocket.off("connect", handleConnection);
      adminSocket.off("connect_error", handleError);
      adminSocket.off("chat:history", handleChatHistory);
      adminSocket.off("chat:message", handleNewMessage)
      adminSocket.off("chat:typing", handleTyping);
      adminSocket.off('chat:stopTyping', handleStopTyping)
      adminSocket.off('admin:read', handleRead)
    };
  }, [])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behaviour: "smooth"
    })
  }, [messages, isUserTyping])

 useEffect(()=>{
  adminSocket.on("test:message", (data) => {
  console.log("CLIENT B RECEIVED:", data);
});
 },[])



  const handleMsg = (userId) => {
    adminSocket.emit('admin:join', {
      userId
    })
    adminSocket.emit("admin:read", {
      userId
    })
  }

  const handleSendMsg = () => {
    if (!adminMsg.trim() || !selectedUser) return;

    adminSocket.emit('admin:message', { userId: selectedUser.userId, text: adminMsg })
    setAdminMsg("")
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:flex md:h-screen">
        <aside className="md:w-56 w-full bg-white border-r border-gray-200 p-4">
          <h2 className="text-gray-800 text-center font-semibold mb-3">Active Users</h2>
          <div className="space-y-2 overflow-y-auto max-h-[65vh] md:max-h-[85vh]">
            {
              activeUsers.map((user) => (
                <button
                  onClick={() => {
                    setselectedUser(user)
                    setMessages([])
                    handleMsg(user.userId)
                  }}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition ${selectedUser === user ? 'bg-green-50 ring-1 ring-green-200' : 'bg-white'}`}
                  key={user.userId}
                >
                  <CgProfile className="w-10 h-10 text-gray-500" />
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email || 'Customer'}</div>
                  </div>
                  <span className="h-3 w-3 bg-green-500 rounded-full" aria-hidden />
                </button>
              ))
            }
          </div>
        </aside>

        <main className="flex-1 p-4">
          <div className="mx-auto max-w-4xl">
            {selectedUser ? (
              <div className="flex flex-col h-[75vh] md:h-[85vh] border rounded-lg bg-white overflow-hidden">
                <header className="px-4 py-3 border-b bg-gray-50">
                  <div className="text-lg font-semibold text-gray-800">Chat with {selectedUser.name}</div>
                  <div className="text-sm text-gray-500">{selectedUser.email || 'Customer Support Session'}</div>
                </header>

                <div className={`flex-1 px-2 py-1 overflow-y-auto space-y-2 bg-gray-50 `}>
                  {messages.map((message) => (
                    <div key={message._id} className={`min-w-[20%] max-w-[70%] ${message.sender?.role === 'admin' ? 'ml-auto text-end' : 'mr-auto text-start'}`}>
                      <div className="text-xs text-gray-500 mb-1">{message.sender?.name}{' '}{message.sender.role === 'admin' ? '(admin)' : ''}</div>

                      <div className="rounded-lg bg-white px-3 py-1 text-gray-800 shadow-sm">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className="text-right text-[10px] text-gray-400 mt-2 flex justify-end gap-1">
                          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                          {message.sender?.role === "admin" && (
                            <span>
                              {message.readAt ? "✔️✔️" : "✓"}
                            </span>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                  {isUserTyping && (
                    <div className="mr-auto min-w-[20%] max-w-[70%] ">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 mr-1">
                            {selectedUser?.name} is typing
                          </span>

                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  {left !== "" ? <span>{left}</span> : ''}
                  <div ref={messageEndRef} />
                </div>

                <div className="px-4 py-3 border-t bg-white">



                  <div className="flex gap-2">
                    <input value={adminMsg} onChange={(e) => {
                      setAdminMsg(e.target.value)
                      if (selectedUser) {
                        adminSocket.emit('admin:typing', {
                          userId: selectedUser.userId
                        })
                        clearTimeout(typingTimeout.current);
                        typingTimeout.current = setTimeout(() => {
                          adminSocket.emit('admin:stopTyping', { userId: selectedUser.userId })
                        }, 1000)
                      }
                    }} onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMsg()
                      }
                    }} placeholder="Type a reply...." type="text" className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200" />
                    <button onClick={handleSendMsg} className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 flex items-center">
                      <IoSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600 border rounded-lg bg-white">Select a user to start chatting</div>
            )}
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminCustomerSupport