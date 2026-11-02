import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/products';
import { translations } from './data/translations';
import { vouchers as initialVouchers } from './data/categories';

// Components
import { TopBar } from './components/Header/TopBar';
import { Navbar } from './components/Header/Navbar';
import { CategoryBar } from './components/Header/CategoryBar';
import { WelcomeBanner } from './components/Home/WelcomeBanner';
import { HeroSection } from './components/Home/HeroSection';
import { FeatureChannels } from './components/Home/FeatureChannels';
import { FlashSale } from './components/Home/FlashSale';
import { BrandShowcase } from './components/Home/BrandShowcase';
import { ProductGrid } from './components/Home/ProductGrid';
import { Footer } from './components/Footer/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';

// Modals
import { ProductDetailModal } from './components/Modals/ProductDetailModal';
import { CartDrawer } from './components/Modals/CartDrawer';
import { CheckoutModal } from './components/Modals/CheckoutModal';
import { OrderSuccessModal } from './components/Modals/OrderSuccessModal';
import { OrderTrackingModal } from './components/Modals/OrderTrackingModal';
import { WishlistModal } from './components/Modals/WishlistModal';
import { VouchersModal } from './components/Modals/VouchersModal';
import { AuthModal } from './components/Modals/AuthModal';
import { AdminPanelModal } from './components/Modals/AdminPanelModal';
import { AdminAuthModal } from './components/Modals/AdminAuthModal';

