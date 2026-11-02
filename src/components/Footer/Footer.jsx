import React from 'react';
import { Smartphone, Radio, ShieldCheck, Truck, Headphones, RotateCcw, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export function Footer({ lang, t }) {
  const whatsappUrl = "https://wa.me/8801774312786?text=" + encodeURIComponent(
    lang === 'bn' 
      ? "আসসালামু আলাইকুম, বিশ্বাস টেলিকম & ইলেকট্রনিক্স সম্পর্কে জানতে চাই।" 
      : "Hello, I want to inquire about Biswas Telecom & Electronics."
  );

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 text-gray-600 text-xs">
      
      {/* 4 Feature Columns Top Bar */}
      <div className="border-b border-gray-200 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">{t.trust1Title}</h5>
              <p className="text-[11px] text-gray-500">{t.trust1Desc}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">{t.trust2Title}</h5>
              <p className="text-[11px] text-gray-500">{t.trust2Desc}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">{t.trust3Title}</h5>
              <p className="text-[11px] text-gray-500">{t.trust3Desc}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">{t.customerCare}</h5>
              <p className="text-[11px] text-gray-500">{t.hotlineAlert}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: Brand Info & Contact */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 to-orange-500 rounded-xl flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
              <Radio className="w-3 h-3 -ml-0.5 text-orange-200" />
            </div>
            <div>
              <h4 className="font-black text-base text-gray-900">
                {t.brandName1} <span className="text-orange-600">{t.brandName2}</span>
              </h4>
              <p className="text-[10px] text-gray-500 font-bold">{t.brandSubtitle}</p>
            </div>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed">
            {t.footerTagline}
          </p>

          {/* Contact Details */}
          <div className="space-y-2 text-gray-700 pt-1">
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>{t.storeAddress}</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <a href="tel:+8801723152730" className="hover:text-blue-600 font-semibold font-mono">
                +8801723152730
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <a href="mailto:mdalimbissas24@gmail.com" className="hover:text-purple-600 font-medium">
                mdalimbissas24@gmail.com
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline flex items-center space-x-1"
              >
                <span>WhatsApp: +8801774312786</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-normal">
                  ({lang === 'bn' ? 'ক্লিক করলেই চ্যাট' : 'Click to chat'})
                </span>
              </a>
            </p>
          </div>
        </div>

        {/* Col 2: Customer Care */}
        <div className="space-y-2.5">
          <h5 className="font-extrabold text-sm text-gray-900">{t.customerCareFooter}</h5>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'হেল্প সেন্টার & এফএকিউ' : 'Help Center & FAQ'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'কীভাবে অর্ডার করবেন?' : 'How to Buy'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'শিপিং ও ডেলিভারি পলিসি' : 'Shipping & Delivery Policy'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'ওয়ারেন্টি ও রিপ্লেসমেন্ট ক্লেইম' : 'Warranty & Claim'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'রিটার্ন ও রিফান্ড পলিসি' : 'Return & Refund Policy'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'অর্ডার ট্র্যাকিং নির্দেশিকা' : 'Order Tracking Guide'}</a></li>
          </ul>
        </div>

        {/* Col 3: Biswas Telecom Info */}
        <div className="space-y-2.5">
          <h5 className="font-extrabold text-sm text-gray-900">{t.aboutUsFooter}</h5>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'আমাদের পরিচিতি' : 'About Us'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'ডিজিটাল কমার্স পলিসি' : 'Digital Commerce Policy'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'শর্তাবলী ও প্রাইভেসী পলিসি' : 'Terms & Privacy Policy'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'অফিসিয়াল আউটলেট লোকেশন' : 'Official Outlets'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'কর্পোরেট ডিল ও বাল্ক অর্ডার' : 'Corporate Deals'}</a></li>
            <li><a href="#" className="hover:text-orange-600 transition">{lang === 'bn' ? 'সেলার হিসেবে যোগ দিন' : 'Join as a Seller'}</a></li>
          </ul>
        </div>

        {/* Col 4: Payment & Delivery Partners */}
        <div className="space-y-4">
          <div>
            <h5 className="font-extrabold text-sm text-gray-900 mb-2">{t.safePaymentPartners}</h5>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span className="bg-pink-100 text-pink-700 px-2.5 py-1 rounded border border-pink-200">bKash বিকাশ</span>
              <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded border border-orange-200">নগদ Nagad</span>
              <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded border border-purple-200">Rocket রকেট</span>
              <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded border border-blue-200">Visa Card</span>
              <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded border border-red-200">Mastercard</span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">{t.paymentCOD}</span>
            </div>
          </div>

          <div>
            <h5 className="font-extrabold text-sm text-gray-900 mb-2">{t.deliveryPartners}</h5>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-gray-700">
              <span className="bg-gray-100 px-2 py-0.5 rounded">Steadfast Courier</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Pathao Courier</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">RedX Delivery</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">eCourier BD</span>
            </div>
          </div>
        </div>

      </div>

      {/* Developer Credits & Copyright Bar */}
      <div className="border-t border-gray-200 bg-gray-100/95 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          <p className="text-xs text-gray-600 font-medium">
            {t.copyrightText}
          </p>

          {/* User Requested Permanent Tamper-Proof Credit */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span 
              id="permanent-maun-credit-badge"
              style={{ display: 'inline-flex', visibility: 'visible', opacity: 1 }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black px-4 py-1.5 rounded-full shadow-md tracking-wide transition items-center space-x-1.5"
            >
              <span>★</span>
              <span>Design & Developed by MD. MAUN BISCHAS</span>
            </span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp: +8801774312786</span>
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}
