import React, { useState } from 'react';
import { X, Search, Truck, AlertCircle } from 'lucide-react';

export function OrderTrackingModal({ isOpen, onClose, orders, initialOrderId, lang, t }) {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [foundOrder, setFoundOrder] = useState(
    initialOrderId ? orders.find(o => o.orderId === initialOrderId) : (orders[0] || null)
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const order = orders.find(o => o.orderId.toLowerCase() === searchId.trim().toLowerCase());
    setFoundOrder(order || null);
  };

  const currentStep = 3;

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 sm:p-6 relative animate-scaleUp">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              {t.trackingTitle}
            </h3>
            <p className="text-xs text-gray-500">{t.trackingSubtitle}</p>
          </div>
        </div>

        {/* Search Order ID Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={t.trackingInputPlaceholder}
            className="flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono uppercase outline-none focus:bg-white focus:border-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.searchTrackingBtn}</span>
          </button>
        </form>

        {foundOrder ? (
          <div className="space-y-6">
            
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900 text-sm">{foundOrder.orderId}</p>
                <p className="text-gray-500 mt-0.5">{t.orderDateLabel} {foundOrder.date}</p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                  {foundOrder.status}
                </span>
                <p className="text-orange-600 font-black mt-1 text-sm">৳{formatPrice(foundOrder.total)}</p>
              </div>
            </div>

            {/* Step-by-Step Visual Timeline */}
            <div>
              <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-4">
                {t.deliveryProgressLabel}
              </h4>

              <div className="relative flex justify-between">
                <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 z-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  />
                </div>

                <div className="flex flex-col items-center relative z-10 text-center w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep >= 1 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-200 text-gray-500'
                  }`}>
                    ✓
                  </div>
                  <p className="text-[11px] font-bold mt-2 text-gray-800">{t.stepPlaced}</p>
                  <p className="text-[9px] text-gray-400">{t.stepPlacedSub}</p>
                </div>

                <div className="flex flex-col items-center relative z-10 text-center w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep >= 2 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-200 text-gray-500'
                  }`}>
                    ✓
                  </div>
                  <p className="text-[11px] font-bold mt-2 text-gray-800">{t.stepProcessing}</p>
                  <p className="text-[9px] text-gray-400">{t.stepProcessingSub}</p>
                </div>

                <div className="flex flex-col items-center relative z-10 text-center w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep >= 3 ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' : 'bg-gray-200 text-gray-500'
                  }`}>
                    🚚
                  </div>
                  <p className="text-[11px] font-bold mt-2 text-blue-700">{t.stepShipped}</p>
                  <p className="text-[9px] text-gray-400">{t.stepShippedSub}</p>
                </div>

                <div className="flex flex-col items-center relative z-10 text-center w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    🏠
                  </div>
                  <p className="text-[11px] font-bold mt-2 text-gray-400">{t.stepDelivered}</p>
                  <p className="text-[9px] text-gray-400">{t.stepDeliveredSub}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs space-y-1">
              <p className="font-bold text-gray-800">{lang === 'bn' ? 'ডেলিভারি ঠিকানা ও গ্রহীতা:' : 'Delivery Address & Recipient:'}</p>
              <p className="text-gray-700">
                {lang === 'bn' ? 'নাম: ' : 'Name: '}<strong>{foundOrder.customer.fullName}</strong> | {lang === 'bn' ? 'মোবাইল: ' : 'Phone: '}{foundOrder.customer.phone}
              </p>
              <p className="text-gray-600">{foundOrder.customer.address}, {foundOrder.customer.thana}, {foundOrder.customer.district}</p>
            </div>

          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-600 font-medium">{t.orderNotFoundTitle}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{t.orderNotFoundSub}</p>
          </div>
        )}

      </div>
    </div>
  );
}
