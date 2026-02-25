import React, { useState, useEffect } from 'react';
import { Phone, X, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { jobStatusManager } from '../../utils/jobStatusManager';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please enter your name and phone number');
      return;
    }

    const success = jobStatusManager.requestCallback(name, phone);
    if (success) {
      setSubmitted(true);
      toast.success('Request received! We will call you shortly.');
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setName('');
        setPhone('');
      }, 3000);
    }
  };

  return (
    <div 
      className="fixed bottom-24 left-6 z-[100] w-full max-w-sm animate-in slide-in-from-bottom-5 duration-300"
      role="dialog"
      aria-modal="false"
      aria-labelledby="callback-widget-title"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative">
        {submitted ? (
          <div className="p-8 text-center bg-green-50 flex flex-col items-center justify-center min-h-[300px]">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
               <CheckCircle className="w-8 h-8 text-green-600" />
             </div>
             <h3 className="text-xl font-bold text-green-800 mb-2">Request Sent!</h3>
             <p className="text-green-700">Our team has been notified.<br/>Expect a call shortly.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white relative">
              {/* Close X button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
                aria-label="Close widget"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 id="callback-widget-title" className="text-lg font-bold">Request a Callback</h2>
                  <p className="text-blue-100 text-xs">Talk to an expert in minutes</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="callback-name" className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                <input
                  id="callback-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  autoFocus
                />
              </div>
              
              <div>
                <label htmlFor="callback-phone" className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input
                  id="callback-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07700 900..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>Available: Mon-Sun, 8am - 8pm</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Call Me Back</span>
                <Phone className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 hover:underline transition-all"
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}