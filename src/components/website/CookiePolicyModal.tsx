import React, { useEffect } from 'react';
import { X, Cookie, Shield, Info, Settings, Clock, BarChart, Target } from 'lucide-react';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookiePolicyModal({ isOpen, onClose }: CookiePolicyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sectionClass = "mb-8";
  const h3Class = "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2";
  const pClass = "text-slate-600 mb-4 leading-relaxed text-sm";
  const listClass = "list-disc pl-5 mb-4 text-slate-600 space-y-2 text-sm";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none mb-1">Cookie Policy</h2>
              <p className="text-xs text-slate-500 font-medium">ShiftMyHome Ltd • Scotland</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8 flex-1">
          <div className="prose prose-slate max-w-none">
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <p className="text-sm font-bold">Last Updated: 27 January 2026</p>
              </div>
              <Shield className="w-6 h-6 text-slate-300" />
            </div>

            <section className={sectionClass}>
              <h3 className={h3Class}>1. Introduction</h3>
              <p className={pClass}>
                This Cookie Policy explains how ShiftMyHome Ltd uses cookies and similar technologies to recognise you when you visit our Platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>2. What are Cookies?</h3>
              <p className={pClass}>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>3. Why do we use Cookies?</h3>
              <p className={pClass}>We use first-party and third-party cookies for several reasons:</p>
              
              <div className="grid gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Essential Cookies</h4>
                  </div>
                  <p className="text-xs text-slate-600">Strictly necessary to provide you with services available through our Platform and to use some of its features, such as access to secure areas.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="w-4 h-4 text-green-600" />
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Analytics & Performance</h4>
                  </div>
                  <p className="text-xs text-slate-600">Collect information that is used either in aggregate form to help us understand how our Platform is being used or how effective our marketing campaigns are.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Functionality Cookies</h4>
                  </div>
                  <p className="text-xs text-slate-600">Used to enhance the performance and functionality of our Platform but are non-essential to their use.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-red-600" />
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Targeting Cookies</h4>
                  </div>
                  <p className="text-xs text-slate-600">Used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing.</p>
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>4. How can I control Cookies?</h3>
              <p className={pClass}>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager found on our Platform.
              </p>
              <p className={pClass}>
                You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
              </p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>5. Updates to this Policy</h3>
              <p className={pClass}>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>6. Contact Us</h3>
              <p className={pClass}>If you have any questions about our use of cookies or other technologies, please email us at:</p>
              <div className="p-4 bg-slate-900 rounded-xl text-white text-center font-bold">
                privacy@shiftmyhome.co.uk
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl hover:bg-slate-300 transition-all font-bold text-sm"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-all font-bold text-sm shadow-lg shadow-amber-600/20"
          >
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
