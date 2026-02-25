import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, Eye, FileText, Mail, Info, Gavel, Globe, Clock, AlertTriangle } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
  const pClass = "text-slate-600 mb-4 leading-relaxed";
  const listClass = "list-disc pl-5 mb-4 text-slate-600 space-y-2";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none mb-1">Privacy Notice</h2>
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
        <div className="overflow-y-auto p-8 flex-1 bg-slate-50/30">
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm font-bold">Effective Date: 27 January 2026</p>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <ShieldCheck className="w-4 h-4" />
                  <p className="text-xs font-medium">Last Updated: 27 January 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                <Globe className="w-3 h-3" />
                UK GDPR Compliant
              </div>
            </div>

            <p className={pClass}>
              ShiftMyHome (“we”, “us”, “our”) respects your privacy. This Privacy Notice explains how we collect, use, store and share personal data when you browse or use the ShiftMyHome website, mobile applications, dashboards and related services (together, the “Platform”).
            </p>
            <p className={pClass}>
              Please read this Notice together with any other privacy notices we may provide on specific occasions (for example, when collecting additional information for identity checks or compliance).
            </p>
            <p className={pClass}>
              This Notice is prepared in accordance with the UK General Data Protection Regulation (“UK GDPR”), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (“PECR”).
            </p>
            <p className="text-sm text-slate-500 italic mb-8">
              Transport Partners and Drivers should also read Annex 1 (Transport Partner & Driver Privacy Details).
            </p>

            <section className={sectionClass}>
              <h3 className={h3Class}>1. Who We Are (Controller) & How to Contact Us</h3>
              <p className={pClass}>ShiftMyHome is operated by ShiftMyHome Ltd, a company registered in Scotland.</p>
              <ul className="list-none pl-0 mb-4 text-slate-600 space-y-1 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                <li><strong>Company number:</strong> [to be added]</li>
                <li><strong>Registered office:</strong> [to be added]</li>
                <li><strong>Support email:</strong> support@shiftmyhome.co.uk</li>
                <li><strong>Privacy email:</strong> privacy@shiftmyhome.co.uk</li>
              </ul>
              <p className={pClass}>For data protection purposes, ShiftMyHome Ltd is the “data controller” for personal data processed through the Platform. This means we decide how and why your personal data is processed.</p>
              <p className={pClass}>If you have questions or want to exercise your data protection rights, contact: <strong>privacy@shiftmyhome.co.uk</strong></p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>2. What Personal Data We Collect</h3>
              <p className={pClass}>“Personal data” means information relating to an identified or identifiable person. We may collect:</p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">A) Identity & Contact Data</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>full name</li>
                    <li>email address</li>
                    <li>telephone number</li>
                    <li>billing address (where required)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">B) Account & Profile Data</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>login details (hashed/secured)</li>
                    <li>account status</li>
                    <li>preferences and settings</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">C) Booking & Service Data</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>pickup and delivery addresses</li>
                    <li>job details (items, floors, access notes, photos uploaded, special instructions)</li>
                    <li>booking history, timestamps</li>
                    <li>messages exchanged via the Platform</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">D) Payment & Transaction Data</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 mb-2">
                    <li>payment status, payment references, receipts</li>
                    <li>refunds and chargeback records (if applicable)</li>
                  </ul>
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-tight">
                      <strong>We do not store full card details.</strong> Card payments are handled by regulated payment providers.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">E) Technical & Usage Data</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>IP address</li>
                    <li>device and browser information</li>
                    <li>log files, cookies, analytics events</li>
                    <li>approximate location (based on IP, where enabled)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-tight">F) Partner / Driver Data (where applicable)</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>business name, contact details</li>
                    <li>vehicle details</li>
                    <li>insurance documents</li>
                    <li>compliance details (e.g., waste-related compliance where relevant)</li>
                    <li>performance and service-related records (ratings, job completion history)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Special category data</h4>
                <p className="text-xs text-slate-600">
                  We do not intentionally collect special category data (health, religion, etc.). If you choose to share such data in messages or notes, you do so at your own discretion.
                </p>
              </div>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>3. How We Collect Your Data</h3>
              <p className={pClass}>We collect personal data through:</p>
              <ul className={listClass}>
                <li><strong>Direct interactions:</strong> you create an account, request a quote, make a booking, message support, upload photos, leave a review.</li>
                <li><strong>Automated technologies:</strong> cookies, logs, device identifiers and analytics.</li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>4. Lawful Bases for Processing (UK GDPR)</h3>
              <p className={pClass}>We process personal data on one or more of the following legal bases:</p>
              <ul className={listClass}>
                <li><strong>Performance of a contract</strong> – to provide the services you request;</li>
                <li><strong>Legal obligation</strong> – to comply with regulatory, tax and accounting duties;</li>
                <li><strong>Legitimate interests</strong> – to operate, secure and improve the Platform;</li>
                <li><strong>Consent</strong> – where required, for marketing or optional features.</li>
              </ul>
              <p className="text-sm text-slate-500 italic">Where processing is based on consent, you may withdraw your consent at any time.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>5. Payments & Financial Information</h3>
              <p className={pClass}>All card payments are processed by approved third-party payment providers.</p>
              <p className={pClass}><strong>ShiftMyHome:</strong> does not store full card details; does not store CVV codes; may store secure payment tokens where necessary for future charges. Payment providers act as independent data controllers for payment processing.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>6. Sharing of Personal Data</h3>
              <p className={pClass}>We may share personal data only where necessary, including with:</p>
              <ul className={listClass}>
                <li>Customers and Transport Partners (to perform bookings);</li>
                <li>payment service providers;</li>
                <li>IT, hosting and cloud service providers;</li>
                <li>customer support providers;</li>
                <li>professional advisers (legal, accounting, compliance);</li>
                <li>public authorities and regulators where required by law.</li>
              </ul>
              <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2 font-bold text-sm">
                <X className="w-4 h-4" />
                We do not sell personal data to third parties.
              </div>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>7. International Data Transfers</h3>
              <p className={pClass}>Where personal data is transferred outside the United Kingdom, appropriate safeguards will be applied and transfers will be made in accordance with UK GDPR, including UK adequacy regulations or approved contractual safeguards.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>8. Data Security</h3>
              <p className={pClass}>We implement appropriate technical and organisational measures to protect personal data, including encryption, access controls, secure servers and regular security monitoring. However, no system is completely secure, and we cannot guarantee absolute security.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>9. Data Retention</h3>
              <p className={pClass}>We retain personal data only for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Account Data</p>
                  <p className="text-sm font-bold text-slate-700">Up to 6 Years</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Booking/Tax</p>
                  <p className="text-sm font-bold text-slate-700">Up to 7 Years</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Communications</p>
                  <p className="text-sm font-bold text-slate-700">Up to 3 Years</p>
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>10. Your Rights (UK GDPR)</h3>
              <p className={pClass}>You have the right to: access your data; request correction; request erasure (where applicable); restrict or object to processing; request data portability; withdraw consent; and lodge a complaint with the ICO.</p>
              <p className={pClass}>Exercise your rights via: <strong className="text-blue-600">privacy@shiftmyhome.co.uk</strong></p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>11. Identity Verification</h3>
              <p className={pClass}>For security reasons, we may request additional information to verify your identity before responding to certain requests. This helps protect personal data from unauthorised access.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>12. Cookies & Tracking Technologies</h3>
              <p className={pClass}>We use cookies and similar technologies to operate the Platform, remember preferences, and analyse performance. You can control cookies through your browser settings or cookie consent tools on the Platform.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>13. Live Tracking & Location Data</h3>
              <p className={pClass}>Location and tracking data may be processed to coordinate bookings, provide live tracking, and improve service performance. Tracking data may be estimated or delayed and is used for operational purposes only.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>14. Automated Decision-Making</h3>
              <p className={pClass}>ShiftMyHome does not use automated decision-making or profiling that produces legal or similarly significant effects on users.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>15. Reviews & Public Content</h3>
              <p className={pClass}>Reviews, ratings and feedback submitted on the Platform may be publicly visible. Do not include sensitive personal data in public reviews.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>16. Marketing Communications</h3>
              <p className={pClass}>We may send service-related communications as part of our contractual relationship. Marketing communications will only be sent where you have given consent or where permitted by law. You may opt out at any time.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>17. Children’s Data</h3>
              <p className={pClass}>The Platform is not intended for users under 18 years old. We do not knowingly collect personal data from children.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>18. Data Breaches</h3>
              <p className={pClass}>In the event of a personal data breach, we will assess the risk, notify the ICO where required by law, and inform affected users where legally required.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>19. Third-Party Links</h3>
              <p className={pClass}>The Platform may contain links to third-party websites or services. We are not responsible for their privacy practices.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>20. Complaints</h3>
              <p className={pClass}>If you have concerns about how we process your data, please contact us first: <strong>privacy@shiftmyhome.co.uk</strong>. You also have the right to complain to the Information Commissioner’s Office (ICO).</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>21. Governing Law</h3>
              <p className={pClass}>This Privacy Policy is governed by the laws of Scotland.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>22. Changes to This Privacy Policy</h3>
              <p className={pClass}>We may update this Privacy Policy from time to time. Continued use of the Platform constitutes acceptance of the updated Privacy Policy.</p>
            </section>

            <section className={sectionClass}>
              <h3 className={h3Class}>23. Contact</h3>
              <p className={pClass}>For any privacy-related questions or requests:</p>
              <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="font-bold tracking-tight">privacy@shiftmyhome.co.uk</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <X className="w-4 h-4 rotate-45" />
                </div>
              </div>
            </section>
            
            <p className="text-xs text-slate-400 text-center italic mt-12 mb-4">
              ShiftMyHome is dedicated to protecting your information. We regularly review our policies to ensure the highest standards of data security in Scotland and across the UK.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-black transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ShieldCheck className="w-5 h-5" />
            I Understand My Privacy Rights
          </button>
        </div>
      </div>
    </div>
  );
}
