import React, { useState } from 'react';
import { X, MapPin, Truck, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  checkoutSummary, 
  onConfirmOrder,
  currentUser,
  lang,
  t 
}) {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState(currentUser?.name || (lang === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed'));
  const [phone, setPhone] = useState(currentUser?.phone || '+8801723152730');
  const [district, setDistrict] = useState('ঢাকা');
  const [thana, setThana] = useState('মিরপুর-১০');
  const [address, setAddress] = useState('বাসা # ১২, রোড # ৪, মিরপুর');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [bkashNumber, setBkashNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCost = deliveryType === 'express' ? 120 : (district === 'ঢাকা' ? 60 : 120);
  const finalTotal = checkoutSummary.subtotal + deliveryCost - checkoutSummary.discountAmount;

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert(lang === 'bn' ? "অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করুন।" : "Please enter your name, phone, and complete delivery address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderData = {
        orderId: `BT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        items: cartItems,
        customer: { fullName, phone, district, thana, address },
        deliveryType,
        paymentMethod,
        subtotal: checkoutSummary.subtotal,
        deliveryCost,
        discountAmount: checkoutSummary.discountAmount,
        total: finalTotal,
        status: lang === 'bn' ? "অর্ডার গৃহীত হয়েছে (Pending)" : "Order Placed (Pending)"
      };
      setIsSubmitting(false);
      onConfirmOrder(orderData);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative animate-scaleUp">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-gray-900">
              {t.checkoutTitle}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6">
          
          {/* Section 1: Customer Delivery Address */}
          <div>
            <h4 className="font-bold text-sm text-gray-800 flex items-center space-x-2 pb-2 border-b border-gray-200 mb-3">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>{t.step1Title}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'bn' ? "আপনার নাম লিখুন" : "Enter your full name"}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.phoneLabel}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+88017xxxxxxxx"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.districtLabel}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500"
                >
                  <option value="ঢাকা">{lang === 'bn' ? 'ঢাকা' : 'Dhaka'}</option>
                  <option value="চট্টগ্রাম">{lang === 'bn' ? 'চট্টগ্রাম' : 'Chittagong'}</option>
                  <option value="সিলেট">{lang === 'bn' ? 'সিলেট' : 'Sylhet'}</option>
                  <option value="রাজশাহী">{lang === 'bn' ? 'রাজশাহী' : 'Rajshahi'}</option>
                  <option value="খুলনা">{lang === 'bn' ? 'খুলনা' : 'Khulna'}</option>
                  <option value="বরিশাল">{lang === 'bn' ? 'বরিশাল' : 'Barishal'}</option>
                  <option value="রংপুর">{lang === 'bn' ? 'রংপুর' : 'Rangpur'}</option>
                  <option value="ময়মনসিংহ">{lang === 'bn' ? 'ময়মনসিংহ' : 'Mymensingh'}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.thanaLabel}</label>
                <input
                  type="text"
                  required
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  placeholder={lang === 'bn' ? "যেমন: মিরপুর, উত্তরা, ধানমন্ডি" : "e.g. Mirpur, Uttara, Gulshan"}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-semibold mb-1">{t.addressLabel}</label>
                <textarea
                  rows="2"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === 'bn' ? "রোড নম্বর, বাসা নম্বর, ফ্ল্যাট নম্বর ইত্যাদি..." : "House number, road number, flat/area details..."}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Option */}
          <div>
            <h4 className="font-bold text-sm text-gray-800 flex items-center space-x-2 pb-2 border-b border-gray-200 mb-3">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>{t.step2Title}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label 
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  deliveryType === 'standard' ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-400' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === 'standard'}
                    onChange={() => setDeliveryType('standard')}
                    className="accent-orange-600"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{t.standardHomeDelivery}</p>
                    <p className="text-[11px] text-gray-500">{t.standardDeliveryTime}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-800">৳{district === 'ঢাকা' ? 60 : 120}</span>
              </label>

              <label 
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  deliveryType === 'express' ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-400' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === 'express'}
                    onChange={() => setDeliveryType('express')}
                    className="accent-orange-600"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{t.expressHomeDelivery}</p>
                    <p className="text-[11px] text-gray-500">{t.expressDeliveryTime}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-800">৳120</span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div>
            <h4 className="font-bold text-sm text-gray-800 flex items-center space-x-2 pb-2 border-b border-gray-200 mb-3">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>{t.step3Title}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              
              <label 
                className={`p-3 rounded-xl border cursor-pointer text-center flex flex-col items-center justify-center transition ${
                  paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-400' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                />
                <span className="text-xl mb-1">💵</span>
                <span className="font-bold text-gray-800">{t.paymentCOD}</span>
                <span className="text-[10px] text-gray-500">{t.paymentCODSub}</span>
              </label>

              <label 
                className={`p-3 rounded-xl border cursor-pointer text-center flex flex-col items-center justify-center transition ${
                  paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-400' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={paymentMethod === 'bkash'} 
                  onChange={() => setPaymentMethod('bkash')} 
                />
                <span className="text-xl mb-1 font-bold text-pink-600">bKash</span>
                <span className="font-bold text-gray-800">{t.paymentBkash}</span>
                <span className="text-[10px] text-pink-600">{t.paymentBkashSub}</span>
              </label>

              <label 
                className={`p-3 rounded-xl border cursor-pointer text-center flex flex-col items-center justify-center transition ${
                  paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-400' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={paymentMethod === 'nagad'} 
                  onChange={() => setPaymentMethod('nagad')} 
                />
                <span className="text-xl mb-1 font-bold text-orange-600">{lang === 'bn' ? 'নগদ' : 'Nagad'}</span>
                <span className="font-bold text-gray-800">{t.paymentNagad}</span>
                <span className="text-[10px] text-orange-600">{t.paymentNagadSub}</span>
              </label>

              <label 
                className={`p-3 rounded-xl border cursor-pointer text-center flex flex-col items-center justify-center transition ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')} 
                />
                <span className="text-xl mb-1">💳</span>
                <span className="font-bold text-gray-800">{t.paymentCard}</span>
                <span className="text-[10px] text-gray-500">{t.paymentCardSub}</span>
              </label>

            </div>

            {paymentMethod === 'bkash' && (
              <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs space-y-2">
                <p className="font-bold text-pink-900">{t.bkashGuide}</p>
                <p className="text-pink-800">{t.bkashMerchantNum} <strong className="font-mono text-sm">01723152730</strong></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <input
                    type="tel"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder={t.yourBkashNum}
                    className="p-2 bg-white border border-pink-300 rounded text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder={t.trxIdPlaceholder}
                    className="p-2 bg-white border border-pink-300 rounded text-xs outline-none uppercase font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary Breakdown */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>{t.productCountLabel}</span>
              <span>{cartItems.length} {t.itemUnit}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t.subtotalLabel}</span>
              <span>৳{formatPrice(checkoutSummary.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t.deliveryFeeLabel}</span>
              <span>৳{formatPrice(deliveryCost)}</span>
            </div>
            {checkoutSummary.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{t.voucherDiscountLabel}</span>
                <span>-৳{formatPrice(checkoutSummary.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>{t.grandTotalLabel}</span>
              <span className="text-orange-600 text-lg">৳{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/25"
            >
              {isSubmitting ? (
                <span>{t.orderProcessingSubmit}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.confirmOrderSubmit}</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              {t.orderAlertSMS}
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
