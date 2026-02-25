import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
          <h2 className="text-xl font-bold text-slate-900">ShiftMyHome – Terms & Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="prose prose-slate max-w-none">
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600 mb-1"><strong>Effective Date:</strong> 27 January 2026</p>
              <p className="text-sm text-slate-600"><strong>Last Updated:</strong> 27 January 2026</p>
            </div>

            <p className="text-slate-700 mb-6">
              These Terms & Conditions ("Terms") govern the use of the ShiftMyHome website, mobile applications, dashboards and related services (together, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">1. About ShiftMyHome</h3>
            <p className="text-slate-600 mb-2">ShiftMyHome is operated by ShiftMyHome Ltd, a company registered in Scotland.</p>
            <ul className="list-none pl-0 mb-4 text-slate-600 space-y-1">
              <li><strong>Company number:</strong> [to be added]</li>
              <li><strong>Registered office:</strong> [to be added]</li>
              <li><strong>Support email:</strong> support@shiftmyhome.co.uk</li>
              <li><strong>Privacy email:</strong> privacy@shiftmyhome.co.uk</li>
            </ul>
            <p className="text-slate-600 mb-4 italic">In these Terms, "ShiftMyHome", "we", "us", and "our" refer to the Platform operator.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2">
              2. Nature of the Platform – Marketplace Role <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-black">Key Clause</span>
            </h3>
            <p className="text-slate-600 mb-4">
              ShiftMyHome operates a digital marketplace that connects Customers with independent transport and removals businesses (Transport Partners).
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
              <p className="text-sm text-blue-800 font-semibold mb-2">ShiftMyHome:</p>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>does not provide transport or removal services;</li>
                <li>does not employ drivers;</li>
                <li>does not own vehicles;</li>
                <li>does not take possession of goods.</li>
              </ul>
            </div>
            <p className="text-slate-600 mb-4 font-medium">All services are provided exclusively by independent Transport Partners. Any service contract is formed directly between the Customer and the Transport Partner. ShiftMyHome acts solely as an intermediary technology provider.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">3. Services Covered by These Terms</h3>
            <p className="text-slate-600 mb-4">These Terms apply to all services available on the Platform, including:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {[
                'House Move',
                'Furniture & Items',
                'Clearance & Removal (Builder Waste & Junk Removal)',
                'Motorbike & Bicycle Transport',
                'Store / Pickup Service',
                'Other Delivery'
              ].map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {service}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">Unless stated otherwise, the same rules apply to all service types.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">4. Definitions</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li><strong>Customer</strong> – a private individual or business booking a job</li>
              <li><strong>Transport Partner</strong> – an independent business providing services via the Platform</li>
              <li><strong>Driver</strong> – an individual operating under a Transport Partner</li>
              <li><strong>Job</strong> – a booking for transport or removals</li>
              <li><strong>Accepted Job</strong> – a job confirmed by a Transport Partner</li>
              <li><strong>Price</strong> – the total price displayed for a job</li>
              <li><strong>Extra Charges</strong> – additional charges arising from additional work or conditions</li>
              <li><strong>Platform</strong> – the ShiftMyHome website, apps and systems</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">5. Eligibility & Accounts</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li>5.1 Users must be at least 18 years old.</li>
              <li>5.2 Users must provide accurate, complete and up-to-date information.</li>
              <li>5.3 Users are responsible for all activity on their accounts.</li>
              <li>5.4 ShiftMyHome may suspend or terminate accounts for misuse, fraud or breach of these Terms.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">6. Payments, No Deposit & Book Now – Pay Later</h3>
            <h4 className="font-bold text-slate-800 mb-2">6.1 Card Payments Only</h4>
            <p className="text-slate-600 mb-4">All payments are processed by card via approved third-party payment providers. Cash payments are not supported.</p>

            <h4 className="font-bold text-slate-800 mb-2">6.2 No Deposit Model</h4>
            <p className="text-slate-600 mb-4">ShiftMyHome currently operates a no deposit and no booking fee model. No deposits or platform fees are required at the time of booking unless expressly stated at the time of the booking. ShiftMyHome reserves the right to introduce deposits, booking fees or other charges in the future, subject to prior notice and an update of these Terms.</p>

            <h4 className="font-bold text-slate-800 mb-2">6.3 Commission</h4>
            <p className="text-slate-600 mb-4">ShiftMyHome may receive a commission or service fee from Transport Partners for the use of the Platform. This does not affect the Price payable by the Customer.</p>

            <h4 className="font-bold text-slate-800 mb-2">6.4 Payment Timing – Book Now, Pay Later (72 Hour Rule)</h4>
            <p className="text-slate-600 mb-2">ShiftMyHome operates a “Book Now, Pay Later” model for certain bookings.</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2 font-medium">
              <li>If a booking is scheduled more than 72 hours in advance, payment will be automatically charged 72 hours before the scheduled service start time.</li>
              <li>If a booking is scheduled within 72 hours, full payment will be charged immediately at the time of booking.</li>
            </ul>
            <p className="text-slate-600 mb-2">By confirming a booking, the Customer expressly authorises ShiftMyHome to:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>securely store payment details; and</li>
              <li>automatically charge the full booking amount in accordance with this rule.</li>
            </ul>
            <p className="text-slate-600 mb-4 italic">Failure of payment authorisation may result in automatic cancellation of the booking.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">7. Booking Process & Acceptance</h3>
            <p className="text-slate-600 mb-4">7.1 A booking becomes active when: job details are submitted accurately; a Transport Partner accepts the job; and payment authorisation is completed.</p>
            <p className="text-slate-600 mb-4">7.2 Acceptance is conditional upon job details being accurate. Material discrepancies may result in price adjustment or refusal to proceed.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <p className="text-slate-700 font-bold mb-2">7.3 Availability of Transport Partners</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-2">
                ShiftMyHome does not guarantee that a Transport Partner will be available for every booking request.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-2">
                If no Transport Partner accepts a booking, the booking may be cancelled without any liability to ShiftMyHome for loss, costs or damages incurred by the Customer.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Where payment has been taken, any unused amount will be refunded in accordance with Section 13 (Cancellations, Refunds & Platform Availability).
              </p>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2">
              8. Customer Information & Accuracy <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase font-black">Important</span>
            </h3>
            <p className="text-slate-600 mb-2">The Customer must declare accurately:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>number of items; size and weight;</li>
              <li>floors and stairs; carry distances;</li>
              <li>access, lifts and parking.</li>
            </ul>
            <p className="text-slate-600 mb-2">Incorrect or incomplete information may result in:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600 font-semibold text-red-600">
              <li>Extra Charges;</li>
              <li>refusal to perform the service;</li>
              <li>cancellation without refund.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">9. Extra Charges</h3>
            <p className="text-slate-600 mb-4">Extra Charges may apply where additional work, time or risk is required beyond the original booking. Common Extra Charges include: additional or undisclosed stairs; long carry distances; waiting time beyond free allowance; parking permits, fines or restricted access; assembly or disassembly; additional or incorrectly declared items; heavy, oversized or specialist items.</p>
            <p className="text-slate-600 mb-4 italic text-sm">Transport Partners must explain the reason and apply charges fairly and proportionately.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">10. Time Windows & Waiting Time</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li>10.1 Each booking includes 15 minutes of free waiting time at pickup and delivery unless stated otherwise.</li>
              <li>10.2 Waiting beyond this allowance may be charged at £12 per additional 15 minutes (£48/hour).</li>
              <li>10.3 Waiting time may arise due to: lack of access; incomplete packing; missing keys or contacts; lift unavailability; Customer delay.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">11. Live Tracking</h3>
            <p className="text-slate-600 mb-4">Live tracking and fleet visibility are provided for informational and coordination purposes only. Tracking data may be delayed, estimated or unavailable. Tracking does not guarantee arrival times and does not create contractual time obligations.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">12. Third-Party Services</h3>
            <p className="text-slate-600 mb-4">
              The Platform may rely on third-party services and providers. ShiftMyHome is not responsible for the availability, performance or errors of third-party systems, including payment processors (e.g., Stripe), mapping services (e.g., Mapbox) or communication providers.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">13. Cancellations, Refunds & Platform Availability</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li>13.1 Cancellation terms depend on timing, whether the Transport Partner has already started travel, and costs already incurred.</li>
              <li>13.2 For “Book Now, Pay Later” bookings, failure of payment may result in automatic cancellation.</li>
              <li>13.3 ShiftMyHome does not guarantee the availability of alternative Transport Partners.</li>
              <li>13.4 Rescheduling may result in price changes depending on availability and demand.</li>
              <li>13.5 <strong>Platform Availability:</strong> ShiftMyHome does not guarantee that the Platform will be available at all times. Access to the Platform may be suspended temporarily for maintenance, updates, security or technical reasons. ShiftMyHome shall not be liable for any loss, delay or damage arising from Platform unavailability, errors or technical failures.</li>
              <li>13.6 <strong>Force Majeure:</strong> ShiftMyHome shall not be liable for any failure or delay in performance resulting from events beyond its reasonable control, including but not limited to severe weather, accidents, strikes, government restrictions, or technical failures.</li>
              <li>13.7 <strong>Refunds – No Transport Partner Available:</strong> If no Transport Partner accepts a booking and no service is provided, any payment taken will be fully refunded.</li>
              <li>13.8 <strong>Customer Cancellation Before Acceptance:</strong> If the Customer cancels before any Transport Partner has accepted the booking, any payment taken will be fully refunded.</li>
              <li>13.9 <strong>Customer Cancellation After Acceptance:</strong> If the Customer cancels after a Transport Partner has accepted the booking, part or all of the Price may be non-refundable and may be paid to the Transport Partner as compensation.</li>
              <li>13.10 <strong>No-Show & Not Ready:</strong> If the Customer fails to attend, is unreachable, or is not ready within the free waiting time, the booking may be treated as a no-show and no refund may be issued.</li>
              <li>13.11 <strong>Partial Services:</strong> If a service is partially completed, payment is due for the portion performed and any refund applies only to the unused portion.</li>
              <li>13.12 <strong>Refund Method:</strong> All refunds are processed to the original payment method only. No cash refunds are provided.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">14. Disclaimer of Information</h3>
            <p className="text-slate-600 mb-4">Information provided on the Platform is for general information purposes only. ShiftMyHome does not guarantee the accuracy, completeness or reliability of any content and shall not be responsible for decisions taken based on such information. </p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">15. Damage, Loss & Claims</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li>15.1 Transport Partners are solely responsible for: service performance; insurance; legal compliance.</li>
              <li>15.2 All claims for damage, loss or theft must be raised directly with the Transport Partner.</li>
              <li>15.3 ShiftMyHome may facilitate communication but does not guarantee compensation.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">16. Clearance & Removal (Builder Waste & Junk Removal)</h3>
            <h4 className="font-bold text-slate-800 mb-2">16.1 Scope of Service</h4>
            <p className="text-slate-600 mb-4">Includes: house clearance; garden clearance; builder waste removal; general junk removal; item disposal. Waste is transported to authorised recycling or disposal facilities.</p>

            <h4 className="font-bold text-slate-800 mb-2">16.2 Prohibited Waste</h4>
            <p className="text-slate-600 mb-2 font-semibold">The following must not be included:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <li>asbestos</li>
              <li>toxic or chemical substances</li>
              <li>industrial paints or solvents</li>
              <li>medical waste</li>
              <li>explosives or weapons</li>
              <li>radioactive materials</li>
            </ul>
            <p className="text-sm text-red-600 font-bold mb-4">Transport Partners may refuse immediately if prohibited waste is identified.</p>

            <h4 className="font-bold text-slate-800 mb-2">16.3 Legal Responsibility</h4>
            <p className="text-slate-600 mb-4">The Customer guarantees that they are the lawful owner of the waste and it can be legally disposed of. The Customer is fully responsible for fines, penalties and environmental breaches. ShiftMyHome accepts no liability for environmental compliance.</p>

            <h4 className="font-bold text-slate-800 mb-2">16.4 Builder Waste</h4>
            <p className="text-slate-600 mb-4">Heavy materials (brick, concrete, rubble, soil) must be declared accurately, may require special vehicles, and may generate Extra Charges if overweight.</p>

            <h4 className="font-bold text-slate-800 mb-2">16.5 General Junk Removal</h4>
            <p className="text-slate-600 mb-4">Transport Partners are not responsible for: money; documents; jewellery; items left accidentally.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">17. Prohibited Items & Safety</h3>
            <p className="text-slate-600 mb-4">The Platform may not be used to transport: illegal or stolen goods; weapons, explosives or controlled substances; hazardous materials without lawful disclosure.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">18. Reviews & Feedback</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li>18.1 Reviews must be honest and relevant.</li>
              <li>18.2 Fake, abusive or misleading reviews may be removed.</li>
              <li>18.3 Reviews do not constitute guarantees of service quality.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">19. Intellectual Property</h3>
            <p className="text-slate-600 mb-4">All Platform software, branding and content belong to ShiftMyHome or its licensors. Unauthorised use is prohibited.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2">
              20. Limitation of Liability <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-black">Key Protection</span>
            </h3>
            <p className="text-slate-600 mb-2 font-bold uppercase text-sm">Nothing limits liability for:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600 text-sm italic">
              <li>death or personal injury caused by negligence;</li>
              <li>fraud;</li>
              <li>liabilities that cannot be excluded by law.</li>
            </ul>
            <p className="text-slate-600 mb-2">Subject to this:</p>
            <ul className="list-disc pl-5 mb-4 text-slate-600">
              <li>ShiftMyHome is not liable for acts or omissions of Transport Partners or Drivers;</li>
              <li>ShiftMyHome is not liable for loss or damage to goods during transport;</li>
              <li>Total liability of ShiftMyHome is limited to the Platform fees paid or £100, whichever is lower.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">21. Indemnity</h3>
            <p className="text-slate-600 mb-4">Users agree to indemnify ShiftMyHome against losses arising from: misuse of the Platform; breach of these Terms; illegal use of services.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4 font-black">22. Chargeback Policy (Anti-Abuse)</h3>
            <ul className="list-disc pl-5 mb-4 text-slate-600 space-y-2">
              <li>22.1 Customers must contact ShiftMyHome before initiating any chargeback.</li>
              <li>22.2 Unauthorised or abusive chargebacks may result in: account suspension or termination; restriction of future bookings; recovery of administrative costs where permitted by law.</li>
              <li>22.3 ShiftMyHome may submit evidence including: booking logs; chat records; tracking data; timestamps and photos.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4 font-black">23. Suspension & Termination</h3>
            <p className="text-slate-600 mb-4">ShiftMyHome may suspend or terminate access where these Terms are breached, fraud or abuse is suspected, or platform integrity is at risk.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">24. Privacy & Data Protection</h3>
            <p className="text-slate-600 mb-4">Personal data is processed in accordance with the ShiftMyHome Privacy Policy and applicable UK GDPR legislation.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">25. Governing Law & Jurisdiction (SCOTLAND)</h3>
            <p className="text-slate-600 mb-4 font-bold">These Terms are governed by the laws of Scotland. The courts of Scotland shall have exclusive jurisdiction over any dispute or claim arising out of or in connection with these Terms or the use of the Platform.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">26. Severability</h3>
            <p className="text-slate-600 mb-4">If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">27. Changes to These Terms</h3>
            <p className="text-slate-600 mb-4">We may update these Terms from time to time. Continued use of the Platform constitutes acceptance of the updated Terms.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">28. Assignment & Transfer</h3>
            <p className="text-slate-600 mb-4">ShiftMyHome may assign or transfer its rights and obligations under these Terms to another entity in connection with a merger, acquisition or sale of assets. Users may not assign or transfer their rights without prior written consent.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">29. Entire Agreement</h3>
            <p className="text-slate-600 mb-4">These Terms constitute the entire agreement between the parties regarding the use of the Platform and supersede all prior agreements, communications and understandings.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">30. Waiver</h3>
            <p className="text-slate-600 mb-4">Failure by ShiftMyHome to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">31. Contact</h3>
            <p className="text-slate-600 mb-2">For questions or concerns:</p>
            <p className="text-blue-600 font-bold mb-8">
              <a href="mailto:support@shiftmyhome.co.uk">support@shiftmyhome.co.uk</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            I Agree & Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
}
