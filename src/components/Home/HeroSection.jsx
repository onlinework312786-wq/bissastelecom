import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RefreshCw, Zap, Tag, Gift } from 'lucide-react';
import { categories, promotionalBanners } from '../../data/categories';

export function HeroSection({ lang, onSelectCategory, onOpenVouchers, onScrollToSection, activePromoVoucher, t }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-3 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left Side: Category Menu for Desktop */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>{t.telecomCategories}</span>
            <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-semibold">{lang === 'bn' ? 'হট' : 'Hot'}</span>
          </div>
          <ul className="divide-y divide-gray-50 text-xs py-1">
            {categories.map((cat) => (
              <li 
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onScrollToSection('all-products');
                }}
                className="px-4 py-2 flex items-center justify-between hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition text-gray-700"
              >
                <span>{lang === 'bn' ? cat.nameBn : cat.nameEn}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </li>
            ))}
          </ul>
          {/* Mini Trust Box */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 m-2 rounded-lg border border-blue-100 text-xs">
            <p className="font-bold text-blue-900">{t.biswasPromise}</p>
            <p className="text-[11px] text-blue-700 mt-0.5">{t.biswasPromiseDesc}</p>
          </div>
        </div>

        {/* Center: Dynamic Banner Carousel Slider */}
        <div className="lg:col-span-6 relative rounded-lg overflow-hidden shadow-sm bg-gray-900 h-[280px] sm:h-[360px] group">
          {promotionalBanners.map((banner, index) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img 
                src={banner.image} 
                alt={banner.titleBn} 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-85`} />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center text-white z-20">
                <span className="inline-block bg-orange-500 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full w-max mb-3 shadow">
                  {lang === 'bn' ? banner.badgeBn : (banner.badgeEn || 'LIMITED TIME')}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold leading-tight mb-2 max-w-md">
                  {lang === 'bn' ? banner.titleBn : (banner.titleEn || banner.titleBn)}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 mb-4 max-w-sm line-clamp-2">
                  {lang === 'bn' ? banner.subtitleBn : (banner.subtitleEn || banner.subtitleBn)}
                </p>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      onSelectCategory(banner.categoryTarget);
                      onScrollToSection('all-products');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5"
                  >
                    {lang === 'bn' ? banner.buttonTextBn : (banner.buttonTextEn || 'Shop Now')}
                  </button>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-xs px-3 py-2 rounded-lg flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-mono font-bold text-amber-300">{banner.code}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Prev / Next Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm z-30 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm z-30 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
            {promotionalBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-orange-500 w-6' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Trust & Daily Cards */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
          
          <div 
            onClick={onOpenVouchers}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-4 text-white shadow-sm cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                {t.specialVoucher}
              </span>
              <Gift className="w-4 h-4 text-amber-200 animate-bounce" />
            </div>
            <h3 className="font-bold text-base mt-2">
              {activePromoVoucher?.titleBn || t.todayDiscount}
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              {t.voucherCodeLabel} <strong className="bg-white text-orange-600 px-1.5 py-0.5 rounded font-mono shadow-xs">{activePromoVoucher?.code || 'BISWAS10'}</strong>
            </p>
            <p className="text-[11px] text-white/80 mt-1">
              {activePromoVoucher?.descriptionBn || t.voucherSub}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm space-y-2.5 text-xs text-gray-700">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-full bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.trust1Title}</p>
                <p className="text-[11px] text-gray-500">{t.trust1Desc}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.trust2Title}</p>
                <p className="text-[11px] text-gray-500">{t.trust2Desc}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-full bg-orange-50 text-orange-600">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.trust3Title}</p>
                <p className="text-[11px] text-gray-500">{t.trust3Desc}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-full bg-purple-50 text-purple-600">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.trust4Title}</p>
                <p className="text-[11px] text-gray-500">{t.trust4Desc}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
