import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Smartphone, Radio, X } from 'lucide-react';

export function Navbar({ 
  lang, 
  setLang,
  searchQuery, 
  setSearchQuery, 
  cartItems, 
  onOpenCart, 
  wishlist, 
  onOpenWishlist, 
  onSelectCategory,
  onOpenProductDetail,
  allProducts,
  t
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const searchRef = useRef(null);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultSuggestions = lang === 'bn'
    ? ["Samsung Galaxy S24 Ultra", "Apple AirPods Pro", "65W GaN ফাস্ট চার্জার", "Redmi Note 13 Pro", "JBL Bluetooth Speaker", "WiFi CCTV ক্যামেরা"]
    : ["Samsung Galaxy S24 Ultra", "Apple AirPods Pro", "65W GaN Fast Charger", "Redmi Note 13 Pro", "JBL Bluetooth Speaker", "WiFi CCTV Camera"];

  const suggestions = searchQuery.trim() === '' 
    ? defaultSuggestions
    : allProducts
        .filter(p => p.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) || p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo - বিশ্বাস টেলিকম & ইলেকট্রনিক্স */}
        <div 
          onClick={() => { setSearchQuery(''); onSelectCategory(null); }}
          className="cursor-pointer flex items-center space-x-2.5 flex-shrink-0 group"
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-700 via-indigo-600 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition duration-200">
            <Smartphone className="w-6 h-6 stroke-[2.2]" />
            <Radio className="w-3.5 h-3.5 -ml-1 text-orange-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 group-hover:text-blue-700 transition">
                {t.brandName1} <span className="text-orange-600">{t.brandName2}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 -mt-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {t.brandSubtitle}
              </span>
              <span className="text-[9px] bg-orange-100 text-orange-700 font-semibold px-1 rounded">
                {t.officialBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="flex items-center rounded-lg bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500 border border-gray-200 focus-within:border-transparent transition overflow-hidden">
            <div className="pl-3.5 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={t.searchPlaceholder}
              className="w-full py-2.5 px-3 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm px-5 py-2.5 transition flex items-center justify-center flex-shrink-0"
            >
              {t.searchBtn}
            </button>
          </div>

          {/* Autocomplete / Suggested Searches Dropdown */}
          {isFocused && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span>{searchQuery ? t.matchingProducts : t.popularSearches}</span>
                <span className="text-orange-600 font-normal">{t.quickFind}</span>
              </div>
              <div className="py-1 max-h-72 overflow-y-auto">
                {searchQuery.trim() === '' ? (
                  suggestions.map((text, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(text);
                        setIsFocused(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center space-x-2 transition"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      <span>{text}</span>
                    </button>
                  ))
                ) : suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onOpenProductDetail(item);
                        setIsFocused(false);
                      }}
                      className="px-3.5 py-2 hover:bg-orange-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={item.images[0]} alt={item.titleBn} className="w-9 h-9 object-cover rounded border" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {lang === 'bn' ? item.titleBn : item.titleEn}
                          </p>
                          <span className="text-xs text-orange-600 font-bold">৳{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                        {item.brand}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {t.noProductsFoundSearch}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons: Wishlist & Cart */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          
          {/* Dual Language Switcher in Sticky Navbar */}
          {setLang && (
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs shadow-xs">
              <button 
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                  lang === 'bn' 
                    ? 'bg-orange-600 text-white shadow-xs' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
                title="বাংলা ভাষা নির্বাচন করুন"
              >
                <span>🇧🇩 বাংলা</span>
              </button>
              <button 
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                  lang === 'en' 
                    ? 'bg-orange-600 text-white shadow-xs' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
                title="Select English Language"
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
          )}

          {/* Wishlist Button */}
          <button 
            onClick={onOpenWishlist}
            className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition"
            title={t.wishlistTooltip}
          >
            <Heart className="w-6 h-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button with Hover Preview */}
          <div 
            className="relative"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <button 
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3.5 py-2 rounded-lg border border-orange-200 transition font-medium"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-bold text-sm">
                ৳{formatPrice(cartTotal)}
              </span>
            </button>

            {/* Hover Cart Preview Popover */}
            {showCartPreview && cartItems.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                <div className="flex justify-between items-center pb-2 border-b text-xs font-semibold text-gray-700">
                  <span>{t.cartPreviewTitle} ({cartCount})</span>
                  <span className="text-orange-600 font-bold">{t.cartPreviewTotal}: ৳{formatPrice(cartTotal)}</span>
                </div>
                <div className="max-h-48 overflow-y-auto py-2 space-y-2">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 text-xs">
                      <img src={item.images[0]} alt={item.titleBn} className="w-10 h-10 object-cover rounded border flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {lang === 'bn' ? item.titleBn : item.titleEn}
                        </p>
                        <p className="text-gray-500">{item.quantity} x ৳{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-center text-[11px] text-gray-400">
                      {t.moreItems.replace('{count}', cartItems.length - 3)}
                    </p>
                  )}
                </div>
                <button 
                  onClick={onOpenCart}
                  className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2 rounded-lg transition"
                >
                  {t.viewCartBtn}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
