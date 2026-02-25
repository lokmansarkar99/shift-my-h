import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Camera, FileText, CheckCircle, AlertTriangle, User, Phone, Mail, Truck, PoundSterling, CreditCard, RotateCcw, AlertCircle, History, Shield, Lock, Edit2, Save, Trash2, ShoppingCart, Bike, FileDown, Package, Timer } from 'lucide-react';
import { Job } from '../../utils/jobStatusManager';
import { auditLogger, AuditLogEntry } from '../../utils/auditLogger';
import { authManager } from '../../utils/authManager';

interface RefundModalProps {
  job: Job;
  onClose: () => void;
  onConfirm: (data: RefundData) => void;
}

interface RefundData {
  type: 'full' | 'partial';
  amount: number;
  reason: string;
  notes?: string;
}

function RefundModal({ job, onClose, onConfirm }: RefundModalProps) {
  const [type, setType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState<number>(job.customerPrice || 0);
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleConfirm = () => {
    if (!reason) return alert('Please select a reason');
    if (type === 'partial' && (amount <= 0 || amount > (job.customerPrice || 0))) {
        return alert('Invalid refund amount');
    }
    
    onConfirm({
      type,
      amount: type === 'full' ? (job.customerPrice || 0) : amount,
      reason: reason === 'Other' ? otherReason : reason,
      notes: otherReason
    });
  };

  // Logic checks based on job status
  const isJobCompleted = job.status === 'completed';
  const isJobInProgress = job.status === 'in-progress' || job.status === 'picked-up';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 bg-red-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-700">
            <RotateCcw className="w-5 h-5" />
            <h3 className="font-bold text-lg">Process Refund</h3>
          </div>
          <button onClick={onClose}><X className="w-6 h-6 text-red-400 hover:text-red-600" /></button>
        </div>
        
        <div className="p-6 space-y-6">
           {/* Warning Banner based on Job Status */}
           <div className={`p-3 rounded-lg border flex gap-3 text-sm ${
               !isJobCompleted && !isJobInProgress ? 'bg-green-50 border-green-200 text-green-800' :
               isJobCompleted ? 'bg-orange-50 border-orange-200 text-orange-800' :
               'bg-blue-50 border-blue-200 text-blue-800'
           }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                 <strong>Status: {job.status.toUpperCase()}</strong>
                 <p className="mt-1">
                   { !isJobCompleted && !isJobInProgress ? 'Job not started. Driver payout will be reset to £0.' :
                     isJobCompleted ? 'Job completed. Refund requires dispute/damage verification.' :
                     'Job in progress. Driver payout requires manual recalculation.'
                   }
                 </p>
              </div>
           </div>

           {/* Refund Type */}
           <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Refund Type</label>
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => { setType('full'); setAmount(job.customerPrice || 0); }}
                   className={`p-3 rounded-xl border text-sm font-medium transition-all ${type === 'full' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                    Full Refund
                 </button>
                 <button 
                   onClick={() => setType('partial')}
                   className={`p-3 rounded-xl border text-sm font-medium transition-all ${type === 'partial' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                    Partial Refund
                 </button>
              </div>
           </div>

           {/* Amount Input (Only for Partial) */}
           {type === 'partial' && (
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Refund Amount (£)</label>
                <div className="relative">
                   <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(Number(e.target.value))}
                     className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
                   />
                </div>
                <p className="text-xs text-slate-500">Max refundable: £{job.customerPrice}</p>
             </div>
           )}

           {/* Reason */}
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Reason (Mandatory)</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none bg-white"
              >
                 <option value="">Select a reason...</option>
                 <option value="Cancelled Job">Cancelled Job</option>
                 <option value="Driver No-show">Driver No-show</option>
                 <option value="Delay">Delay</option>
                 <option value="Damage">Damage</option>
                 <option value="Pricing Error">Pricing Error</option>
                 <option value="Other">Other</option>
              </select>
           </div>

           {/* Other Reason Text */}
           {reason === 'Other' && (
              <textarea 
                placeholder="Please specify details..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg h-20 text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none"
              />
           )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
           <button 
             onClick={handleConfirm}
             className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-sm transition-colors flex items-center gap-2"
           >
              <RotateCcw className="w-4 h-4" />
              Confirm Refund
           </button>
        </div>
      </div>
    </div>
  );
}


interface AdminJobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

export function AdminJobDetailsModal({ job, onClose }: AdminJobDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'financial' | 'audit'>('details');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundInfo, setRefundInfo] = useState<{amount: number, date: string, reason: string} | null>(null);
  
  // Fetch logs for this job
  const [jobLogs, setJobLogs] = useState<AuditLogEntry[]>([]);
  const currentUser = authManager.getUser();

  // Permissions
  const canProcessRefund = authManager.hasPermission('PROCESS_REFUND');
  const canApprovePayout = authManager.hasPermission('APPROVE_PAYOUT');

  useEffect(() => {
    if (activeTab === 'audit') {
      setJobLogs(auditLogger.getLogs(job.id));
    }
  }, [activeTab, job.id]);

  const handleRefundConfirm = (data: RefundData) => {
      console.log("Processing Refund:", data);
      
      // LOG TO AUDIT SYSTEM
      auditLogger.log({
          user: currentUser.name,
          role: currentUser.role,
          action: `Refund Processed (${data.type})`,
          details: `Amount: £${data.amount}, Reason: ${data.reason}. Notes: ${data.notes || 'N/A'}`,
          jobId: job.id,
          type: 'refund'
      });
      
      // Update local logs if we are on that tab (or force refresh next time)
      if (activeTab === 'audit') {
          setJobLogs(auditLogger.getLogs(job.id));
      }

      setRefundInfo({
          amount: data.amount,
          date: new Date().toLocaleString(),
          reason: data.reason
      });

      setShowRefundModal(false);
  };

  if (!job) return null;

  const collectionPhotos = job.photos?.filter(p => p.type === 'pickup') || [];
  const dropoffPhotos = job.photos?.filter(p => p.type === 'dropoff') || [];

  // MOCK FINANCIAL DATA STATE (Simulating backend)
  const [financialData, setFinancialData] = useState({
      basePay: job.driverPrice || 0,
      extras: 0,
      deductions: 0,
      status: 'pending' as 'pending' | 'approved' | 'paid'
  });

  // PRICE EDITING STATE
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState(job.customerPrice || 0);
  const [priceEditReason, setPriceEditReason] = useState('');

  const netPay = financialData.basePay + financialData.extras - financialData.deductions;

  const handleSavePrice = () => {
    if (!priceEditReason.trim()) {
      alert('Please provide a reason for the price change');
      return;
    }

    if (editedPrice <= 0) {
      alert('Invalid price amount');
      return;
    }

    // Update the job price (in real app, this would call an API)
    job.customerPrice = editedPrice;

    // Log to audit system
    auditLogger.log({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Modified Customer Price',
      details: `Changed from £${job.customerPrice?.toFixed(2)} to £${editedPrice.toFixed(2)}. Reason: ${priceEditReason}`,
      jobId: job.id,
      type: 'update'
    });

    // Reset state
    setIsEditingPrice(false);
    setPriceEditReason('');
    
    alert(`Price updated to £${editedPrice.toFixed(2)}`);
  };

  const handleCancelPriceEdit = () => {
    setEditedPrice(job.customerPrice || 0);
    setPriceEditReason('');
    setIsEditingPrice(false);
  };

  // Service Type Metadata Helpers
  const isStorePickup = job.service?.toLowerCase().includes('store') || job.serviceType?.toLowerCase() === 'store-pickup';
  const isMotorbike = job.service?.toLowerCase().includes('motorbike') || job.serviceType?.toLowerCase() === 'motorbike-bicycle';
  const isClearance = job.service?.toLowerCase().includes('clearance') || job.serviceType?.toLowerCase() === 'clearance';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                isStorePickup ? 'bg-emerald-500/20 text-emerald-400' :
                isMotorbike ? 'bg-orange-500/20 text-orange-400' :
                isClearance ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {isStorePickup ? <ShoppingCart className="w-6 h-6" /> :
                 isMotorbike ? <Bike className="w-6 h-6" /> :
                 isClearance ? <Trash2 className="w-6 h-6" /> :
                 <Truck className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  Job #{job.reference || job.id}
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    job.status === 'completed' ? 'bg-green-500 text-white' :
                    job.status === 'in-progress' ? 'bg-blue-500 text-white' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {job.status}
                  </span>
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                  {job.service} • {job.date} • {job.time}
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all hover:rotate-90">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-100 px-8 flex gap-8">
            {['details', 'financial', 'audit'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-5 font-black text-xs uppercase tracking-widest border-b-4 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
              >
                {tab === 'audit' && <History className="w-4 h-4 inline-block mr-2 -mt-1" />}
                {tab.replace('-', ' ')}
              </button>
            ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          
          {activeTab === 'audit' ? (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-0">
                  {jobLogs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {jobLogs.map((log) => (
                        <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors flex gap-6">
                           <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold shadow-sm ${
                                  log.type === 'refund' ? 'bg-red-100 text-red-700' :
                                  log.type === 'approve' ? 'bg-green-100 text-green-700' :
                                  log.type === 'create' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-600'
                              }`}>
                                  {log.user.charAt(0)}
                              </div>
                              <div className="w-px h-full bg-slate-100 mt-2"></div>
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <p className="font-bold text-slate-900 text-lg">{log.action}</p>
                                    <p className="text-sm text-slate-500 mt-1">{log.details || 'No details'}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xs text-slate-400 font-mono font-bold uppercase">{auditLogger.formatDate(log.timestamp)}</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg mt-2 inline-block">
                                      {log.role}
                                    </span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3 text-slate-600">
                                 <User className="w-4 h-4" />
                                 <span className="text-xs font-bold">{log.user}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center text-slate-500">
                       <History className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                       <p className="font-bold">No audit logs found for this job.</p>
                       <p className="text-sm text-slate-400">All administrative actions are logged here for compliance.</p>
                    </div>
                  )}
                </div>
            </div>
          ) : activeTab === 'financial' ? (
            <div className="max-w-4xl mx-auto space-y-8">
               {/* CUSTOMER PAYMENTS */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                     <div>
                       <h3 className="font-black text-xl text-slate-900 flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-slate-400" />
                          Customer Charges
                       </h3>
                       <p className="text-sm text-slate-500 mt-1">Payment Method: <span className="font-mono font-bold text-slate-900">STRIPE_CARD_VISA_4242</span></p>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         refundInfo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                     }`}>
                         {refundInfo ? (refundInfo.amount === job.customerPrice ? 'Fully Refunded' : 'Partially Refunded') : 'Paid'}
                     </div>
                  </div>
                  
                  <div className="p-8">
                     {!isEditingPrice ? (
                       <div className="flex justify-between items-center mb-8">
                          <div>
                            <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Invoice Amount</span>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="font-black text-4xl text-slate-900">£{job.customerPrice?.toFixed(2)}</span>
                              {!refundInfo && (
                                <button
                                  onClick={() => setIsEditingPrice(true)}
                                  className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all active:scale-90"
                                  title="Edit Price"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          {refundInfo && (
                            <div className="text-right">
                              <span className="text-red-400 text-xs font-black uppercase tracking-widest">Refund Issued</span>
                              <div className="font-black text-2xl text-red-600 mt-1">-£{refundInfo.amount.toFixed(2)}</div>
                            </div>
                          )}
                       </div>
                     ) : (
                       <div className="space-y-6 mb-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                           <h4 className="font-black text-blue-900 text-sm flex items-center gap-2 uppercase tracking-widest">
                             <Edit2 className="w-4 h-4" />
                             Modify Customer Price
                           </h4>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">New Amount (£)</label>
                               <div className="relative">
                                 <PoundSterling className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                 <input
                                   type="number"
                                   step="0.01"
                                   value={editedPrice}
                                   onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                                   className="w-full pl-12 pr-6 py-4 bg-white border-2 border-blue-100 rounded-2xl font-mono text-xl font-black focus:border-blue-500 outline-none transition-all"
                                   placeholder="0.00"
                                 />
                               </div>
                               <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Original Price: £{job.customerPrice?.toFixed(2)}</p>
                             </div>

                             <div>
                               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Reason for Modification</label>
                               <textarea
                                 value={priceEditReason}
                                 onChange={(e) => setPriceEditReason(e.target.value)}
                                 className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none resize-none transition-all"
                                 rows={2}
                                 placeholder="e.g. Additional items added on-site"
                               />
                             </div>
                           </div>

                           <div className="flex gap-4 pt-2">
                             <button
                               onClick={handleSavePrice}
                               className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                             >
                               <Save className="w-5 h-5" />
                               Save Changes
                             </button>
                             <button
                               onClick={handleCancelPriceEdit}
                               className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-300 transition-all"
                             >
                               Cancel
                             </button>
                           </div>
                       </div>
                     )}

                     {!refundInfo && !isEditingPrice && (
                        <div className="flex justify-end pt-6 border-t border-slate-50">
                           {canProcessRefund ? (
                             <button 
                               onClick={() => setShowRefundModal(true)}
                               className="px-6 py-3 border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                             >
                                <RotateCcw className="w-4 h-4" />
                                Process Refund
                             </button>
                           ) : (
                             <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                <Lock className="w-3 h-3" />
                                Refund Policy Restricted
                             </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>

               {/* DRIVER EARNINGS */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                     <div>
                       <h3 className="font-black text-xl text-slate-900 flex items-center gap-3">
                          <Truck className="w-6 h-6 text-slate-400" />
                          Driver Remuneration
                       </h3>
                       <p className="text-sm text-slate-500 mt-1">Beneficiary: <span className="font-bold text-slate-900">{job.driverName || 'UNASSIGNED'}</span></p>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         financialData.status === 'paid' ? 'bg-green-100 text-green-700' : 
                         financialData.status === 'approved' ? 'bg-blue-100 text-blue-700' : 
                         'bg-orange-100 text-orange-700'
                     }`}>
                         {financialData.status}
                     </div>
                  </div>
                  
                  <div className="p-8 space-y-4">
                     {[
                       { label: 'Base Contract Pay', amount: financialData.basePay, color: 'text-slate-900' },
                       { label: 'Bonuses / Extras', amount: financialData.extras, color: 'text-green-600', isExtra: true },
                       { label: 'Penalties / Deductions', amount: -financialData.deductions, color: 'text-red-600', isDeduction: true }
                     ].map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 group">
                          <div className="flex items-center gap-4">
                            <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">{item.label}</span>
                            {financialData.status === 'pending' && item.isExtra && (
                              <button onClick={() => setFinancialData(p => ({...p, extras: p.extras + 10}))} className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg border border-green-100">+ £10</button>
                            )}
                            {financialData.status === 'pending' && item.isDeduction && (
                              <button onClick={() => setFinancialData(p => ({...p, deductions: p.deductions + 10}))} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100">+ £10</button>
                            )}
                          </div>
                          <span className={`font-mono text-lg font-black ${item.color}`}>
                            {item.amount >= 0 ? '+' : '-'}£{Math.abs(item.amount).toFixed(2)}
                          </span>
                       </div>
                     ))}
                     
                     <div className="flex justify-between items-center pt-6">
                        <span className="font-black text-slate-900 text-xl uppercase tracking-tighter">Net Payable Amount</span>
                        <span className="font-black text-slate-900 text-4xl">£{netPay.toFixed(2)}</span>
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                     {financialData.status === 'pending' && canApprovePayout && (
                       <button 
                         onClick={() => {
                           setFinancialData(p => ({...p, status: 'approved'}));
                           auditLogger.log({ user: currentUser.name, role: currentUser.role, action: 'Approved Payout', jobId: job.id, details: `Amount £${netPay.toFixed(2)}` });
                         }}
                         className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-200 transition-all active:scale-95 flex items-center gap-3"
                       >
                         <CheckCircle className="w-5 h-5" />
                         Authorize Payment
                       </button>
                     )}
                     {financialData.status === 'approved' && (
                        <div className="flex items-center gap-3 text-green-600 font-black text-xs uppercase tracking-widest">
                          <CheckCircle className="w-5 h-5" />
                          Authorized for processing
                        </div>
                     )}
                  </div>
               </div>
            </div>
          ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT: COLLECTION & DROP-OFF */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* COLLECTION CARD */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                    <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100">A</div>
                        <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm">Collection Point</h3>
                      </div>
                      {job.startedAt && <span className="text-[10px] font-black font-mono text-blue-600 bg-white px-2 py-1 rounded-lg border border-blue-100">{new Date(job.startedAt).toLocaleTimeString()}</span>}
                    </div>
                    
                    <div className="p-6 space-y-6 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 rounded-xl"><MapPin className="w-5 h-5 text-slate-400" /></div>
                        <div>
                          <p className="font-black text-lg text-slate-900 leading-tight">
                            {job.contactDetails?.pickupLine1 || job.pickup.address}
                          </p>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                            {job.contactDetails?.pickupCity && `${job.contactDetails.pickupCity}, `}
                            {job.contactDetails?.pickupPostcode || job.pickup.postcode}
                          </p>
                          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 italic">
                            "{job.pickup.details || 'No specific access instructions provided.'}"
                          </div>
                        </div>
                      </div>

                      {/* Store Specific Section */}
                      {isStorePickup && (
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-3">
                          <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Retail Logistics Data
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-emerald-800">Store Name:</span>
                              <span className="text-xs font-black text-slate-900">{(job as any).storeName || 'IKEA Edinburgh'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-emerald-800">Order Number:</span>
                              <span className="text-xs font-black font-mono text-slate-900">{(job as any).orderNumber || 'ORD-88219'}</span>
                            </div>
                            {(job as any).receiptUrl && (
                              <button className="w-full mt-2 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                                <FileDown className="w-3 h-3" /> Download Receipt PDF
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Photos */}
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">On-Site Evidence</h4>
                        {collectionPhotos.length > 0 ? (
                          <div className="grid grid-cols-3 gap-3">
                            {collectionPhotos.map(photo => (
                              <div key={photo.id} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                                <img src={photo.url} alt="Proof" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-black uppercase">
                                  {new Date(photo.uploadedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-red-100 bg-red-50/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                            <Camera className="w-10 h-10 text-red-200 mb-3" />
                            <p className="text-xs font-black text-red-700 uppercase tracking-widest">Awaiting Verification</p>
                            <p className="text-[10px] text-red-400 font-bold mt-1">Proof of collection is mandatory.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DROP-OFF CARD */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                    <div className="px-6 py-4 border-b border-slate-100 bg-green-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black shadow-lg shadow-green-100">B</div>
                        <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm">Delivery Destination</h3>
                      </div>
                      {job.completedAt && <span className="text-[10px] font-black font-mono text-green-600 bg-white px-2 py-1 rounded-lg border border-green-100">{new Date(job.completedAt).toLocaleTimeString()}</span>}
                    </div>
                    
                    <div className="p-6 space-y-6 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 rounded-xl"><MapPin className="w-5 h-5 text-slate-400" /></div>
                        <div>
                          <p className="font-black text-lg text-slate-900 leading-tight">
                            {job.contactDetails?.deliveryLine1 || job.delivery.address}
                          </p>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                            {job.contactDetails?.deliveryCity && `${job.contactDetails.deliveryCity}, `}
                            {job.contactDetails?.deliveryPostcode || job.delivery.postcode}
                          </p>
                          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 italic">
                            "{job.delivery.details || 'Ground floor access.'}"
                          </div>
                        </div>
                      </div>

                      {/* POD Section */}
                      {job.proofOfDelivery ? (
                        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-green-400" /> Proof of Delivery Received
                           </h4>
                           <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-xl">
                                <img src={job.proofOfDelivery.signature} alt="Signature" className="h-12 w-auto invert" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signed By</p>
                                <p className="text-sm font-black">{job.proofOfDelivery.signedBy}</p>
                                <p className="text-[10px] text-slate-500 font-bold">{new Date(job.proofOfDelivery.signedAt).toLocaleString()}</p>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Evidence</h4>
                          {dropoffPhotos.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                              {dropoffPhotos.map(photo => (
                                <div key={photo.id} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                                  <img src={photo.url} alt="Proof" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-red-100 bg-red-50/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                              <Camera className="w-10 h-10 text-red-200 mb-3" />
                              <p className="text-xs font-black text-red-700 uppercase tracking-widest">Awaiting Proof</p>
                              <p className="text-[10px] text-red-400 font-bold mt-1">Mandatory for final verification.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* INVENTORY BREAKDOWN */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                     <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm flex items-center gap-2">
                       <Package className="w-5 h-5 text-slate-400" /> Inventory Breakdown
                     </h3>
                     <div className="flex items-center gap-4">
                       <div className="text-right">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volume</span>
                         <p className="text-sm font-black text-slate-900">{job.totalVolume} m³</p>
                       </div>
                       <div className="text-right">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items</span>
                         <p className="text-sm font-black text-slate-900">{job.items?.reduce((s, i) => s + i.quantity, 0) || 0}</p>
                       </div>
                     </div>
                   </div>
                   <div className="p-0">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-3">Item Name</th>
                            <th className="px-6 py-3 text-center">Qty</th>
                            <th className="px-6 py-3 text-right">Unit Vol</th>
                            <th className="px-6 py-3 text-right">Total Vol</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {job.items && job.items.length > 0 ? job.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900 text-sm">{item.name}</td>
                              <td className="px-6 py-4 text-center">
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black">{item.quantity}</span>
                              </td>
                              <td className="px-6 py-4 text-right text-xs font-bold text-slate-500">{item.volume.toFixed(2)}m³</td>
                              <td className="px-6 py-4 text-right text-sm font-black text-slate-900">{(item.volume * item.quantity).toFixed(2)}m³</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic font-bold">No individual items listed.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                   </div>
                </div>
              </div>

              {/* RIGHT: PARTIES & LOGISTICS */}
              <div className="space-y-8">
                {/* CUSTOMER CARD */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-4 h-4" /> Client Information
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xl">
                        {job.customerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-none">{job.customerName}</p>
                        <p className="text-xs font-bold text-blue-600 mt-1 cursor-pointer hover:underline">ID: CUST-8812</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl"><Phone className="w-4 h-4 text-slate-400" /></div>
                        <span className="text-sm font-black text-slate-900">{job.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl"><Mail className="w-4 h-4 text-slate-400" /></div>
                        <span className="text-sm font-bold text-slate-900 truncate">{job.customerEmail || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOGISTICS CARD */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Operations Data
                  </h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vehicle</span>
                          <p className="text-sm font-black text-slate-900">{job.vehicle}</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Crew Size</span>
                          <p className="text-sm font-black text-slate-900">{job.crew} Man</p>
                       </div>
                    </div>

                    {/* Motorbike specific */}
                    {isMotorbike && (
                      <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                         <h5 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">Vehicle Details</h5>
                         <div className="flex justify-between text-xs mb-2">
                            <span className="font-bold text-orange-800">Type:</span>
                            <span className="font-black">{(job as any).motorbikeType || 'Superbike'}</span>
                         </div>
                         <div className="flex justify-between text-xs">
                            <span className="font-bold text-orange-800">Model:</span>
                            <span className="font-black">{(job as any).bikeModel || 'BMW R1250GS'}</span>
                         </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-slate-50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Professional</p>
                       {job.driverName ? (
                         <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg">
                                 {job.driverName.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 text-sm">{job.driverName}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full-Time Partner</p>
                               </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                               <Shield className="w-5 h-5" />
                            </button>
                         </div>
                       ) : (
                         <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center animate-pulse">
                            <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">Unassigned Unit</p>
                            <button className="mt-4 px-6 py-2 bg-white text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Assign Now</button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                {/* TIME BASED CARD */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-200">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Timer className="w-4 h-4 text-blue-400" /> Time Management
                   </h4>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Estimated Time</span>
                            <p className="text-2xl font-black">{job.duration || '2.5 hrs'}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Actual Time</span>
                            <p className="text-2xl font-black text-green-400">--:--</p>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                         <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Hourly Rate</span>
                            <p className="text-sm font-black">£60.00 / hr</p>
                         </div>
                         <button className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all">
                            <Edit2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </>
          )}
        </div>
      </div>

      {showRefundModal && (
        <RefundModal 
          job={job} 
          onClose={() => setShowRefundModal(false)} 
          onConfirm={handleRefundConfirm}
        />
      )}
    </div>
  );
}
