import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../../auth/hooks/useAuth';
import useClass from '../hooks/useClass';

const ChatTab = () => {
  const { activeClass } = useClass();
  const { user } = useAuth();
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); 
  const [input, setInput] = useState('');

  const classCode = activeClass?.classCode;
  const storageKey = useMemo(() => (classCode ? `classx-chat-${classCode}` : null), [classCode]);
  
  // Important: Ensuring we have a valid ID for comparison
  const currentUserId = user?._id || user?.id; 
  const currentUserName = user?.name || 'User';

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    setMessages(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  useEffect(() => {
    if (!classCode) return;
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket'],
    });
    socketRef.current = socket;
    socket.connect();

    socket.on('connect', () => {
      socket.emit('join-class', { classCode, userName: currentUserName, userId: currentUserId });
    });

    socket.on('class-message', (message) => {
      if (!message) return;
      setMessages((prev) => {
        const next = [...prev, message];
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    });

    socket.on('room-users', (roomUsers) => setUsers(roomUsers));

    return () => socket.disconnect();
  }, [classCode, currentUserId, currentUserName, storageKey]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !classCode) return;
    
    const messagePayload = {
      classCode,
      userName: currentUserName,
      senderId: currentUserId, // Yahan unique ID bhej rahe hain
      message: trimmed,
      time: new Date().toISOString()
    };

    socketRef.current?.emit('class-message', messagePayload);
    setInput('');
  };

  const clearChat = () => {
    if (window.confirm("Poori chat history delete karni hai?")) {
      if (storageKey) localStorage.removeItem(storageKey);
      setMessages([]);
    }
  };

  return (
    <div className='flex flex-col h-[80vh] w-full max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden'>
      
      {/* Header */}
      <div className='p-4 bg-primary text-primary-content flex justify-between items-center shadow-md'>
        <div className='flex items-center gap-3'>
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((u, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-neutral text-[10px] flex items-center justify-center font-bold uppercase">
                {u.userName[0]}
              </div>
            ))}
          </div>
          <div>
            <h3 className='font-bold text-sm md:text-base'>Class Group Chat</h3>
            <p className='text-[10px] opacity-80'>{users.length} Online Now</p>
          </div>
        </div>
        <button onClick={clearChat} className='btn btn-ghost btn-xs text-primary-content hover:bg-primary-focus'>Clear</button>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50'>
        {messages.map((msg, i) => {
          // Concept logic: Compare senderId from message with your current user ID
          const isMine = msg.senderId === currentUserId;

          return (
            <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-1`}>
              <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                
                {/* User Name & Time */}
                <div className='flex items-center gap-2 mb-1 px-1'>
                  {!isMine && <span className='text-[10px] font-bold text-gray-600'>{msg.userName}</span>}
                  <span className='text-[9px] text-gray-400'>
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMine && <span className='text-[10px] font-bold text-primary'>You</span>}
                </div>

                {/* Bubble Logic */}
                <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar centered circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm ${isMine ? 'bg-primary' : 'bg-secondary'}`}>
                    {msg.userName[0].toUpperCase()}
                  </div>

                  {/* Message Text */}
                  <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isMine 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className='p-4 bg-white border-t border-base-200'>
        <div className='flex gap-2 bg-gray-100 p-2 rounded-xl border border-gray-200 focus-within:border-primary focus-within:bg-white transition-all'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder='Apna message likhein...'
            className='flex-1 bg-transparent border-none outline-none text-sm px-2'
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className='btn btn-primary btn-sm rounded-lg'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;