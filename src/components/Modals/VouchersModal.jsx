import React from 'react';
import { X, Copy, Gift, Sparkles, Check } from 'lucide-react';
import { vouchers as defaultVouchers } from '../../data/categories';

export function VouchersModal({ isOpen, onClose, vouchers: propVouchers, onApplyVoucherDirectly, lang, t }) {
  if (!isOpen) return null;

  const voucherList = (propVouchers && propVouchers.length > 0) ? propVouchers : defaultVouchers;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(t.copiedAlert ? t.copiedAlert.replace('{code}', code) : `কোড ${code} কপি করা হয়েছে!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 relative animate-scaleUp">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-orange-600" />
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              {t.megaVouchersTitle || 'বিশ্বাস মেগা ভাউচার ও ছাড়'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vouchers List */}
        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {voucherList.map((v, idx) => (
            <div 
              key={v.id || v.code || idx}
              className={`p-4 rounded-xl border-2 border-dashed ${v.isPrimary ? 'border-orange-500 bg-orange-50/80 shadow-xs' : 'border-orange-200 bg-orange-50/40'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] bg-orange-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                    {t.offerVoucherBadge || 'অফার ভাউচার'}
                  </span>
                  {v.isPrimary && (
                    <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{lang === 'bn' ? 'প্রধান ভাউচার' : 'Featured'}</span>
                    </span>
                  )}
                  {v.discountPercent > 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      {v.discountPercent}% ছাড়
                    </span>
                  )}
                  {v.fixedDiscount > 0 && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      ৳{v.fixedDiscount} ছাড়
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-gray-900 mt-1">{v.titleBn}</h4>
                <p className="text-xs text-gray-600">{v.descriptionBn}</p>
                {v.expiryDate && (
                  <p className="text-[10px] text-gray-400">
                    {lang === 'bn' ? `মেয়াদ: ${v.expiryDate}` : `Valid till: ${v.expiryDate}`}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <span className="font-mono font-extrabold text-sm text-gray-900 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-2xs">
                  {v.code}
                </span>
                <button
                  onClick={() => {
                    copyCode(v.code);
                    if (onApplyVoucherDirectly) onApplyVoucherDirectly(v);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyBtn || 'কপি'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-gray-400 text-center">
          * {lang === 'bn' ? 'কার্ট পেইজে অথবা চেকআউটে ভাউচার কোডটি লিখে অ্যাপ্লাই করুন।' : 'Apply voucher code in cart or checkout for instant discount.'}
        </p>

      </div>
    </div>
  );
}
