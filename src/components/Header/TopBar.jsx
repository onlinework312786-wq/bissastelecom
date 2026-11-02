import React from 'react';
import { Smartphone, ShieldCheck, HelpCircle, Truck, User, Settings } from 'lucide-react';
import { LiveClock } from './LiveClock';

export function TopBar({ lang, setLang, onOpenAuth, currentUser, onOpenTracking, onOpenAdmin, t }) {
  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('bt_lang', selectedLang);
  };

  return (
    <div className="bg-[#f7f7f7] border-b border-gray-200 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        
        {/* Left Side: Live Date & Clock + Helpline */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          {/* Live Date, Day, Month, Year & Time */}
          <LiveClock lang={lang} />

          <span className="text-gray-300 hidden md:inline">|</span>

          <a 
            href="tel:+8801723152730" 
            className="hidden sm:flex items-center space-x-1 hover:text-orange-600 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.customerCare}: <strong className="font-mono text-gray-800">+8801723152730</strong></span>
          </a>
        </div>

        {/* Right Side Links */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          {/* Order Tracking */}
          <button 
            onClick={onOpenTracking}
            className="flex items-center space-x-1 text-blue-700 font-medium hover:text-blue-800 transition"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.trackOrder}</span>
          </button>

          <span className="text-gray-300">|</span>

          {/* Unmistakable Dual Language Switcher with Visual Active State */}
          <div className="flex items-center bg-gray-200/90 p-0.5 rounded-lg border border-gray-300 text-xs">
            <button 
              type="button"
              onClick={() => handleSelectLanguage('bn')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                lang === 'bn' 
                  ? 'bg-orange-600 text-white shadow-xs' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
              title="বাংলা ভাষা নির্বাচন করুন"
            >
              <span>🇧🇩 বাংলা</span>
            </button>
            <button 
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                lang === 'en' 
                  ? 'bg-orange-600 text-white shadow-xs' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
              title="Select English Language"
            >
              <span>🇬🇧 English</span>
            </button>
          </div>

          <span className="text-gray-300">|</span>

          {/* User Account / Auth */}
          {currentUser ? (
            <div className="flex items-center space-x-1.5 cursor-pointer" onClick={onOpenAuth}>
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-5 h-5 rounded-full object-cover border border-orange-500 shadow-xs" 
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
              )}
              <span className="font-semibold text-gray-800 hover:text-orange-600 transition">
                {currentUser.name}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAuth();
                }}
                className="text-orange-600 hover:underline text-[11px]"
              >
                ({t.profile})
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center space-x-1 text-orange-600 font-semibold hover:text-orange-700 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.loginRegister}</span>
            </button>
          )}

          <span className="text-gray-300">|</span>

          {/* Quick Admin Panel Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-900 text-white px-2 py-0.5 rounded text-[11px] font-medium transition"
            title={t.adminSubtitle}
          >
            <Settings className="w-3 h-3 text-orange-400" />
            <span>{t.adminPanel}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
