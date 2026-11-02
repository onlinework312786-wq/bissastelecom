import React from 'react';
import { CheckCircle, Truck, Copy, PhoneCall } from 'lucide-react';

export function OrderSuccessModal({ order, onClose, onTrackOrder, lang, t }) {
  if (!order) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    alert((lang === 'bn' ? "অর্ডার আইডি কপি করা হয়েছে: " : "Order ID copied: ") + order.orderId);
  };

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-scaleUp">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-1">
          {t.orderSuccessTitle}
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          {t.orderSuccessDesc}
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-left space-y-2 text-xs mb-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-500">{t.orderIdLabel}</span>
            <div className="flex items-center space-x-1">
              <span className="font-mono font-bold text-orange-600 text-sm">{order.orderId}</span>
              <button onClick={copyOrderId} className="text-gray-400 hover:text-gray-600 p-1">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>{t.custNameLabel}</span>
            <span className="font-bold">{order.customer.fullName}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>{t.custPhoneLabel}</span>
            <span className="font-mono">{order.customer.phone}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>{t.paymentMethodLabel}</span>
            <span className="font-bold text-blue-700 uppercase">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between text-gray-700 pt-1 border-t border-gray-200">
            <span>{t.totalPayableLabel}</span>
            <span className="font-black text-orange-600 text-sm">৳{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.orderId);
            }}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>{t.trackOrderBtn}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2.5 rounded-xl transition"
          >
            {t.continueShoppingBtn}
          </button>
        </div>

        {/* Helpline note */}
        <div className="mt-4 pt-3 border-t text-[11px] text-gray-400 flex items-center justify-center space-x-1">
          <PhoneCall className="w-3.5 h-3.5 text-gray-500" />
          <span>{t.hotlineContact}</span>
        </div>

      </div>
    </div>
  );
}
