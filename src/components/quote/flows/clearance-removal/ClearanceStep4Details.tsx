/**
 * Clearance & Removal - Step 4: Contact Details
 * Professional contact form for customer information
 */

import React, { useState } from 'react';
import { ClearanceQuote } from './clearanceTypes';
import { ChevronRight, ArrowLeft, User, Mail, Phone, Calendar, Clock, MessageSquare, MapPin, Home } from 'lucide-react';
import { ClearanceSidebar } from './ClearanceSidebar';

interface StepProps {
  data: ClearanceQuote;
  onChange: (updates: Partial<ClearanceQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClearanceStep4Details({ data, onChange, onNext, onBack }: StepProps) {
  // Local state for form fields
  const [name, setName] = useState(data.contact?.name || '');
  const [email, setEmail] = useState(data.contact?.email || '');
  const [phone, setPhone] = useState(data.contact?.phone || '');
  const [addressLine1, setAddressLine1] = useState(data.pickupAddress?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(data.pickupAddress?.addressLine2 || '');
  const [city, setCity] = useState(data.pickupAddress?.city || '');
  const [postcode, setPostcode] = useState(data.pickupAddress?.postcode || '');
  const [preferredDate, setPreferredDate] = useState(data.pickupDate || '');
  const [preferredTime, setPreferredTime] = useState(data.pickupTime || '');
  const [notes, setNotes] = useState(data.notes || '');

  // Validation states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    postcode: '',
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (UK format)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    return phoneRegex.test(phone) || phone.length >= 10;
  };

  // Postcode validation (UK format)
  const validatePostcode = (postcode: string): boolean => {
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  };

  const handleNext = () => {
    // Validate form
    const newErrors = {
      name: name.trim() === '' ? 'Please enter your name' : '',
      email: email.trim() === '' ? 'Please enter your email' : !validateEmail(email) ? 'Please enter a valid email' : '',
      phone: phone.trim() === '' ? 'Please enter your phone number' : !validatePhone(phone) ? 'Please enter a valid UK phone number' : '',
      addressLine1: addressLine1.trim() === '' ? 'Please enter your street address' : '',
      city: city.trim() === '' ? 'Please enter your city' : '',
      postcode: postcode.trim() === '' ? 'Please enter your postcode' : !validatePostcode(postcode) ? 'Please enter a valid UK postcode' : '',
    };

    setErrors(newErrors);

    // Check if any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Save to data
    onChange({
      contact: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      pickupAddress: {
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        postcode: postcode.trim().toUpperCase(),
      },
      pickupDate: preferredDate,
      pickupTime: preferredTime,
      notes: notes.trim(),
    });

    onNext();
  };

  // Get min date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Grid Layout - IDENTICAL to Step 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        
        {/* LEFT COLUMN - Contact Form */}
        <div className="order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Your Contact Details
                </h1>
                <p className="text-sm text-slate-600">We'll use these to confirm your booking</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="John Smith"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="john.smith@example.com"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      We'll send your quote confirmation here
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder="07123 456789"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      UK mobile number preferred
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Address
                </h3>

                <div className="space-y-4">
                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => {
                        setAddressLine1(e.target.value);
                        if (errors.addressLine1) setErrors({ ...errors, addressLine1: '' });
                      }}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.addressLine1 ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    />
                    {errors.addressLine1 && (
                      <p className="text-xs text-red-600 mt-1">{errors.addressLine1}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment 4B"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      placeholder="London"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.city ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* Postcode */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value);
                        if (errors.postcode) setErrors({ ...errors, postcode: '' });
                      }}
                      placeholder="SW1A 1AA"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.postcode ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                    />
                    {errors.postcode && (
                      <p className="text-xs text-red-600 mt-1">{errors.postcode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferred Date & Time Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Preferred Date & Time (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        min={getMinDate()}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Earliest available: tomorrow
                    </p>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Select time</option>
                        <option value="Morning (8am-12pm)">Morning (8am-12pm)</option>
                        <option value="Afternoon (12pm-5pm)">Afternoon (12pm-5pm)</option>
                        <option value="Evening (5pm-8pm)">Evening (5pm-8pm)</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      We'll confirm exact time later
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Additional Notes (Optional)
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Any special requirements?
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Access codes, parking restrictions, fragile items..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Help us prepare for a smooth collection
                  </p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-900">
                  <strong>Privacy Notice:</strong> Your information will be used to process your quote and booking. 
                  We'll never share your details with third parties. View our{' '}
                  <a href="#" className="underline hover:text-blue-700">Privacy Policy</a>.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous Step
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl transition-all"
                >
                  Review Booking
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary Sidebar */}
        <ClearanceSidebar data={data} currentStep={4} />
      </div>
    </div>
  );
}