export default function App() {
  // Force App Version for clean translation sync
  const APP_VERSION = '2026.11.02_bn_v3';

  // Language State: strictly default to 'bn' (Bengali)
  const [lang, setLang] = useState(() => {
    try {
      const savedVer = localStorage.getItem('bt_version');
      if (savedVer !== APP_VERSION) {
        localStorage.setItem('bt_version', APP_VERSION);
        localStorage.setItem('bt_lang', 'bn');
        return 'bn';
      }
      return localStorage.getItem('bt_lang') || 'bn';
    } catch {
      return 'bn';
    }
  });

  const t = translations[lang] || translations.bn;

  const handleSetLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('bt_lang', newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
        document.documentElement.setAttribute('translate', 'no');
      }
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('bt_lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('translate', 'no');
      }
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, [lang]);

  // Products State with automatic titleBn synchronization
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('bt_products');
      if (!saved) return initialProducts;
      const parsed = JSON.parse(saved);
      // Ensure all products have latest Bengali titles from initialProducts
      return parsed.map(p => {
        const init = initialProducts.find(ip => ip.id === p.id);
        if (init) {
          return {
            ...p,
            titleBn: init.titleBn,
            titleEn: init.titleEn,
            buyingPrice: p.buyingPrice || init.buyingPrice,
            offerBadge: p.offerBadge || init.offerBadge,
            voucherEligible: p.voucherEligible !== undefined ? p.voucherEligible : init.voucherEligible,
            hasExpiry: p.hasExpiry !== undefined ? p.hasExpiry : init.hasExpiry,
            mfgDate: p.mfgDate || init.mfgDate,
            expDate: p.expDate || init.expDate,
            barcode: p.barcode || init.barcode
          };
        }
        return p;
      });
    } catch {
      return initialProducts;
    }
  });

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('bt_cart');
    return saved ? JSON.parse(saved) : [
      { ...initialProducts[1], quantity: 1, selectedColor: "Glossy White", selectedSpec: "USB-C MagSafe Case" }
    ];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('bt_wishlist');
    return saved ? JSON.parse(saved) : [initialProducts[0]];
  });

  // Orders State (With pre-seeded demo order)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bt_orders');
    return saved ? JSON.parse(saved) : [
      {
        orderId: "BT-2026-89421",
        date: "২৬ অক্টোবর ২০২৬",
        items: [initialProducts[0]],
        customer: {
          fullName: "তানভীর আহমেদ",
          phone: "+8801723152730",
          district: "ঢাকা",
          thana: "মিরপুর-১০",
          address: "বাসা # ১২, রোড # ৪, মিরপুর",
          note: "আসার আগে কল দিবেন।"
        },
        deliveryType: "express",
        paymentMethod: "cod",
        subtotal: 139999,
        deliveryCost: 120,
        discountAmount: 500,
        total: 139619,
        status: "কুরিয়ারে হস্তান্তর (In Transit)"
      }
    ];
  });

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Vouchers State (Configurable by Owner MD. ALIM BISSAS in Admin Panel)
  const [vouchers, setVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem('bt_vouchers');
      if (!saved) return initialVouchers;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialVouchers;
    } catch {
      return initialVouchers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bt_vouchers', JSON.stringify(vouchers));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, [vouchers]);

  const handleUpdateVouchers = (updatedList) => {
    setVouchers(updatedList);
    try {
      localStorage.setItem('bt_vouchers', JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const activePromoVoucher = vouchers.find(v => v.isPrimary) || vouchers[0] || initialVouchers[0];

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bt_user');
    return saved ? JSON.parse(saved) : { name: "তানভীর আহমেদ", phone: "+8801723152730" };
  });

  // Modals Visibility
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState({ subtotal: 0, deliveryFee: 60, discountAmount: 0, grandTotal: 0 });
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bt_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('bt_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bt_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bt_user');
    }
  }, [currentUser]);

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedColor === product.selectedColor && item.selectedSpec === product.selectedSpec);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += (product.quantity || 1);
        return updated;
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Quick Buy
  const handleQuickBuy = (product) => {
    handleAddToCart(product);
    const subtotal = product.price * (product.quantity || 1);
    const deliveryFee = subtotal > 5000 ? 0 : 60;
    setCheckoutSummary({
      subtotal,
      deliveryFee,
      discountAmount: 0,
      grandTotal: subtotal + deliveryFee
    });
    if (activeProductDetail) setActiveProductDetail(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  // Order Placement
  const handleProceedToCheckout = (summary) => {
    setCheckoutSummary(summary);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = (orderData) => {
    setOrders(prev => [orderData, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setPlacedOrder(orderData);
  };

  // Tracking Action
  const handleOpenTrackingWithId = (orderId) => {
    setTrackingOrderId(orderId);
    setIsTrackingOpen(true);
  };

  // Admin Handlers
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Admin Access Handler - strictly owner protected
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-gray-800">
      
      {/* 1. TOP NOTICE & UTILITY BAR */}
      <TopBar 
        lang={lang}
        setLang={handleSetLang}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onOpenTracking={() => {
          setTrackingOrderId('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={handleOpenAdmin}
        t={t}
      />

      {/* 2. MAIN BRANDED NAVBAR WITH SEARCH & CART */}
      <Navbar 
        lang={lang}
        setLang={handleSetLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        wishlist={wishlist}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectCategory={setSelectedCategory}
        onOpenProductDetail={setActiveProductDetail}
        allProducts={products}
        t={t}
      />

      {/* 3. CASCADING CATEGORY NAVIGATION & QUICK ACTION LINKS */}
      <CategoryBar 
        lang={lang}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          handleScrollToSection('all-products');
        }}
        onScrollToSection={handleScrollToSection}
        onOpenAdmin={handleOpenAdmin}
        onOpenVouchers={() => setIsVouchersOpen(true)}
        allProducts={products}
        t={t}
      />

      {/* MAIN BODY CONTENT */}
      <main className="flex-1">
        
        {/* BEAUTIFUL WELCOME HERO BANNER */}
        <WelcomeBanner 
          lang={lang}
          onScrollToSection={handleScrollToSection}
          t={t}
        />

        {/* HERO SECTION */}
        <HeroSection 
          lang={lang}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            handleScrollToSection('all-products');
          }}
          onOpenVouchers={() => setIsVouchersOpen(true)}
          onScrollToSection={handleScrollToSection}
          activePromoVoucher={activePromoVoucher}
          t={t}
        />

        {/* DARAZ-STYLE FEATURE CHANNELS */}
        <FeatureChannels 
          lang={lang}
          onScrollToSection={handleScrollToSection}
          onOpenVouchers={() => setIsVouchersOpen(true)}
          t={t}
        />

        {/* SIGNATURE FLASH SALE WITH COUNTDOWN & PROGRESS BAR */}
        <FlashSale 
          lang={lang}
          products={products}
          onOpenProductDetail={setActiveProductDetail}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          t={t}
        />

        {/* OFFICIAL BRAND STORES */}
        <BrandShowcase 
          lang={lang}
          onSelectBrand={(brandId) => {
            setSelectedBrand(brandId);
            handleScrollToSection('all-products');
          }}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          products={products}
          t={t}
        />

        {/* JUST FOR YOU (আপনার জন্য পণ্য) */}
        <ProductGrid 
          lang={lang}
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          searchQuery={searchQuery}
          onOpenProductDetail={setActiveProductDetail}
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          t={t}
        />

      </main>

      {/* SINGLE COMPLETE FOOTER WITH USER CREDITS AND WHATSAPP */}
      <Footer lang={lang} t={t} />

      {/* FLOATING DIRECT WHATSAPP CHAT BUTTON */}
      <WhatsAppWidget lang={lang} translations={t} />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Product Detail Modal */}
      {activeProductDetail && (
        <ProductDetailModal 
          product={activeProductDetail}
          onClose={() => setActiveProductDetail(null)}
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
          isWishlisted={wishlist.some(item => item.id === activeProductDetail.id)}
          onToggleWishlist={handleToggleWishlist}
          activePromoCode={activePromoVoucher?.code || 'BISWAS10'}
          lang={lang}
          t={t}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        appliedVoucher={appliedVoucher}
        setAppliedVoucher={setAppliedVoucher}
        vouchers={vouchers}
        lang={lang}
        t={t}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        checkoutSummary={checkoutSummary}
        onConfirmOrder={handleConfirmOrder}
        currentUser={currentUser}
        lang={lang}
        t={t}
      />

      {/* Order Success Confirmation Modal */}
      {placedOrder && (
        <OrderSuccessModal 
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
          onTrackOrder={handleOpenTrackingWithId}
          lang={lang}
          t={t}
        />
      )}

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal 
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderId={trackingOrderId}
        lang={lang}
        t={t}
      />

      {/* Wishlist Modal */}
      <WishlistModal 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={setActiveProductDetail}
        lang={lang}
        t={t}
      />

      {/* Vouchers Modal */}
      <VouchersModal 
        isOpen={isVouchersOpen}
        onClose={() => setIsVouchersOpen(false)}
        vouchers={vouchers}
        onApplyVoucherDirectly={(voucher) => {
          setAppliedVoucher(voucher);
          setIsVouchersOpen(false);
          setIsCartOpen(true);
        }}
        lang={lang}
        t={t}
      />

      {/* User Login / Profile Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        userOrders={orders}
        onTrackOrder={handleOpenTrackingWithId}
        lang={lang}
        t={t}
      />

      {/* Seller & Admin Panel Modal */}
      <AdminPanelModal 
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setIsAdminAuthenticated(false); // Relock upon closing for security
        }}
        products={products}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        vouchers={vouchers}
        onUpdateVouchers={handleUpdateVouchers}
        lang={lang}
        t={t}
      />

      {/* Owner-Only Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
        lang={lang}
        t={t}
      />

    </div>
  );
}
