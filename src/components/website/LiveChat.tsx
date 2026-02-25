import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User, Clock, Phone } from 'lucide-react';

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot' as const,
      text: 'Hello! 👋 Welcome to ShiftMyHome. How can we help you today?',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Handle ESC key press and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      text: message,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Auto-reply simulation
    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        type: 'bot' as const,
        text: 'Thanks for your message! A team member will respond shortly. For immediate assistance, please call us at 0800 123 4567.',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  // Handle click on overlay (outside modal)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Chat Widget - Floating in corner (NOT blocking modal) */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-[100] w-full max-w-sm animate-in slide-in-from-bottom-5 duration-300"
          role="dialog"
          aria-modal="false"
          aria-labelledby="livechat-widget-title"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[80vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white relative flex-shrink-0">
              {/* Close X button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 id="livechat-widget-title" className="text-lg font-bold">Live Chat</h2>
                  <p className="text-blue-100 text-xs">We typically reply in minutes</p>
                </div>
              </div>
            </div>

            {/* Messages - Scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2.5 rounded-xl ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 px-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-slate-200 bg-white flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full font-medium transition-all whitespace-nowrap">
                  Get a quote
                </button>
                <button className="px-3 py-1.5 text-xs bg-cyan-50 text-cyan-700 hover:bg-cyan-100 rounded-full font-medium transition-all whitespace-nowrap">
                  Services info
                </button>
              </div>
            </div>

            {/* Input Area - FIXED at bottom */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-3 flex-shrink-0">
              <div className="flex gap-2 items-stretch">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3.5 min-h-[52px] bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-base leading-relaxed"
                  aria-label="Chat message"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3.5 rounded-xl transition-all shadow-lg flex-shrink-0 min-h-[52px] min-w-[52px] flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 hover:underline transition-all"
              >
                Close chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button - Floating */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 transition-all duration-300 z-[99] group flex items-center gap-3 font-bold animate-pulse hover:animate-none"
        title="Live Chat"
        data-chat-button
      >
        {isOpen ? (
          <>
            <X className="w-6 h-6" />
            <span className="text-base font-bold tracking-wide hidden sm:inline">CLOSE CHAT</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-6 h-6 animate-bounce group-hover:animate-none" />
            <span className="text-base font-bold tracking-wide hidden sm:inline">LIVE CHAT</span>
            {/* Notification Badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold border-3 border-white shadow-lg animate-bounce">
              1
            </div>
          </>
        )}
      </button>
    </>
  );
}