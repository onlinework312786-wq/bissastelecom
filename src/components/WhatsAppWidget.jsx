import React from 'react';
import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react';

export function WhatsAppWidget({ lang, translations }) {
  const whatsappNumber = "8801774312786";
  const defaultMessage = lang === 'bn' 
    ? "আসসালামু আলাইকুম, বিশ্বাস টেলিকম & ইলেকট্রনিক্স থেকে পণ্য অর্ডার / তথ্য সম্পর্কে জানতে চাই।"
    : "Hello! I would like to inquire about products at Biswas Telecom & Electronics.";
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      
      {/* Tooltip / Speech bubble */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center space-x-1.5 bg-white text-gray-800 text-xs font-bold py-2 px-3.5 rounded-full shadow-xl border border-emerald-100 mr-2.5 transition-all duration-300 transform group-hover:scale-105 hover:bg-emerald-50"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span className="text-emerald-700">{translations.whatsappChatBtn}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600" />
      </a>

      {/* Main WhatsApp Circular Action Button */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 relative"
        title={translations.whatsappTooltip}
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none"></span>

        <MessageCircle className="w-7 h-7 fill-white" />
        
        {/* Online Status Dot */}
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
      </a>

    </div>
  );
}
