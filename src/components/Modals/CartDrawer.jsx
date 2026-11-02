import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle } from 'lucide-react';
import { vouchers } from '../../data/categories';

export function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout,
  appliedVoucher,
  setAppliedVoucher,
  vouchers: propVouchers,
  lang,
  t 
}) {
  if (!isOpen) return null;

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  const availableVouchers = (propVouchers && propVouchers.length > 0) ? propVouchers : vouchers;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let deliveryFee = subtotal > 5000 || subtotal === 0 ? 0 : 60;
  if (appliedVoucher?.code === 'FREE60' || (appliedVoucher?.fixedDiscount >= 60 && appliedVoucher?.discountPercent === 0)) {
    deliveryFee = 0;
  }

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent > 0) {
      discountAmount = Math.min(appliedVoucher.maxDiscount || 9999, Math.round((subtotal * appliedVoucher.discountPercent) / 100));
    } else if (appliedVoucher.fixedDiscount) {
      discountAmount = appliedVoucher.fixedDiscount;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherInput.trim().toUpperCase();
    const found = availableVouchers.find(v => v.code.toUpperCase() === code);
    if (!found) {
      setVoucherError(lang === 'bn' 
        ? `ভুল ভাউচার কোড! সঠিক কোড লিখুন (যেমন: ${availableVouchers[0]?.code || 'BISWAS10'})` 
        : `Invalid voucher code! Please enter a valid code (e.g. ${availableVouchers[0]?.code || 'BISWAS10'})`);
      return;
    }
    if (subtotal < (found.minSpend || 0)) {
      setVoucherError(lang === 'bn' ? `এই ভাউচারটির জন্য ন্যূনতম ৳${found.minSpend} টাকার কেনাকাটা প্রয়োজন।` : `Minimum spend of ৳${found.minSpend} required for this voucher.`);
      return;
    }
    setAppliedVoucher(found);
    setVoucherInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-base text-gray-900">
                {t.cartTitle} ({cartItems.length})
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-gray-100">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex space-x-3 items-center">
                  <img 
                    src={item.images[0]} 
                    alt={item.titleBn} 
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                      {lang === 'bn' ? item.titleBn : item.titleEn}
                    </h4>
                    {(item.selectedColor || item.selectedSpec) && (
                      <p className="text-[11px] text-gray-500">
                        {item.selectedColor && `${lang === 'bn' ? 'কালার' : 'Color'}: ${item.selectedColor}`}
                        {item.selectedSpec && ` | ${item.selectedSpec}`}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-bold text-orange-600">
                        ৳{formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center space-x-1.5 border border-gray-200 rounded-md bg-gray-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2 text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm font-medium">{t.emptyCartTitle}</p>
                <p className="text-xs text-gray-400">{t.emptyCartDesc}</p>
              </div>
            )}
          </div>

          {/* Footer Area */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              
              {/* Voucher Input */}
              <form onSubmit={handleApplyVoucher} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder={t.voucherInputPlaceholder}
                      className="w-full pl-8 pr-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs outline-none uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    {t.applyVoucherBtn}
                  </button>
                </div>
                {voucherError && <p className="text-[11px] text-red-600">{voucherError}</p>}
                {appliedVoucher && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{t.voucherActive.replace('{code}', appliedVoucher.code).replace('{amount}', formatPrice(discountAmount))}</span>
                  </p>
                )}
              </form>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>{t.subtotalLabel}</span>
                  <span className="font-semibold text-gray-800">৳{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.deliveryFeeLabel}</span>
                  <span className="font-semibold text-gray-800">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">{t.freeText}</strong> : `৳${deliveryFee}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t.voucherDiscountLabel}</span>
                    <span>-৳{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t.grandTotalLabel}</span>
                  <span className="text-orange-600 text-base">৳{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout({
                    subtotal,
                    deliveryFee,
                    discountAmount,
                    grandTotal
                  });
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20"
              >
                <span>{t.checkoutProceedBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
