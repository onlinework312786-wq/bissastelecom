import React, { useMemo } from 'react';
import { Award, Layers, Sparkles } from 'lucide-react';
import { brands, categoryBrandMap, categories } from '../../data/categories';

export function BrandShowcase({ 
  lang, 
  onSelectBrand, 
  selectedBrand, 
  selectedCategory, 
  products = [], 
  t 
}) {
  // Dynamically compute brands matching selected category or existing products
  const displayedBrands = useMemo(() => {
    if (!selectedCategory) {
      return brands;
    }

    // 1. Get brands mapped to this category from categoryBrandMap
    const mappedBrandNames = (categoryBrandMap[selectedCategory] || []).map(b => b.toLowerCase());
    
    // 2. Get brands present in active products of this category
    const productBrands = (products || [])
      .filter(p => p.category === selectedCategory && p.brand)
      .map(p => p.brand);

    const activeBrandSet = new Set([...mappedBrandNames, ...productBrands.map(b => b.toLowerCase())]);

    // Find official brands matching this category
    const matchedOfficialBrands = brands.filter(b => 
      activeBrandSet.has(b.id.toLowerCase()) || 
      activeBrandSet.has(b.name.toLowerCase())
    );

    // Include any custom brands created by user in this category
    const existingNames = new Set(matchedOfficialBrands.map(b => b.name.toLowerCase()));
    const customBrandCards = Array.from(new Set(productBrands))
      .filter(name => !existingNames.has(name.toLowerCase()))
      .map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        logoText: name.length > 8 ? name.slice(0, 8).toUpperCase() : name.toUpperCase(),
        origin: "Authentic Store",
        discount: lang === 'bn' ? 'অফিসিয়াল প্রোডাক্ট' : 'Official Product'
      }));

    const combined = [...matchedOfficialBrands, ...customBrandCards];
    return combined.length > 0 ? combined : brands;
  }, [selectedCategory, products, lang]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);
  const activeCategoryTitle = activeCategoryObj 
    ? (lang === 'bn' ? activeCategoryObj.nameBn : activeCategoryObj.nameEn)
    : selectedCategory;

  return (
    <section id="brands" className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                {t.brandShowcaseTitle}
                {selectedCategory && (
                  <span className="text-xs font-semibold text-purple-700 ml-2 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    ({activeCategoryTitle})
                  </span>
                )}
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold border border-purple-200">
              {t.authentic100}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {selectedBrand && (
              <button 
                onClick={() => onSelectBrand(null)}
                className="text-xs text-orange-600 hover:underline font-semibold"
              >
                {t.viewAllBrands}
              </button>
            )}
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {displayedBrands.map((brand) => {
            const isSelected = selectedBrand?.toLowerCase() === brand.id.toLowerCase() ||
                               selectedBrand?.toLowerCase() === brand.name.toLowerCase();

            return (
              <div
                key={brand.id || brand.name}
                onClick={() => onSelectBrand(isSelected ? null : (brand.name || brand.id))}
                className={`cursor-pointer rounded-xl p-3 border transition text-center flex flex-col items-center justify-between hover:shadow-md ${
                  isSelected 
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400' 
                    : 'border-gray-100 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="font-black text-lg sm:text-xl text-gray-800 tracking-tight my-2">
                  {brand.logoText}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-800">{brand.name}</h4>
                  <p className="text-[11px] text-orange-600 font-medium mt-0.5">
                    {lang === 'bn' ? brand.discount : 'Official Warranty'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
