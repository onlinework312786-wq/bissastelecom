import React, { useState, useEffect } from 'react';
import { Flame, Clock, ChevronRight, ShoppingCart } from 'lucide-react';

export function FlashSale({ 
  lang, 
  products, 
  onOpenProductDetail, 
  onAddToCart, 
  onOpenCart,
  t 
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter(p => p.isFlashSale);

  const formatNumber = (num) => num.toString().padStart(2, '0');
  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <section id="flash-sale" className="max-w-7xl mx-auto px-4 py-4">
      {/* Header Bar */}
      <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        
        <div className="flex items-center space-x-3 sm:space-x-5">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
              <Flame className="w-5 h-5 fill-red-600 animate-bounce" />
            </span>
            <h3 className="font-extrabold text-base sm:text-xl text-red-600 tracking-tight">
              {t.flashSaleTitle}
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="hidden sm:inline font-medium">
              {t.endingIn}
            </span>
            <div className="flex items-center space-x-1 font-mono font-bold text-white text-xs">
              <span className="bg-red-600 px-2 py-1 rounded shadow-sm">{formatNumber(timeLeft.hours)}</span>
              <span className="text-gray-600 font-extrabold">:</span>
              <span className="bg-red-600 px-2 py-1 rounded shadow-sm">{formatNumber(timeLeft.minutes)}</span>
              <span className="text-gray-600 font-extrabold">:</span>
              <span className="bg-red-600 px-2 py-1 rounded shadow-sm">{formatNumber(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('all-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="border border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-xs uppercase px-4 py-2 rounded-lg flex items-center space-x-1 transition"
        >
          <span>{t.shopMore}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* Flash Sale Items Grid */}
      <div className="bg-white rounded-b-xl border border-gray-200 p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {flashProducts.map((product) => {
            const soldPercent = Math.min(100, Math.round((product.soldCount / (product.stock + product.soldCount)) * 100));

            return (
              <div 
                key={product.id}
                onClick={() => onOpenProductDetail(product)}
                className="group cursor-pointer rounded-lg border border-gray-100 hover:border-orange-300 hover:shadow-lg transition p-2.5 flex flex-col justify-between bg-white relative"
              >
                <div className="absolute top-2 left-2 z-10 bg-orange-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                  -{product.discountPercent}%
                </div>

                <div className="aspect-square w-full rounded-md overflow-hidden bg-gray-50 mb-2">
                  <img 
                    src={product.images[0]} 
                    alt={product.titleBn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition mb-1 leading-tight">
                      {lang === 'bn' ? product.titleBn : product.titleEn}
                    </h4>
                    
                    <div className="mt-1">
                      <span className="text-sm font-extrabold text-orange-600">
                        ৳{formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="block text-[11px] text-gray-400 line-through">
                          ৳{formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                      <span>{t.soldPercent.replace('{percent}', soldPercent)}</span>
                      <span className="text-red-500 font-bold">{t.remainingCount.replace('{count}', product.stock)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="w-full mt-2.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-600 font-bold text-xs py-1.5 rounded transition flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t.addToCartShort}</span>
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
