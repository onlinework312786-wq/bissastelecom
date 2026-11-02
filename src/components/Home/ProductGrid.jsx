import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowUpDown } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { categories } from '../../data/categories';

export function ProductGrid({ 
  lang, 
  products, 
  selectedCategory, 
  onSelectCategory, 
  selectedBrand,
  onSelectBrand,
  searchQuery, 
  onOpenProductDetail, 
  onAddToCart, 
  onQuickBuy,
  wishlist, 
  onToggleWishlist,
  t 
}) {
  const [sortBy, setSortBy] = useState('popular');
  const [displayCount, setDisplayCount] = useState(12);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.titleBn.toLowerCase().includes(q) || product.titleEn.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesDesc = product.descriptionBn.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => b.soldCount - a.soldCount);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, displayCount);

  const getCategoryTitle = (catId) => {
    const c = categories.find(cat => cat.id === catId);
    if (c) return lang === 'bn' ? c.nameBn : c.nameEn;
    return catId;
  };

  return (
    <section id="all-products" className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header with Title and Sorting */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
              {t.justForYouTitle}
            </h3>
            <p className="text-xs text-gray-500">
              {t.totalProductsFound.replace('{count}', filteredProducts.length)}
              {selectedCategory && ` • ${t.categoryFilterTag} ${getCategoryTitle(selectedCategory)}`}
              {selectedBrand && ` • ${t.brandFilterTag} ${selectedBrand}`}
            </p>
          </div>
        </div>

        {/* Filter / Reset & Sorting Bar */}
        <div className="flex items-center space-x-3 text-xs">
          
          {(selectedCategory || selectedBrand || searchQuery) && (
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectBrand(null);
              }}
              className="text-orange-600 hover:underline font-bold bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200"
            >
              {t.clearAllFilters}
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-medium">{t.sortByLabel}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold outline-none cursor-pointer"
            >
              <option value="popular">{t.sortPopular}</option>
              <option value="price-low">{t.sortPriceLow}</option>
              <option value="price-high">{t.sortPriceHigh}</option>
              <option value="rating">{t.sortTopRated}</option>
            </select>
          </div>

        </div>

      </div>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayedProducts.map((product) => {
              const isWishlisted = wishlist.some(item => item.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenProductDetail={onOpenProductDetail}
                  onAddToCart={onAddToCart}
                  onQuickBuy={onQuickBuy}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={onToggleWishlist}
                  lang={lang}
                  t={t}
                />
              );
            })}
          </div>

          {/* Load More Button */}
          {displayCount < sortedProducts.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setDisplayCount(prev => prev + 6)}
                className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold text-sm px-8 py-2.5 rounded-lg transition shadow-sm"
              >
                {t.loadMoreProducts.replace('{count}', sortedProducts.length - displayCount)}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-base font-medium">{t.noProductsMatch}</p>
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectBrand(null);
            }}
            className="mt-3 bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            {t.viewAllProductsBtn}
          </button>
        </div>
      )}

    </section>
  );
}
