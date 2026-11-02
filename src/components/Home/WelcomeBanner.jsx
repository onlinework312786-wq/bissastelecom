import React from 'react';
import { Sparkles, ShieldCheck, Truck, Headphones, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export function WelcomeBanner({ lang, onScrollToSection, t }) {
  const whatsappUrl = "https://wa.me/8801774312786?text=" + encodeURIComponent(
    lang === 'bn' 
      ? "আসসালামু আলাইকুম, বিশ্বাস টেলিকম & ইলেকট্রনিক্স সম্পর্কে জানতে চাই।" 
      : "Hello, I want to inquire about Biswas Telecom & Electronics."
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-900/40">
        
        {/* Subtle background ambient lighting effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative z-10 px-6 py-7 sm:px-10 sm:py-9 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Main Welcome Typography */}
          <div className="text-center md:text-left space-y-3 max-w-2xl">
            
            {/* Store Verification Chip */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 px-3.5 py-1 rounded-full text-xs font-semibold text-orange-300 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{lang === 'bn' ? 'অফিসিয়াল ই-কমার্স প্ল্যাটফর্ম' : 'Official Authorized E-Commerce'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300 font-bold">{lang === 'bn' ? '১০০% ভেরিফাইড' : 'Verified'}</span>
            </div>

            {/* Prominent Welcome Headline requested by user */}
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-slate-100 to-amber-100 bg-clip-text text-transparent">
                  {lang === 'bn' ? 'বিশ্বাস টেলিকম & ইলেকট্রনিক্স' : 'Biswas Telecom & Electronics'}
                </span>
              </h1>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400 mt-1 sm:mt-1.5 flex items-center justify-center md:justify-start gap-2">
                <span>{lang === 'bn' ? 'এ আপনাকে স্বাগতম' : 'Welcome to Our Store'}</span>
                <span className="text-2xl sm:text-3xl animate-bounce">✨</span>
              </h2>
            </div>

            {/* Subtitle / Promise */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium pt-0.5">
              {lang === 'bn' 
                ? 'দেশসেরা স্মার্টফোন, প্রিমিয়াম গ্যাজেট এবং ১০০% জেনুইন ইলেকট্রনিক্স অ্যাক্সেসরিজের নির্ভরযোগ্য বিশ্বস্ত ঠিকানা।'
                : 'Your most trusted destination for genuine smartphones, premium gadgets, and original electronics accessories in Bangladesh.'}
            </p>

            {/* Feature Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[11px] text-slate-200 font-medium">
              <span className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'bn' ? 'অরিজিনাল প্রোডাক্ট' : '100% Genuine'}</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'bn' ? 'সারা দেশে দ্রুত ডেলিভারি' : 'Fast Delivery'}</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'bn' ? 'অফিসিয়াল ওয়ারেন্টি' : 'Official Warranty'}</span>
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto flex-shrink-0">
            <button 
              onClick={() => onScrollToSection('all-products')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>{lang === 'bn' ? 'পণ্যসমূহ দেখুন' : 'Explore Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => onScrollToSection('flash-sale')}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/20 transition flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <span>⚡ {lang === 'bn' ? 'আজকের ফ্ল্যাশ সেল' : 'Today Flash Sale'}</span>
            </button>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs px-6 py-2.5 rounded-xl border border-emerald-400/30 transition flex items-center justify-center space-x-2 shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: +8801774312786</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
