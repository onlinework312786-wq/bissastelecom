import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Code, Heart } from 'lucide-react';

/**
 * Permanent Non-Removable Developer Signature & Verification
 * Design & Developed by: MD. MAUN BISCHAS
 * Protected with DOM Mutation Guard & Console Integrity Stamp
 */
export function DeveloperSignature({ lang = 'bn' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Console Verification Stamp
    const stampStyle = "background: linear-gradient(to right, #ea580c, #2563eb); color: #ffffff; font-weight: bold; font-size: 13px; padding: 6px 12px; border-radius: 6px;";
    console.log(
      "%c✦ সিস্টেম অথর & ডেভেলপার ভেরিফিকেশন: MD. MAUN BISCHAS\nডিজাইন ও ডেভেলপমেন্ট: MD. MAUN BISCHAS (ডিজাইন ও ডেভলপ বাই MD. MAUN BISCHAS)\nHelpline: +8801723152730 | WhatsApp: +8801774312786",
      stampStyle
    );

    // 2. DOM Tamper Protection
    const enforceVisibility = () => {
      const el = containerRef.current;
      if (el) {
        if (el.style.display === 'none' || el.style.visibility === 'hidden' || el.style.opacity === '0') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('opacity', '1', 'important');
        }
      }
    };

    const interval = setInterval(enforceVisibility, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      id="permanent-developer-signature"
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto'
      }}
      className="bg-slate-900 border-t border-slate-800 text-white py-3 px-4 select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        
        {/* Tamper-proof Protected Credit */}
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <p className="font-bold tracking-wide text-slate-200">
            <span className="text-orange-400 font-extrabold mr-1">✦</span>
            ডিজাইন ও ডেভেলপমেন্ট: <span className="text-white font-black underline decoration-orange-500 decoration-2">MD. MAUN BISCHAS</span>
            <span className="text-slate-400 ml-1.5 font-medium hidden md:inline">
              (ডিজাইন ও ডেভলপ বাই MD. MAUN BISCHAS)
            </span>
          </p>
        </div>

        {/* Developer Contact & Authenticity Tag */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-300">
          <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 font-mono text-orange-300">
            Author: MD. MAUN BISCHAS
          </span>
          <a 
            href="https://wa.me/8801774312786" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition flex items-center space-x-1"
          >
            <span>WhatsApp: +8801774312786</span>
          </a>
        </div>

      </div>
    </div>
  );
}
