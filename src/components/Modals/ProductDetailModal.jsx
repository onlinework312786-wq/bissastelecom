import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MapPin, 
  Check, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Zap, 
  Heart 
} from 'lucide-react';

export function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onQuickBuy,
  isWishlisted,
  onToggleWishlist,
  activePromoCode,
  lang,
  t 
}) {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [selectedSpec, setSelectedSpec] = useState(product.specs ? product.specs[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState("ঢাকা");
  const [activeTab, setActiveTab] = useState('specs');
  const [userQuestion, setUserQuestion] = useState('');
  const [qaList, setQaList] = useState(product.qa || []);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setQaList([
      ...qaList,
      { 
        q: userQuestion, 
        a: lang === 'bn' 
          ? "ধন্যবাদ! বিশ্বাস টেলিকম প্রতিনিধি শীঘ্রই উত্তর প্রদান করবেন।" 
          : "Thank you! Biswas Telecom team will answer shortly." 
      }
    ]);
    setUserQuestion('');
  };

  const handleAddToCartWithVariants = () => {
    onAddToCart({
      ...product,
      selectedColor,
      selectedSpec,
      quantity
    });
  };

  const handleBuyNowWithVariants = () => {
    onQuickBuy({
      ...product,
      selectedColor,
      selectedSpec,
      quantity
    });
  };

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative animate-scaleUp">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Content: Product Info */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-square w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              <img 
                src={activeImage} 
                alt={product.titleBn} 
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === img ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
              <button 
                onClick={() => onToggleWishlist(product)}
                className="flex items-center space-x-1.5 hover:text-red-500 transition"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isWishlisted ? (lang === 'bn' ? 'পছন্দের তালিকায় সংরক্ষিত' : 'Saved in Wishlist') : (lang === 'bn' ? 'উইশলিস্টে যুক্ত করুন' : 'Add to Wishlist')}</span>
              </button>
              <span>SKU: {product.id}</span>
            </div>
          </div>

          {/* Middle Column: Details & Variant Selection (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  {product.brand}
                </span>
                {product.offerBadge && (
                  <span className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {product.offerBadge}
                  </span>
                )}
                {product.voucherEligible && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded">
                    🏷️ {lang === 'bn' ? 'ভাউচার প্রযোজ্য' : 'Voucher Eligible'}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-1.5 leading-snug">
                {lang === 'bn' ? product.titleBn : product.titleEn}
              </h2>

              {/* Ratings */}
              <div className="flex items-center space-x-2 mt-2 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-gray-800">{product.rating}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{product.reviewsCount} {t.reviewsLabel}</span>
                <span className="text-gray-400">|</span>
                <span className="text-emerald-600 font-semibold">{product.soldCount} {t.soldLabel}</span>
              </div>
            </div>

            {/* Expiry & FEFO Info if Perishable */}
            {product.hasExpiry && product.expDate && (
              <div className="flex items-center space-x-3 text-xs p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="font-bold">📅 {lang === 'bn' ? 'উৎপাদন ও মেয়াদ:' : 'MFD & EXP:'}</span>
                {product.mfgDate && <span>MFD: {product.mfgDate}</span>}
                <span className="font-bold text-emerald-700">EXP: {product.expDate}</span>
              </div>
            )}

            {/* Price Box */}
            <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-xl">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-black text-orange-600">
                  ৳{formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ৳{formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-orange-800 mt-1">
                🎟️ {t.voucherUseText.replace('{code}', activePromoCode || 'BISWAS10')}
              </p>
            </div>

            {/* Color Variations */}
            {product.colors && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.chooseColor} <span className="text-orange-600 font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        selectedColor === color 
                          ? 'border-orange-500 bg-orange-50 text-orange-600 ring-1 ring-orange-400' 
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage / Specs Variations */}
            {product.specs && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.chooseSpec} <span className="text-orange-600 font-normal">{selectedSpec}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.specs.map((spec, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSpec(spec)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        selectedSpec === spec 
                          ? 'border-orange-500 bg-orange-50 text-orange-600 ring-1 ring-orange-400' 
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.quantityLabel}
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-200 text-gray-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-200 text-gray-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {t.inStockCount.replace('{count}', product.stock)}
                </span>
              </div>
            </div>

            {/* Add to Cart & Buy Now Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button 
                onClick={handleAddToCartWithVariants}
                className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-300 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t.addToCartModal}</span>
              </button>

              <button 
                onClick={handleBuyNowWithVariants}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-orange-600/30"
              >
                <Zap className="w-4 h-4" />
                <span>{t.buyNowModal}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Daraz Specific Delivery & Seller Box */}
          <div className="md:col-span-3 space-y-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-700">
            
            {/* Delivery Location */}
            <div>
              <p className="font-bold text-gray-800 flex items-center space-x-1 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.deliveryAddressLabel}</span>
              </p>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs text-gray-800 font-medium outline-none"
              >
                <option value="ঢাকা">{lang === 'bn' ? 'ঢাকা সিটি (Dhaka City)' : 'Dhaka City'}</option>
                <option value="চট্টগ্রাম">{lang === 'bn' ? 'চট্টগ্রাম (Chittagong)' : 'Chittagong'}</option>
                <option value="সিলেট">{lang === 'bn' ? 'সিলেট (Sylhet)' : 'Sylhet'}</option>
                <option value="রাজশাহী">{lang === 'bn' ? 'রাজশাহী (Rajshahi)' : 'Rajshahi'}</option>
                <option value="খুলনা">{lang === 'bn' ? 'খুলনা (Khulna)' : 'Khulna'}</option>
                <option value="বরিশাল">{lang === 'bn' ? 'বরিশাল (Barishal)' : 'Barishal'}</option>
                <option value="রংপুর">{lang === 'bn' ? 'রংপুর (Rangpur)' : 'Rangpur'}</option>
                <option value="ময়মনসিংহ">{lang === 'bn' ? 'ময়মনসিংহ (Mymensingh)' : 'Mymensingh'}</option>
              </select>
            </div>

            {/* Delivery Costs */}
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1 text-gray-600">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.standardDeliveryTitle}</span>
                </span>
                <span className="font-bold text-gray-900">
                  {selectedDistrict.includes("ঢাকা") ? t.deliveryFeeDhaka : t.deliveryFeeOutside}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t.codLabel}</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                  {t.availableLabel}
                </span>
              </div>
            </div>

            {/* Warranty & Returns */}
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <p className="font-bold text-gray-800">{t.serviceAndWarranty}</p>
              <div className="flex items-start space-x-1.5 text-[11px] text-gray-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-start space-x-1.5 text-[11px] text-gray-600">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{t.sevenDaysReturn}</span>
              </div>
              <div className="flex items-start space-x-1.5 text-[11px] text-gray-600">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t.genuineGuarantee}</span>
              </div>
            </div>

            {/* Seller Information */}
            <div className="pt-2 border-t border-gray-200 space-y-1">
              <p className="text-[11px] text-gray-500">{t.sellerLabel}</p>
              <p className="font-bold text-gray-900">{product.sellerName}</p>
              <p className="text-[11px] text-emerald-600 font-medium">{product.sellerRating}</p>
              <p className="text-[10px] text-gray-500">{t.shippingOnTime}</p>
            </div>

          </div>

        </div>

        {/* Modal Bottom Tabs: Specifications, Description, Reviews, Q&A */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50/50">
          
          <div className="flex border-b border-gray-200 space-x-4 sm:space-x-8 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2.5 transition border-b-2 ${
                activeTab === 'specs' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.tabSpecs}
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2.5 transition border-b-2 ${
                activeTab === 'desc' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.tabDesc}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 transition border-b-2 ${
                activeTab === 'reviews' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.tabReviews} ({product.reviews?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`pb-2.5 transition border-b-2 ${
                activeTab === 'qa' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.tabQA} ({qaList.length})
            </button>
          </div>

          <div className="pt-4 text-xs sm:text-sm text-gray-700 min-h-[160px]">
            {activeTab === 'specs' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left divide-y divide-gray-100 text-xs">
                  <tbody>
                    {Object.entries(product.specifications || {}).map(([key, value], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2.5 font-bold text-gray-800 w-1/3">{key}</td>
                        <td className="px-4 py-2.5 text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 leading-relaxed space-y-2">
                <p>{product.descriptionBn}</p>
                <p className="text-gray-500 text-xs mt-3">
                  * BTRC compliance certified genuine original mobile device.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-900">{rev.user}</span>
                        <span className="text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                        {rev.verified && (
                          <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                            {t.verifiedBuyer}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 pt-1">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-6">{t.noReviewsYet}</p>
                )}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-4">
                <form onSubmit={handleAddQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder={t.askPlaceholder}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                  >
                    {t.askBtn}
                  </button>
                </form>

                <div className="space-y-3">
                  {qaList.map((item, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                      <div className="flex items-start space-x-2 text-xs">
                        <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{t.qPrefix}</span>
                        <span className="font-semibold text-gray-800">{item.q}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-xs pl-4 border-l-2 border-orange-200">
                        <span className="font-bold text-orange-600">{t.aPrefix}</span>
                        <span className="text-gray-600">{item.a}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
