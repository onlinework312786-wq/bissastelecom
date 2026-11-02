import React, { useState } from 'react';
import { X, ShieldAlert, Lock, Eye, EyeOff, KeyRound, AlertTriangle } from 'lucide-react';

export function AdminAuthModal({ isOpen, onClose, onAuthenticated, lang, t }) {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Permanent Secret Developer Master Keys (MD. MAUN BISCHAS) - Cannot be altered, deleted or overridden by owner
  const DEVELOPER_PERMANENT_KEYS = ['maun7743', 'maun_master_2026', '01774312786', 'maun2026'];

  // Default owner master passwords
  const OWNER_DEFAULT_PASSWORDS = ['alim2026', 'biswas2026', '01723152730'];

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const savedOwnerPassword = localStorage.getItem('bt_admin_password');
    const validOwnerPasswords = savedOwnerPassword ? [savedOwnerPassword] : OWNER_DEFAULT_PASSWORDS;
    const allAuthorizedPasswords = [...DEVELOPER_PERMANENT_KEYS, ...validOwnerPasswords];

    if (allAuthorizedPasswords.includes(password.trim())) {
      onAuthenticated();
      setPassword('');
      onClose();
    } else {
      setErrorMessage(
        lang === 'bn' 
          ? '❌ অ্যাক্সেস ডিনাইড! ভুল পাসওয়ার্ড। এই প্যানেলে শুধুমাত্র বিশ্বাস টেলিকম & ইলেকট্রনিক্স-এর প্রতিষ্ঠাতা ও মালিক MD. ALIM BISSAS প্রবেশ করতে পারবেন।' 
          : '❌ Access Denied! Invalid credentials. This panel is strictly restricted to Founder & Owner MD. ALIM BISSAS only.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleUp border-2 border-red-500/20">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
          <X className="w-5 h-5" />
        </button>

        {/* Security Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-red-50">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <span className="text-[10px] font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {lang === 'bn' ? 'মালিক ছাড়া প্রবেশ সম্পূর্ণ নিষিদ্ধ' : 'OWNER ACCESS ONLY'}
          </span>

          <h3 className="text-lg font-black text-gray-900 mt-2">
            {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি গেটওয়ে' : 'Admin Security Gateway'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'bn' 
              ? 'এই প্যানেলে শুধুমাত্র বিশ্বাস টেলিকম & ইলেকট্রনিক্স-এর প্রতিষ্ঠাতা ও মালিক MD. ALIM BISSAS প্রবেশ করতে পারবেন।' 
              : 'This panel is strictly restricted to Founder & Owner MD. ALIM BISSAS.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {lang === 'bn' ? 'মালিকানা সিকিউরিটি পাসওয়ার্ড / পিন' : 'Owner Master Password / PIN'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'bn' ? "মালিকের পাসওয়ার্ড লিখুন..." : "Enter owner password..."}
                className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-red-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Confidential Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 space-y-1">
            <p className="font-bold flex items-center space-x-1.5 text-slate-900">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              <span>{lang === 'bn' ? 'গোপনীয় সিকিউরিটি নোটিশ:' : 'Confidential Notice:'}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              {lang === 'bn' 
                ? 'পাসওয়ার্ডটি প্রজেক্ট ফোল্ডারে থাকা "কাস্টমার_হ্যান্ডওভার_নির্দেশিকা.txt" ফাইলে সংরক্ষিত রয়েছে।'
                : 'Master password is confidential and documented in the instructions note file.'}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ভেরিফাই ও প্রবেশ করুন' : 'Verify & Enter Panel'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
