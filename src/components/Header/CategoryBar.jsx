import React, { useState, useMemo } from 'react';
import { 
  Menu, 
  ChevronRight, 
  Flame, 
  Zap, 
  Tag, 
  Award, 
  Smartphone, 
  Headphones, 
  Watch, 
  Shield, 
  Camera, 
  Tv, 
  RotateCw,
  BookOpen,
  Utensils,
  Coffee,
  Cpu,
  ShoppingBag,
  Shirt
} from 'lucide-react';
import { categories } from '../../data/categories';

export function CategoryBar({ 
  lang, 
  selectedCategory, 
  onSelectCategory, 
  onScrollToSection, 
  onOpenAdmin, 
  onOpenVouchers,
  allProducts = [],
  t 
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const allCategoryList = useMemo(() => {
    const defaultIds = new Set(categories.map(c => c.id));
    const customList = [];
    (allProducts || []).forEach(p => {
      if (p.category && !defaultIds.has(p.category) && !customList.some(c => c.id === p.category)) {
        customList.push({
          id: p.category,
          nameBn: p.category,
          nameEn: p.category,
          icon: "ShoppingBag",
          subcategories: [
            {
              titleBn: "সকল পণ্য",
              titleEn: "All Items",
              items: [p.titleBn || p.titleEn]
            }
          ]
        });
      }
    });
    return [...categories, ...customList];
  }, [allProducts]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'Headphones': return <Headphones className="w-4 h-4 text-purple-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Watch': return <Watch className="w-4 h-4 text-emerald-500" />;
      case 'Shield': return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'Camera': return <Camera className="w-4 h-4 text-rose-500" />;
      case 'Tv': return <Tv className="w-4 h-4 text-cyan-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-pink-500" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-orange-500" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-yellow-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-sky-500" />;
      default: return <Smartphone className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left: Mega Category Button with Flyout Menu */}
        <div 
          className="relative"
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          <button 
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-5 py-2.5 font-bold text-sm tracking-wide shadow-sm hover:from-blue-800 hover:to-indigo-800 transition"
          >
            <Menu className="w-5 h-5" />
            <span>{t.allCategories}</span>
          </button>

          {/* Cascading Mega Dropdown */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 w-64 bg-white shadow-2xl border border-gray-200 z-50 flex">
              <ul className="w-64 py-2 text-sm divide-y divide-gray-50">
                {allCategoryList.map((cat) => (
                  <li 
                    key={cat.id}
                    onMouseEnter={() => setActiveCategory(cat)}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsCategoryOpen(false);
                    }}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition ${
                      activeCategory?.id === cat.id ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {getIcon(cat.icon)}
                      <span className="text-xs sm:text-sm">{lang === 'bn' ? cat.nameBn : cat.nameEn}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </li>
                ))}
              </ul>

              {activeCategory && (
                <div className="w-80 bg-white border-l border-gray-100 p-4 shadow-inner hidden md:block">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider pb-2 border-b border-gray-100 mb-3">
                    {lang === 'bn' ? activeCategory.nameBn : activeCategory.nameEn}
                  </h4>
                  <div className="space-y-4">
                    {activeCategory.subcategories.map((sub, idx) => (
                      <div key={idx}>
                        <p className="text-xs font-bold text-gray-800 mb-1.5 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block"></span>
                          <span>{lang === 'bn' ? sub.titleBn : sub.titleEn}</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.items.map((item, itemIdx) => (
                            <span 
                              key={itemIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCategory(activeCategory.id);
                                setIsCategoryOpen(false);
                              }}
                              className="text-[11px] bg-gray-50 hover:bg-orange-100 hover:text-orange-700 text-gray-600 px-2 py-0.5 rounded cursor-pointer transition"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center/Right: Quick Nav Action Links */}
        <div className="flex items-center space-x-1 sm:space-x-4 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar py-2">
          
          <button 
            onClick={() => onScrollToSection('flash-sale')}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
          >
            <Flame className="w-4 h-4 text-red-500 animate-bounce" />
            <span>{t.flashSale}</span>
          </button>

          <button 
            onClick={() => {
              onSelectCategory(null);
              onScrollToSection('all-products');
            }}
            className="flex items-center space-x-1 text-blue-700 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t.expressMart}</span>
          </button>

          <button 
            onClick={onOpenVouchers}
            className="flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded hover:bg-emerald-50 transition"
          >
            <Tag className="w-4 h-4 text-emerald-500" />
            <span>{t.megaVouchers}</span>
          </button>

          <button 
            onClick={() => onScrollToSection('brands')}
            className="flex items-center space-x-1 text-purple-700 hover:text-purple-800 px-2 py-1 rounded hover:bg-purple-50 transition"
          >
            <Award className="w-4 h-4 text-purple-500" />
            <span>{t.officialBrands}</span>
          </button>

          <button 
            onClick={() => alert(lang === 'bn' ? "মোবাইল রিচার্জ সেবা: ডায়াল করুন +8801723152730" : "Mobile recharge service: Dial +8801723152730")}
            className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-orange-600 px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            <RotateCw className="w-4 h-4 text-gray-500" />
            <span>{t.recharge}</span>
          </button>

        </div>

        {/* Highlight Tag */}
        <div className="hidden xl:flex items-center space-x-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{t.dhakaDeliveryTag}</span>
        </div>

      </div>
    </nav>
  );
}
