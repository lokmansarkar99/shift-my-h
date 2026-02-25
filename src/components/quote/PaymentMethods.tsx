import React from 'react';

/**
 * PaymentMethods Component
 * 
 * Displays accepted payment method icons (Visa, Mastercard, Apple Pay, Google Pay)
 * Used in the quote flow summary panels (Steps 2-5) as a trust signal.
 * 
 * Design: Clean, simple logos at 80x50px without card backgrounds
 */
export function PaymentMethods() {
  return (
    <div 
      className="flex flex-col items-center gap-6 pt-6 border-t border-slate-200"
      aria-label="Accepted payment methods"
      role="img"
    >
      <div className="text-base font-bold text-slate-800 uppercase tracking-wider">
        Accepted Payment Methods
      </div>
      
      <div className="flex items-center justify-center gap-4 flex-wrap px-4">
        {/* Visa */}
        <div className="hover:scale-110 transition-transform cursor-default" title="Visa">
          <svg width="60" height="38" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 9.5L18.2 18.5H16L18.3 9.5H20.5ZM28.8 13.9L29.9 10.6L30.5 13.9H28.8ZM31.6 18.5H33.5L31.9 9.5H30.2C29.8 9.5 29.5 9.7 29.3 10L26.5 18.5H28.8L29.2 17.3H31.9L32.2 18.5H31.6ZM27.3 15.3C27.3 13.3 24.6 13.2 24.6 12.3C24.6 12 24.9 11.6 25.6 11.5C25.9 11.5 26.7 11.6 27.4 11.9L27.8 10.1C27.2 9.9 26.4 9.6 25.5 9.6C23.3 9.6 21.8 10.8 21.8 12.5C21.8 13.7 22.9 14.4 23.7 14.8C24.5 15.2 24.8 15.5 24.8 15.8C24.8 16.3 24.2 16.5 23.7 16.5C22.8 16.5 22.3 16.4 21.5 16L21.1 17.9C21.8 18.2 23.1 18.5 24.4 18.5C26.8 18.6 28.2 17.4 27.3 15.3ZM21.2 9.5L17.5 18.5H15.2L13.4 11.3C13.3 11 13.2 10.8 13 10.7C12.5 10.4 11.7 10.2 11 10L11.1 9.5H14.8C15.3 9.5 15.7 9.8 15.8 10.4L16.7 15.5L19 9.5H21.2Z" fill="#1434CB"/>
          </svg>
        </div>

        {/* Mastercard */}
        <div className="hover:scale-110 transition-transform cursor-default" title="Mastercard">
          <svg width="60" height="38" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18.5" cy="14" r="7" fill="#EB001B"/>
            <circle cx="29.5" cy="14" r="7" fill="#F79E1B"/>
            <path d="M24 8.3C25.5 9.5 26.5 11.4 26.5 13.6C26.5 15.8 25.5 17.7 24 18.9C22.5 17.7 21.5 15.8 21.5 13.6C21.5 11.4 22.5 9.5 24 8.3Z" fill="#FF5F00"/>
          </svg>
        </div>

        {/* Apple Pay */}
        <div className="hover:scale-110 transition-transform cursor-default" title="Apple Pay">
          <svg width="60" height="38" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(4, 6) scale(1.1)">
              <path d="M8.5 3.2C8.5 2.3 9.1 1.5 9.9 1.2C9.5 0.6 8.8 0.2 8 0.2C7 0.2 6.3 0.8 5.8 0.8C5.3 0.8 4.6 0.2 3.8 0.2C2.5 0.2 1.3 1 0.7 2.2C-0.5 4.5 0.4 7.9 1.5 9.8C2 10.7 2.7 11.7 3.5 11.7C4.3 11.7 4.5 11.2 5.4 11.2C6.3 11.2 6.6 11.7 7.4 11.7C8.2 11.7 8.8 10.8 9.3 9.9C9.9 8.9 10.1 8 10.1 7.9C10.1 7.9 8.5 7.3 8.5 5.5C8.5 3.9 9.7 3.2 9.8 3.2C9.1 2.2 8 2.2 7.7 2.2C7.7 2.2 8.5 3.2 8.5 3.2Z" fill="#000000"/>
              <path d="M13.5 0.5H15V12H13.5V0.5Z" fill="#000000"/>
              <path d="M19 6.5C19 4.2 20.6 2.7 23 2.7C24.4 2.7 25.6 3.4 26.2 4.5V2.9H27.7V12H26.2V10.4C25.6 11.5 24.4 12.2 23 12.2C20.6 12.2 19 10.7 19 8.4V6.5ZM20.5 8.4C20.5 9.9 21.5 10.9 23 10.9C24.5 10.9 25.5 9.9 25.5 8.4V6.5C25.5 5 24.5 4 23 4C21.5 4 20.5 5 20.5 6.5V8.4Z" fill="#000000"/>
              <path d="M29 2.9H30.5V4.5C31.1 3.4 32.2 2.7 33.5 2.7C35.5 2.7 36.8 4.1 36.8 6.3V12H35.3V6.5C35.3 4.8 34.5 3.9 33 3.9C31.5 3.9 30.5 5 30.5 6.7V12H29V2.9Z" fill="#000000"/>
            </g>
          </svg>
        </div>

        {/* Google Pay */}
        <div className="hover:scale-110 transition-transform cursor-default" title="Google Pay">
          <svg width="60" height="38" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(5, 7) scale(1.05)">
              <path d="M9 6.5V9.5H7.3V0.5H11C12 0.5 12.8 0.9 13.4 1.5C14 2.1 14.3 2.9 14.3 3.8C14.3 4.7 14 5.5 13.4 6.1C12.8 6.7 12 7 11 7H9V6.5ZM9 2.2V5.3H11C11.5 5.3 11.9 5.1 12.2 4.8C12.5 4.5 12.7 4.1 12.7 3.7C12.7 3.3 12.5 2.9 12.2 2.6C11.9 2.3 11.5 2.1 11 2.1H9V2.2Z" fill="#5F6368"/>
              <path d="M17.5 4.5C18.5 4.5 19.2 4.8 19.8 5.4C20.4 6 20.7 6.7 20.7 7.6V9.5H19.2V8.6H19.1C18.6 9.2 17.9 9.5 17.1 9.5C16.4 9.5 15.8 9.3 15.3 8.9C14.8 8.5 14.5 8 14.5 7.4C14.5 6.7 14.8 6.2 15.3 5.9C15.8 5.6 16.5 5.4 17.3 5.4H19.1V5C19.1 4.6 18.9 4.2 18.6 4C18.3 3.8 17.9 3.7 17.5 3.7C16.8 3.7 16.2 3.9 15.7 4.5L14.9 3.6C15.6 2.9 16.5 2.5 17.5 2.5V4.5ZM16.1 7.4C16.1 7.6 16.2 7.8 16.4 8C16.6 8.2 16.9 8.3 17.2 8.3C17.7 8.3 18.2 8.1 18.5 7.8C18.9 7.5 19.1 7.1 19.1 6.6V6.4H17.5C16.7 6.4 16.2 6.7 16.2 7.3L16.1 7.4Z" fill="#5F6368"/>
              <path d="M25.5 9.5L22.2 3H24.1L26.5 7.8H26.6L29 3H30.9L26.2 11.5H24.3L25.5 9.5Z" fill="#5F6368"/>
              <path d="M-0.5 3.5C-0.5 4.2 -0.6 4.8 -0.8 5.4H-5.5C-5.4 6 -5.1 6.5 -4.6 6.8C-4.1 7.1 -3.6 7.3 -3 7.3C-2.2 7.3 -1.6 7 -1.1 6.4L-0.2 7.5C-0.9 8.5 -2 9 -3.2 9C-4.4 9 -5.3 8.6 -6.1 7.9C-6.9 7.2 -7.3 6.3 -7.3 5.2C-7.3 4.1 -6.9 3.2 -6.1 2.5C-5.3 1.8 -4.4 1.4 -3.2 1.4C-2 1.4 -1.1 1.8 -0.3 2.5C0.4 3.2 0.8 4.1 0.8 5.2V3.5H-0.5ZM-5.5 4H-2.2C-2.3 3.5 -2.5 3.1 -2.9 2.8C-3.3 2.5 -3.7 2.4 -4.2 2.4C-4.7 2.4 -5.1 2.5 -5.5 2.8C-5.9 3.1 -6.1 3.5 -5.5 4Z" fill="#4285F4"/>
              <path d="M5 2.5C5.8 1.7 6.8 1.3 8 1.3C9.4 1.3 10.5 1.9 11.3 2.9C12.1 3.9 12.5 5.1 12.5 6.4C12.5 7.7 12.1 8.9 11.3 9.9C10.5 10.9 9.4 11.5 8 11.5C6.8 11.5 5.8 11.1 5 10.3V14.5H3.3V1.5H5V2.5ZM10.3 8.8C10.9 8.1 11.2 7.3 11.2 6.4C11.2 5.5 10.9 4.7 10.3 4C9.7 3.3 9 2.9 8.1 2.9C7.2 2.9 6.5 3.3 5.9 4C5.3 4.7 5 5.5 5 6.4C5 7.3 5.3 8.1 5.9 8.8C6.5 9.5 7.2 9.9 8.1 9.9C9 9.9 9.7 9.5 10.3 8.8Z" fill="#EA4335"/>
            </g>
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure & Encrypted Payment</span>
      </div>
    </div>
  );
}