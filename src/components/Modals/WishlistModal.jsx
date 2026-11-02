import React from 'react';
import { X, Heart, Trash2, ShoppingCart } from 'lucide-react';

export function WishlistModal({ isOpen, onClose, wishlist, onRemoveFromWishlist, onAddToCart, onOpenProductDetail, lang, t }) {
  if (!isOpen) return null;

  const formatPrice = (amount) => {
    return lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 relative animate-scaleUp max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              {t.wishlistTitle} ({wishlist.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div 
                key={item.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition"
              >
                <img 
                  src={item.images[0]} 
                  alt={item.titleBn} 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onOpenProductDetail(item);
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      onClose();
                      onOpenProductDetail(item);
                    }}
                    className="text-xs sm:text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-orange-600 transition"
                  >
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-extrabold text-orange-600">
                      ৳{formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAddToCart(item)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.addToCartShort}</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <Heart className="w-12 h-12 mx-auto text-gray-300" />
              <p className="text-sm font-medium">{t.emptyWishlistTitle}</p>
              <p className="text-xs text-gray-400">{t.emptyWishlistDesc}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
