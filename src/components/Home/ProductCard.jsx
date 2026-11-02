import React from 'react';
import { Star, Heart, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';

export function ProductCard({ 
  product, 
  onOpenProductDetail, 
  onAddToCart, 
  onQuickBuy,
  isWishlisted, 
  onToggleWishlist,
  lang,
  t 
}) {
  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <div 
      onClick={() => onOpenProductDetail(product)}
      className="group bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.offerBadge && (
          <span className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
            {product.offerBadge}
          </span>
        )}
        {product.discountPercent > 0 && (
          <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
            -{product.discountPercent}%
          </span>
        )}
        {product.voucherEligible && (
          <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
            🏷️ {lang === 'bn' ? 'ভাউচার' : 'Voucher'}
          </span>
        )}
        {product.freeDelivery && (
          <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
            {t.freeDelivery}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm backdrop-blur-sm transition"
        title={t.wishlistTooltip}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="aspect-square w-full bg-gray-50 overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.titleBn} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
              {product.brand}
            </span>
            <span className="flex items-center text-emerald-600">
              <CheckCircle2 className="w-3 h-3 mr-0.5" />
              {t.inStock} ({product.stock})
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition leading-snug mb-2">
            {lang === 'bn' ? product.titleBn : product.titleEn}
          </h4>

          {/* Star Rating & Review Count */}
          <div className="flex items-center space-x-1.5 text-xs text-gray-500 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-gray-800">{product.rating}</span>
            <span className="text-[11px]">({product.reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="text-base sm:text-lg font-black text-orange-600">
              ৳{formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                ৳{formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-100">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-bold text-xs py-1.5 rounded-lg transition flex items-center justify-center space-x-1"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t.addToCartShort}</span>
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickBuy(product);
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-1.5 rounded-lg transition flex items-center justify-center space-x-1 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.buyNowShort}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
