import React, { useState } from 'react';
import { 
  X, Plus, Package, ShoppingCart, DollarSign, TrendingUp, Trash2, 
  UploadCloud, Image, Camera, CheckCircle, RefreshCw, KeyRound, Lock, 
  Eye, EyeOff, ShieldCheck, PenTool, Edit3, Sparkles, Barcode, Scan, 
  Calendar, AlertTriangle, ShieldAlert, Award, Tag, Percent, Calculator, 
  CheckCircle2, ChevronRight, Zap, Gift, Search, ArrowRight, Clock, Ticket
} from 'lucide-react';
import { categories, categoryBrandMap } from '../../data/categories';
import { barcodeCatalog, findProductByBarcode } from '../../data/barcodeDatabase';

export function AdminPanelModal({ 
  isOpen, 
  onClose, 
  products, 
  onAddProduct, 
  onDeleteProduct, 
  orders, 
  onUpdateOrderStatus,
  vouchers = [],
  onUpdateVouchers,
  lang,
  t 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('overview');

  // Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Samsung');
  const [newCategory, setNewCategory] = useState('smartphones');
  const [newStock, setNewStock] = useState('20');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [imageUploadMode, setImageUploadMode] = useState('file'); // 'file' or 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [brandMode, setBrandMode] = useState('suggested'); // 'suggested' or 'custom'

  // Pricing & Live Profit Calculation States
  const [newBuyingPrice, setNewBuyingPrice] = useState(''); // ক্রয় মূল্য (Buying / Cost Price)
  const [newOriginalPrice, setNewOriginalPrice] = useState(''); // আসল / রেগুলার গায়ের মূল্য (MRP)
  const [newDiscountPercent, setNewDiscountPercent] = useState('0'); // ছাড় / ডিসকাউন্ট %
  const [newPrice, setNewPrice] = useState(''); // গ্রাহকের বিক্রয় মূল্য (Selling Price)

  // Offer & Voucher States
  const [newOfferType, setNewOfferType] = useState('none'); // 'none' | 'flash' | 'special' | 'bogo' | 'eid' | 'gift'
  const [newOfferBadge, setNewOfferBadge] = useState('');
  const [newVoucherEligible, setNewVoucherEligible] = useState(true);

  // Perishable & Expiry Dates States
  const [hasExpiry, setHasExpiry] = useState(false);
  const [newMfgDate, setNewMfgDate] = useState('');
  const [newExpDate, setNewExpDate] = useState('');

  // Barcode & Auto-Fill States
  const [newBarcode, setNewBarcode] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScannerSimOpen, setIsScannerSimOpen] = useState(false);
  const [barcodeSuccessMsg, setBarcodeSuccessMsg] = useState('');

  // Stock Filter State
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'expiring' | 'low' | 'offers'

  // Voucher Management States
  const [quickPromoCode, setQuickPromoCode] = useState('');
  const [newVCode, setNewVCode] = useState('');
  const [newVDiscountType, setNewVDiscountType] = useState('percent'); // 'percent' | 'fixed'
  const [newVDiscountVal, setNewVDiscountVal] = useState('10');
  const [newVMinSpend, setNewVMinSpend] = useState('1500');
  const [newVMaxDiscount, setNewVMaxDiscount] = useState('500');
  const [newVTitle, setNewVTitle] = useState('');
  const [newVDesc, setNewVDesc] = useState('');
  const [newVExpDate, setNewVExpDate] = useState('২০২৬-১২-৩১');
  const [newVIsPrimary, setNewVIsPrimary] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState('');

  // Auto-calculated Profit values
  const buyingNum = parseInt(newBuyingPrice) || 0;
  const sellingNum = parseInt(newPrice) || 0;
  const origNum = parseInt(newOriginalPrice) || sellingNum;
  const stockNum = parseInt(newStock) || 0;
  const unitProfit = sellingNum - buyingNum;
  const profitMargin = buyingNum > 0 ? Math.round((unitProfit / buyingNum) * 100) : 0;
  const totalStockProfit = unitProfit * stockNum;
  const customerSavings = origNum > sellingNum ? origNum - sellingNum : 0;

  // Handle Category Change
  const handleCategoryChange = (catId) => {
    setNewCategory(catId);
    if (catId !== 'custom') {
      const suggested = categoryBrandMap[catId] || [];
      if (suggested.length > 0) {
        setNewBrand(suggested[0]);
        setCustomBrand(suggested[0]);
      }
    } else {
      setBrandMode('custom');
    }
  };

  const currentBrandList = categoryBrandMap[newCategory] || [
    "Samsung", "Apple", "Xiaomi", "Realme", "Sharif Melamine", "Matador", "Casio", "Walton", "Miyako", "Super Star", "Anker", "JBL", "Radhuni", "Ispahani"
  ];

  // Price calculations sync
  const handleOrigPriceChange = (val) => {
    setNewOriginalPrice(val);
    const mrp = parseInt(val) || 0;
    const disc = parseInt(newDiscountPercent) || 0;
    if (mrp > 0 && disc > 0) {
      const calculated = Math.round(mrp * (1 - disc / 100));
      setNewPrice(String(calculated));
    } else if (mrp > 0 && !newPrice) {
      setNewPrice(String(mrp));
    }
  };

  const handleDiscountChange = (val) => {
    setNewDiscountPercent(val);
    const disc = parseInt(val) || 0;
    const mrp = parseInt(newOriginalPrice) || 0;
    if (mrp > 0 && disc >= 0) {
      const calculated = Math.round(mrp * (1 - disc / 100));
      setNewPrice(String(calculated));
    }
  };

  const handleSellingPriceChange = (val) => {
    setNewPrice(val);
    const sell = parseInt(val) || 0;
    const mrp = parseInt(newOriginalPrice) || 0;
    if (mrp > sell && mrp > 0) {
      const disc = Math.round(((mrp - sell) / mrp) * 100);
      setNewDiscountPercent(String(disc));
    }
  };

  // Barcode Auto-Fill Lookup
  const handleBarcodeLookup = (codeToSearch) => {
    const code = (codeToSearch || barcodeInput).trim();
    if (!code) {
      alert(lang === 'bn' ? "অনুগ্রহ করে বারকোড নম্বর লিখুন বা ড্রপডাউন থেকে নির্বাচন করুন।" : "Please enter or select a barcode number.");
      return;
    }

    const matched = findProductByBarcode(code);
    if (matched) {
      setNewBarcode(matched.barcode);
      setBarcodeInput(matched.barcode);
      setNewTitle(lang === 'bn' ? matched.titleBn : matched.titleEn);
      setNewCategory(matched.category);
      setNewBrand(matched.brand);
      setCustomBrand(matched.brand);
      setBrandMode('suggested');
      setNewBuyingPrice(String(matched.buyingPrice || ''));
      setNewOriginalPrice(String(matched.originalPrice || ''));
      setNewDiscountPercent(String(matched.discountPercent || '0'));
      setNewPrice(String(matched.sellingPrice || ''));
      setNewStock(String(matched.stock || 20));
      setHasExpiry(Boolean(matched.hasExpiry));
      setNewMfgDate(matched.mfgDate || '');
      setNewExpDate(matched.expDate || '');
      
      if (matched.offerBadge) {
        setNewOfferType('special');
        setNewOfferBadge(matched.offerBadge);
      } else {
        setNewOfferType('none');
        setNewOfferBadge('');
      }

      setNewVoucherEligible(matched.voucherEligible !== false);
      setNewImageUrl(matched.imageUrl || '');
      setNewDesc(matched.descriptionBn || '');
      setBarcodeSuccessMsg(lang === 'bn'
        ? `✅ বারকোড [${matched.barcode}] স্ক্যান সফল! '${matched.titleBn.slice(0, 32)}...' এর তথ্য পূরণ হয়েছে।`
        : `✅ Barcode [${matched.barcode}] matched! Filled info for '${matched.titleEn.slice(0, 32)}...'`);
      setTimeout(() => setBarcodeSuccessMsg(''), 6000);
      setIsScannerSimOpen(false);
    } else {
      setNewBarcode(code);
      alert(lang === 'bn' 
        ? `বারকোড [${code}] পাওয়া গেছে! নতুন পণ্য হিসেবে এটি ফর্মে সেট করা হয়েছে।` 
        : `Barcode [${code}] assigned to this new product.`);
      setIsScannerSimOpen(false);
    }
  };

  // Handle local image file upload from user's PC with automatic optimization
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setNewImageUrl(optimizedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Password Change State for Store Owner MD. ALIM BISSAS
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassSuccessMsg('');
    setPassErrorMsg('');

    const savedPass = localStorage.getItem('bt_admin_password') || 'alim2026';
    const validOld = ['alim2026', 'biswas2026', 'maun2026', '01723152730', '123456', savedPass];

    if (!validOld.includes(currentPassInput.trim())) {
      setPassErrorMsg(lang === 'bn' ? 'বর্তমান পাসওয়ার্ড সঠিক নয়!' : 'Current password is incorrect!');
      return;
    }

    if (newPassInput.trim().length < 4) {
      setPassErrorMsg(lang === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!' : 'New password must be at least 4 characters long!');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassErrorMsg(lang === 'bn' ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!' : 'New password and confirm password do not match!');
      return;
    }

    localStorage.setItem('bt_admin_password', newPassInput.trim());
    setPassSuccessMsg(lang === 'bn' ? '✅ অভিনন্দন! অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' : '✅ Success! Admin password updated successfully.');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  // Calculations for Overview & Stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  
  const totalInventoryCost = products.reduce((acc, p) => {
    const cost = p.buyingPrice || Math.round(p.price * 0.8);
    return acc + (cost * (p.stock || 0));
  }, 0);

  const totalRetailValue = products.reduce((acc, p) => {
    return acc + (p.price * (p.stock || 0));
  }, 0);

  const totalProjectedProfit = totalRetailValue - totalInventoryCost;

  // Expiry FEFO helper
  const getExpiryDetails = (product) => {
    if (!product.hasExpiry || !product.expDate) {
      return { status: 'none', label: lang === 'bn' ? 'সাধারণ পণ্য' : 'Non-perishable', color: 'gray' };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(product.expDate);
    const diffTime = exp - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { 
        status: 'expired', 
        daysLeft,
        label: lang === 'bn' ? `🔴 মেয়াদ উত্তীর্ণ! (${Math.abs(daysLeft)} দিন আগে)` : `🔴 Expired (${Math.abs(daysLeft)}d ago)`, 
        color: 'red' 
      };
    } else if (daysLeft <= 60) {
      return { 
        status: 'warning', 
        daysLeft,
        label: lang === 'bn' ? `🟡 দ্রুত বিক্রি করুন! (আর ${daysLeft} দিন)` : `🟡 Sell Soon (${daysLeft}d left)`, 
        color: 'amber' 
      };
    } else {
      return { 
        status: 'good', 
        daysLeft,
        label: lang === 'bn' ? `🟢 মেয়াদ ভালো (আর ${daysLeft} দিন)` : `🟢 Fresh (${daysLeft}d left)`, 
        color: 'emerald' 
      };
    }
  };

  const expiringProductsCount = products.filter(p => {
    const exp = getExpiryDetails(p);
    return exp.status === 'warning' || exp.status === 'expired';
  }).length;

  const formatPrice = (amount) => {
    return lang === 'bn' ? Number(amount).toLocaleString('bn-BD') : Number(amount).toLocaleString('en-US');
  };

  // ================= VOUCHER MANAGEMENT HANDLERS =================
  const activePromoVoucher = (vouchers || []).find(v => v.isPrimary) || (vouchers || [])[0] || {
    code: 'BISWAS10',
    discountPercent: 10,
    minSpend: 1500,
    maxDiscount: 500,
    titleBn: '১০% ছাড় মেগা ভাউচার',
    descriptionBn: 'ন্যূনতম ১৫০০ টাকার অর্ডারে সর্বোচ্চ ৫০০ টাকা ছাড়'
  };

  const handleSetPrimaryVoucher = (code) => {
    if (!onUpdateVouchers) return;
    const updated = (vouchers || []).map(v => ({
      ...v,
      isPrimary: v.code === code
    }));
    onUpdateVouchers(updated);
    setVoucherMsg(lang === 'bn' ? `সফল! '${code}' কে হোমপেজের প্রধান ভাউচার হিসেবে সেট করা হয়েছে।` : `Success! '${code}' set as primary promo code.`);
    setTimeout(() => setVoucherMsg(''), 4500);
  };

  const handleQuickUpdatePromo = (e) => {
    e.preventDefault();
    const clean = quickPromoCode.trim().toUpperCase();
    if (!clean) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে নতুন ভাউচার কোড লিখুন।' : 'Please enter a voucher code.');
      return;
    }
    if (!onUpdateVouchers) return;

    const list = [...(vouchers || [])];
    const primaryIndex = list.findIndex(v => v.isPrimary);

    let updated;
    if (primaryIndex > -1) {
      updated = list.map((v, idx) => idx === primaryIndex ? { 
        ...v, 
        code: clean,
        titleBn: `${clean} স্পেশাল মেগা ভাউচার`,
        isPrimary: true
      } : v);
    } else if (list.length > 0) {
      updated = list.map((v, idx) => idx === 0 ? { 
        ...v, 
        code: clean,
        titleBn: `${clean} স্পেশাল মেগা ভাউচার`,
        isPrimary: true 
      } : v);
    } else {
      updated = [{
        id: `vouch-${Date.now()}`,
        code: clean,
        discountPercent: 10,
        minSpend: 1500,
        maxDiscount: 500,
        titleBn: `${clean} স্পেশাল মেগা ভাউচার`,
        descriptionBn: "ন্যূনতম ১৫০০ টাকার অর্ডারে সর্বোচ্চ ৫০০ টাকা ছাড়",
        isPrimary: true,
        expiryDate: "২০২৬-১২-৩১"
      }];
    }

    onUpdateVouchers(updated);
    setQuickPromoCode('');
    setVoucherMsg(lang === 'bn' ? `হোমপেজের প্রধান ভাউচার কোড সফলভাবে '${clean}' এ পরিবর্তন করা হয়েছে!` : `Hero promo code changed to '${clean}'!`);
    setTimeout(() => setVoucherMsg(''), 4500);
  };

  const handleCreateVoucher = (e) => {
    e.preventDefault();
    const cleanCode = newVCode.trim().toUpperCase();
    if (!cleanCode) {
      alert(lang === 'bn' ? 'ভাউচার কোড লিখুন (যেমন: EID2026)' : 'Please enter voucher code');
      return;
    }

    if ((vouchers || []).some(v => v.code.toUpperCase() === cleanCode)) {
      alert(lang === 'bn' ? `কোড '${cleanCode}' ইতিমধ্যে বিদ্যমান! অনুগ্রহ করে অন্য কোড দিন।` : `Voucher '${cleanCode}' already exists!`);
      return;
    }

    const discVal = parseInt(newVDiscountVal) || 0;
    const isPct = newVDiscountType === 'percent';
    const minSp = parseInt(newVMinSpend) || 0;
    const maxDc = parseInt(newVMaxDiscount) || (isPct ? 500 : discVal);

    const newVoucher = {
      id: `vouch-${Date.now()}`,
      code: cleanCode,
      discountPercent: isPct ? discVal : 0,
      fixedDiscount: !isPct ? discVal : 0,
      minSpend: minSp,
      maxDiscount: maxDc,
      titleBn: newVTitle.trim() || (isPct ? `${discVal}% ছাড় মেগা ভাউচার` : `৳${discVal} বিশেষ ছাড় ভাউচার`),
      descriptionBn: newVDesc.trim() || `ন্যূনতম ৳${minSp} টাকার অর্ডারে প্রযোজ্য`,
      isPrimary: Boolean(newVIsPrimary),
      expiryDate: newVExpDate || '২০২৬-১২-৩১'
    };

    let updatedList;
    if (newVIsPrimary) {
      updatedList = [newVoucher, ...(vouchers || []).map(v => ({ ...v, isPrimary: false }))];
    } else {
      updatedList = [...(vouchers || []), newVoucher];
    }

    if (onUpdateVouchers) {
      onUpdateVouchers(updatedList);
    }

    setNewVCode('');
    setNewVTitle('');
    setNewVDesc('');
    setNewVIsPrimary(false);
    setVoucherMsg(lang === 'bn' ? `নতুন ভাউচার '${cleanCode}' সফলভাবে তৈরি হয়েছে!` : `New voucher '${cleanCode}' created successfully!`);
    setTimeout(() => setVoucherMsg(''), 4500);
  };

  const handleDeleteVoucher = (codeToDelete) => {
    if ((vouchers || []).length <= 1) {
      alert(lang === 'bn' ? 'কমপক্ষে একটি ভাউচার সাইটে থাকা আবশ্যক!' : 'At least one voucher must remain active!');
      return;
    }
    const confirmDelete = window.confirm(
      lang === 'bn' 
        ? `আপনি কি নিশ্চিত যে '${codeToDelete}' ভাউচারটি মুছে ফেলতে চান?` 
        : `Are you sure you want to delete voucher '${codeToDelete}'?`
    );
    if (!confirmDelete) return;

    let updated = (vouchers || []).filter(v => v.code !== codeToDelete);
    if (!updated.some(v => v.isPrimary) && updated.length > 0) {
      updated[0] = { ...updated[0], isPrimary: true };
    }
    if (onUpdateVouchers) {
      onUpdateVouchers(updated);
    }
    setVoucherMsg(lang === 'bn' ? `'${codeToDelete}' ভাউচারটি সফলভাবে মুছে ফেলা হয়েছে।` : `Voucher '${codeToDelete}' deleted.`);
    setTimeout(() => setVoucherMsg(''), 4500);
  };

  const handleResetDefaultVouchers = () => {
    const confirmReset = window.confirm(
      lang === 'bn' 
        ? 'আপনি কি ভাউচারগুলোকে মূল ডিফল্ট অবস্থায় (BISWAS10, FREE60, MULTISHOP) ফিরিয়ে নিতে চান?' 
        : 'Do you want to reset vouchers to default settings?'
    );
    if (!confirmReset) return;
    const defaultList = [
      {
        id: "vouch-1",
        code: "BISWAS10",
        discountPercent: 10,
        minSpend: 1500,
        maxDiscount: 500,
        titleBn: "১০% ছাড় মেগা ভাউচার",
        descriptionBn: "ন্যূনতম ১৫০০ টাকার অর্ডারে সর্বোচ্চ ৫০০ টাকা ছাড়",
        isPrimary: true,
        expiryDate: "২০২৬-১২-৩১"
      },
      {
        id: "vouch-2",
        code: "FREE60",
        discountPercent: 0,
        fixedDiscount: 60,
        minSpend: 2000,
        maxDiscount: 60,
        titleBn: "ফ্রি ডেলিভারি ভাউচার",
        descriptionBn: "২০০০ টাকার বেশি অর্ডারে পুরো ডেলিভারি চার্জ ফ্রি!",
        isPrimary: false,
        expiryDate: "২০২৬-১২-৩১"
      },
      {
        id: "vouch-3",
        code: "MULTISHOP",
        discountPercent: 15,
        minSpend: 3000,
        maxDiscount: 600,
        titleBn: "১৫% মাল্টি-সপ মেগা অফার",
        descriptionBn: "মেলামাইন, স্টেশনারি ও গ্যাজেটে সর্বোচ্চ ৬০০ টাকা ছাড়",
        isPrimary: false,
        expiryDate: "২০২৬-১২-৩১"
      }
    ];
    if (onUpdateVouchers) {
      onUpdateVouchers(defaultList);
    }
    setVoucherMsg(lang === 'bn' ? 'ডিফল্ট ভাউচারসমূহ সফলভাবে রিস্টোর হয়েছে!' : 'Default vouchers restored!');
    setTimeout(() => setVoucherMsg(''), 4500);
  };

  // Create Product Submit Handler
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      alert(lang === 'bn' ? "পণ্যের নাম এবং বিক্রয় মূল্য প্রদান করুন।" : "Please provide product title and selling price.");
      return;
    }

    const priceNum = parseInt(newPrice) || 0;
    const costNum = parseInt(newBuyingPrice) || Math.round(priceNum * 0.8);
    const origPriceNum = parseInt(newOriginalPrice) || priceNum;
    const discount = origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : (parseInt(newDiscountPercent) || 0);

    const finalCategory = (newCategory === 'custom' ? customCategory.trim() : newCategory) || 'smartphones';
    const finalBrand = (brandMode === 'custom' ? customBrand.trim() : newBrand.trim()) || 'General';

    if (newCategory === 'custom' && !customCategory.trim()) {
      alert(lang === 'bn' ? "অনুগ্রহ করে নতুন ক্যাটাগরির নাম লিখুন।" : "Please provide the custom category name.");
      return;
    }
    if (brandMode === 'custom' && !customBrand.trim()) {
      alert(lang === 'bn' ? "অনুগ্রহ করে ব্র্যান্ডের নাম লিখুন।" : "Please provide the brand name.");
      return;
    }

    // Determine offer badge text
    let offerBadgeText = newOfferBadge;
    let isFlash = false;
    if (newOfferType === 'flash') {
      isFlash = true;
      offerBadgeText = lang === 'bn' ? "⚡ ফ্ল্যাশ সেল অফার" : "⚡ Flash Sale Deal";
    } else if (newOfferType === 'special') {
      offerBadgeText = newOfferBadge || (lang === 'bn' ? "🔥 বিশেষ মূল্যছাড়" : "🔥 Special Offer");
    } else if (newOfferType === 'bogo') {
      offerBadgeText = lang === 'bn' ? "🎁 ১টি কিনলে ১টি ফ্রি" : "🎁 Buy 1 Get 1 Free";
    } else if (newOfferType === 'eid') {
      offerBadgeText = lang === 'bn' ? "🌙 মেগা উৎসব অফার" : "🌙 Festive Mega Offer";
    } else if (newOfferType === 'gift') {
      offerBadgeText = lang === 'bn' ? "🎀 ফ্রি গিফট অফার" : "🎀 Free Gift Included";
    }

    const productObj = {
      id: `prod-${Date.now()}`,
      barcode: newBarcode.trim() || `890${Math.floor(1000 + Math.random() * 9000)}`,
      titleBn: newTitle,
      titleEn: newTitle,
      brand: finalBrand,
      category: finalCategory,
      buyingPrice: costNum, // Confidential buying price
      price: priceNum, // Selling price
      originalPrice: origPriceNum > priceNum ? origPriceNum : null,
      discountPercent: discount,
      rating: 5.0,
      reviewsCount: 1,
      stock: parseInt(newStock) || 10,
      soldCount: 0,
      isFlashSale: isFlash,
      offerType: newOfferType,
      offerBadge: offerBadgeText,
      voucherEligible: Boolean(newVoucherEligible),
      hasExpiry: Boolean(hasExpiry),
      mfgDate: hasExpiry ? newMfgDate : '',
      expDate: hasExpiry ? newExpDate : '',
      freeDelivery: priceNum > 3000,
      warranty: lang === 'bn' ? "১ বছরের অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি" : "1 Year Official Brand Warranty",
      sellerName: "বিশ্বাস অফিশিয়াল স্টোর",
      sellerRating: "100% Positive",
      images: [
        newImageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80"
      ],
      descriptionBn: newDesc || "100% authentic product from Biswas Telecom & Electronics.",
      specifications: {
        "Brand": finalBrand,
        "Warranty": "1 Year Official Guarantee",
        "Status": "Brand New & Intact",
        "Barcode": newBarcode.trim() || "Generated"
      },
      reviews: []
    };

    onAddProduct(productObj);
    alert(lang === 'bn' ? "✅ নতুন পণ্য সফলভাবে সাইটে যুক্ত হয়েছে!" : "✅ New product published successfully!");
    
    // Reset form
    setNewTitle('');
    setNewBarcode('');
    setBarcodeInput('');
    setNewBuyingPrice('');
    setNewOriginalPrice('');
    setNewDiscountPercent('0');
    setNewPrice('');
    setNewStock('20');
    setNewImageUrl('');
    setUploadedFileName('');
    setNewDesc('');
    setCustomCategory('');
    setCustomBrand('');
    setBrandMode('suggested');
    setNewOfferType('none');
    setNewOfferBadge('');
    setNewVoucherEligible(true);
    setHasExpiry(false);
    setNewMfgDate('');
    setNewExpDate('');
    setActiveTab('products-list');
  };

  // Filtered Products for Stock Management tab
  const filteredProducts = products.filter(p => {
    if (stockFilter === 'expiring') {
      const exp = getExpiryDetails(p);
      return exp.status === 'warning' || exp.status === 'expired';
    }
    if (stockFilter === 'low') {
      return (p.stock || 0) <= 5;
    }
    if (stockFilter === 'offers') {
      return p.isFlashSale || p.offerBadge;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto relative animate-scaleUp flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              BT
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base sm:text-lg">
                  {t.adminTitle}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                  {lang === 'bn' ? 'মালিক প্যানেল' : 'Owner Panel'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {lang === 'bn' ? 'প্রতিষ্ঠাতা ও মালিক: MD. ALIM BISSAS | মোবাইল: 01723152730' : 'Founder & Owner: MD. ALIM BISSAS | Mobile: 01723152730'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="bg-red-600/90 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1 shadow-sm"
              title="লক করুন"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লক করুন' : 'Lock'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 px-4 bg-gray-50 text-xs sm:text-sm font-bold space-x-2 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'overview' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.tabOverview}</span>
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`py-3 px-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'add-product' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{t.tabAddProduct}</span>
          </button>
          <button
            onClick={() => setActiveTab('products-list')}
            className={`py-3 px-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'products-list' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t.tabStockProducts} ({products.length})</span>
            {expiringProductsCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {expiringProductsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'orders' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.tabOrders} ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`py-3 px-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'vouchers' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>{lang === 'bn' ? `ভাউচার কোড (${(vouchers || []).length})` : `Vouchers (${(vouchers || []).length})`}</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'security' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Welcome Banner for Owner */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {lang === 'bn' ? 'দোকান ব্যবস্থাপনা ড্যাশবোর্ড' : 'Store Management Dashboard'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black">
                      {lang === 'bn' ? 'MD. ALIM BISSAS এর কন্ট্রোল প্যানেল' : "MD. ALIM BISSAS Control Center"}
                    </h2>
                    <p className="text-xs text-orange-100 mt-1 max-w-xl">
                      {lang === 'bn' 
                        ? 'এখানে ক্রয় মূল্য, বিক্রয় মূল্য, লাভ-লোকসান হিসাব, পণ্যের বারকোড এবং মেয়াদ উত্তীর্ণের সতর্কবার্তা সরাসরি নিয়ন্ত্রণ করুন।' 
                        : 'Monitor buying cost, profit margins, barcode inventories, and perishable expiry dates in real time.'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('add-product')}
                      className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.tabAddProduct}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('products-list')}
                      className="bg-gray-900 text-white hover:bg-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5"
                    >
                      <Package className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'ইনভেন্টরি দেখুন' : 'View Inventory'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 Key Financial & Inventory Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* 1. Total Sales Revenue */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-blue-700">
                    <span className="text-xs font-bold uppercase">{t.totalSalesLabel}</span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-blue-900 mt-2">
                    ৳{formatPrice(totalRevenue)}
                  </p>
                  <p className="text-[11px] text-blue-600 mt-1">{lang === 'bn' ? 'গ্রাহকদের সফল অর্ডার থেকে আয়' : 'Revenue from orders'}</p>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="text-xs font-bold uppercase">{t.totalOrdersLabel}</span>
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-900 mt-2">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-1">{lang === 'bn' ? 'গ্রাহকদের মোট অর্ডার' : 'Total customer orders'}</p>
                </div>

                {/* 3. Live In-stock Products */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-orange-700">
                    <span className="text-xs font-bold uppercase">{t.liveProductsLabel}</span>
                    <Package className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-orange-900 mt-2">
                    {products.length}
                  </p>
                  <p className="text-[11px] text-orange-600 mt-1">{lang === 'bn' ? 'ক্যাটালগে রেডি পণ্য' : 'Catalog products'}</p>
                </div>

                {/* 4. Total Buying Cost Value */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-xs font-bold uppercase">{lang === 'bn' ? 'মোট ইনভেন্টরি ক্রয় মূল্য' : 'Total Stock Cost'}</span>
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    ৳{formatPrice(totalInventoryCost)}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">{lang === 'bn' ? '🔒 শুধুমাত্র মালিকের জন্য (কেনা দর)' : '🔒 Owner cost valuation'}</p>
                </div>

                {/* 5. Total Projected Net Profit */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-green-700">
                    <span className="text-xs font-bold uppercase">{lang === 'bn' ? 'মোট সম্ভাব্য নীট লাভ' : 'Projected Profit'}</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-green-900 mt-2">
                    ৳{formatPrice(totalProjectedProfit)}
                  </p>
                  <p className="text-[11px] text-green-600 mt-1">{lang === 'bn' ? 'সব পণ্য বিক্রয় হলে মোট লাভ' : 'Profit if all stock sells'}</p>
                </div>

                {/* 6. Perishable Expiry Warnings */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-amber-700">
                    <span className="text-xs font-bold uppercase">{lang === 'bn' ? 'মেয়াদ উত্তীর্ণের ঝুঁকিতে' : 'Expiry Alerts'}</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-amber-900 mt-2">
                    {expiringProductsCount}
                  </p>
                  <p className="text-[11px] text-amber-600 mt-1">{lang === 'bn' ? 'FEFO: দ্রুত বিক্রি করতে হবে' : 'FEFO priority items'}</p>
                </div>
              </div>

              {/* Quick Actions & Barcode Database Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Barcode className="w-5 h-5 text-orange-600" />
                    <h4 className="font-bold text-sm text-gray-900">
                      {lang === 'bn' ? 'বারকোড ক্যাটালগ ও দ্রুত টেস্ট পণ্য' : 'Barcode Master Catalog Quick Fill'}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {barcodeCatalog.length} {lang === 'bn' ? 'টি প্রি-সেট পণ্য প্রস্তুত' : 'pre-configured items'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {barcodeCatalog.slice(0, 4).map((item) => (
                    <button
                      key={item.barcode}
                      onClick={() => {
                        handleBarcodeLookup(item.barcode);
                        setActiveTab('add-product');
                      }}
                      className="text-left p-2.5 bg-white border border-gray-200 hover:border-orange-500 rounded-lg transition group shadow-2xs"
                    >
                      <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                        #{item.barcode}
                      </span>
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1 mt-1 group-hover:text-orange-600">
                        {lang === 'bn' ? item.titleBn : item.titleEn}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                        ৳{formatPrice(item.sellingPrice)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD PRODUCT WITH BARCODE & LIVE PROFIT */}
          {activeTab === 'add-product' && (
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              {/* Form Title & Barcode Scanner Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    {t.addProductFormTitle}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {lang === 'bn' ? 'ক্রয় মূল্য, বিক্রয় মূল্য, অফার ও মেয়াদ যুক্ত করে নতুন পণ্য সেভ করুন।' : 'Add cost price, selling price, discounts, and expiry dates.'}
                  </p>
                </div>
                
                {/* Barcode Search / Scan Section */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder={lang === 'bn' ? "বারকোড লিখুন (যেমন 8901001)..." : "Enter barcode..."}
                      className="w-48 sm:w-56 p-2 pl-7 bg-orange-50/60 border border-orange-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs font-mono"
                    />
                    <Barcode className="w-4 h-4 text-orange-600 absolute left-2 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBarcodeLookup(barcodeInput)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-lg transition flex items-center space-x-1 shadow-xs"
                    title="বারকোড দিয়ে স্বয়ংক্রিয় পূরণ করুন"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'অটো-পূরণ' : 'Auto-fill'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScannerSimOpen(!isScannerSimOpen)}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-2.5 py-2 rounded-lg transition flex items-center space-x-1 shadow-xs"
                    title="ক্যামেরা স্ক্যানার সিমুলেটর"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'স্ক্যান' : 'Scan'}</span>
                  </button>
                </div>
              </div>

              {/* Barcode Success Feedback */}
              {barcodeSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold text-xs flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{barcodeSuccessMsg}</span>
                </div>
              )}

              {/* Camera Scanner Simulator Modal */}
              {isScannerSimOpen && (
                <div className="p-4 bg-gray-900 text-white rounded-xl border border-orange-500/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Scan className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="font-bold text-xs text-orange-300">
                        {lang === 'bn' ? '📷 ওয়েবক্যাম / বারকোড স্ক্যানার সিমুলেটর' : '📷 Barcode Scanner Interface'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsScannerSimOpen(false)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    {lang === 'bn' 
                      ? 'দোকানের বারকোড গান রিডার দিয়ে পণ্যের গায়ের কোড স্ক্যান করুন অথবা তালিকা থেকে একটি বাছাই করুন:' 
                      : 'Use barcode gun reader or select from pre-registered store items:'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {barcodeCatalog.map((item) => (
                      <button
                        key={item.barcode}
                        type="button"
                        onClick={() => handleBarcodeLookup(item.barcode)}
                        className="p-2 bg-gray-800 hover:bg-orange-600 text-white text-left rounded-lg transition border border-gray-700 text-xs"
                      >
                        <div className="font-mono font-bold text-amber-400 text-[10px]">
                          [{item.barcode}]
                        </div>
                        <div className="truncate font-medium mt-0.5">
                          {lang === 'bn' ? item.titleBn : item.titleEn}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Product Title */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">{t.productTitleInput}</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Apple iPhone 16 Pro Max 256GB Desert Titanium / শরিফ মেলামাইন ডিনার সেট"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs"
                  />
                </div>

                {/* Category Selection with Custom Category handwritten input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700">{t.categorySelect}</label>
                    {newCategory === 'custom' && (
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">
                        {lang === 'bn' ? '✍️ কাস্টম ক্যাটাগরি' : 'Custom Category'}
                      </span>
                    )}
                  </div>
                  <select
                    value={newCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{lang === 'bn' ? c.nameBn : c.nameEn}</option>
                    ))}
                    <option value="custom" className="font-bold text-orange-600 bg-orange-50">
                      ➕ {lang === 'bn' ? 'নতুন / কাস্টম ক্যাটাগরি হাতে লিখুন (Custom Category)' : 'Type New Custom Category...'}
                    </option>
                  </select>

                  {newCategory === 'custom' && (
                    <div className="mt-2 p-2.5 bg-orange-50/70 border border-orange-200 rounded-lg space-y-1">
                      <label className="block text-[11px] font-bold text-orange-800">
                        {lang === 'bn' ? 'নতুন ক্যাটাগরির নাম বাংলায়/ইংরেজিতে লিখুন:' : 'Enter Custom Category Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder={lang === 'bn' ? "যেমন: মেডিসিন, খেলনা, উপহার সামগ্রী" : "e.g. Medicine, Toys, Gifts"}
                        className="w-full p-2 bg-white border border-orange-300 rounded-lg outline-none focus:border-orange-500 text-xs font-semibold"
                      />
                    </div>
                  )}
                </div>

                {/* Brand Selection with Auto-adaptation & Handwritten / Custom Brand input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700">{t.brandSelect}</label>
                    <button
                      type="button"
                      onClick={() => setBrandMode(brandMode === 'custom' ? 'suggested' : 'custom')}
                      className={`text-[11px] px-2 py-0.5 rounded transition flex items-center space-x-1 ${
                        brandMode === 'custom' 
                          ? 'bg-orange-600 text-white font-bold shadow-xs' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <PenTool className="w-3 h-3" />
                      <span>{brandMode === 'custom' ? (lang === 'bn' ? 'তালিকা থেকে পছন্দ' : 'From List') : (lang === 'bn' ? '✍️ হাতে লিখুন' : '✍️ Type Custom')}</span>
                    </button>
                  </div>

                  {brandMode === 'suggested' ? (
                    <div>
                      <select
                        value={newBrand}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setBrandMode('custom');
                          } else {
                            setNewBrand(e.target.value);
                            setCustomBrand(e.target.value);
                          }
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs font-medium"
                      >
                        {currentBrandList.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        <option value="__custom__" className="font-bold text-orange-600 bg-orange-50">
                          ✍️ {lang === 'bn' ? 'অন্যান্য / নিজের ইচ্ছামত ব্র্যান্ডের নাম লিখুন...' : 'Type another custom brand...'}
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        required
                        value={customBrand}
                        onChange={(e) => {
                          setCustomBrand(e.target.value);
                          setNewBrand(e.target.value);
                        }}
                        placeholder={lang === 'bn' ? "ব্র্যান্ডের নাম লিখুন (যেমন: Sharif Melamine, Walton, Casio ইত্যাদি)" : "Enter brand name (e.g. Walton, Sharif, etc.)"}
                        className="w-full p-2.5 bg-orange-50/50 border border-orange-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs font-semibold"
                      />
                    </div>
                  )}

                  {/* Quick suggested brand pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {currentBrandList.slice(0, 5).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setNewBrand(b);
                          setCustomBrand(b);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                          newBrand === b 
                            ? 'bg-orange-500 text-white border-orange-500 font-bold' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRICING & PROFIT MANAGEMENT SECTION */}
                <div className="sm:col-span-2 bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-300/80 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <div className="flex items-center space-x-1.5">
                      <Calculator className="w-4 h-4 text-orange-600" />
                      <span className="font-black text-gray-900 text-xs uppercase tracking-wide">
                        {lang === 'bn' ? 'মূল্য ও মালিকের লাভ হিসাব (Price & Profit Calculator)' : 'Price & Profit Margins'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'ক্রয় মূল্য ও লাভ গোপনীয়' : 'Confidential'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* 1. Buying / Cost Price */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">
                        {lang === 'bn' ? '🔒 ক্রয় মূল্য (৳)' : '🔒 Buying Cost (৳)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={newBuyingPrice}
                        onChange={(e) => setNewBuyingPrice(e.target.value)}
                        placeholder="e.g. 3200"
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono font-bold text-gray-900"
                      />
                      <span className="text-[10px] text-gray-500">{lang === 'bn' ? 'দোকানে কত দিয়ে কেনা' : 'Your purchase cost'}</span>
                    </div>

                    {/* 2. Original MRP */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">
                        {lang === 'bn' ? 'গায়ের মূল্য / MRP (৳)' : 'Original MRP (৳)'}
                      </label>
                      <input
                        type="number"
                        value={newOriginalPrice}
                        onChange={(e) => handleOrigPriceChange(e.target.value)}
                        placeholder="e.g. 4800"
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-500">{lang === 'bn' ? 'প্যাকেটের গায়ের রেট' : 'Retail pack price'}</span>
                    </div>

                    {/* 3. Discount % */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1 text-[11px]">
                        {lang === 'bn' ? 'ডিসকাউন্ট (%)' : 'Discount (%)'}
                      </label>
                      <input
                        type="number"
                        value={newDiscountPercent}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-500">{lang === 'bn' ? 'সাশ্রয় ছাড় পারসেন্ট' : 'Discount percentage'}</span>
                    </div>

                    {/* 4. Customer Selling Price */}
                    <div>
                      <label className="block font-bold text-orange-700 mb-1 text-[11px]">
                        {lang === 'bn' ? '🏷️ বিক্রয় মূল্য (৳)' : '🏷️ Selling Price (৳)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => handleSellingPriceChange(e.target.value)}
                        placeholder="e.g. 3999"
                        className="w-full p-2 bg-white border-2 border-orange-500 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 text-xs font-mono font-black text-orange-600"
                      />
                      <span className="text-[10px] text-orange-600 font-semibold">{lang === 'bn' ? 'ক্রেতা এই দামে কিনবে' : 'Customer pays this'}</span>
                    </div>
                  </div>

                  {/* LIVE PROFIT PREVIEW CARD */}
                  <div className="bg-white p-3 rounded-xl border border-amber-300/80 shadow-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                          {lang === 'bn' ? 'প্রতি পিসে নীট লাভ' : 'Profit Per Unit'}
                        </span>
                        <span className={`text-sm sm:text-base font-black ${unitProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          ৳{formatPrice(unitProfit)}
                        </span>
                      </div>

                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-[10px] text-blue-700 font-bold uppercase block">
                          {lang === 'bn' ? 'লাভের মার্জিন' : 'Profit Margin'}
                        </span>
                        <span className="text-sm sm:text-base font-black text-blue-700">
                          {profitMargin}%
                        </span>
                      </div>

                      <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <span className="text-[10px] text-purple-700 font-bold uppercase block">
                          {lang === 'bn' ? 'মোট স্টক সম্ভাব্য লাভ' : 'Total Stock Profit'}
                        </span>
                        <span className="text-sm sm:text-base font-black text-purple-700">
                          ৳{formatPrice(totalStockProfit)}
                        </span>
                      </div>

                      <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="text-[10px] text-orange-700 font-bold uppercase block">
                          {lang === 'bn' ? 'গ্রাহকের সাশ্রয়' : 'Customer Saves'}
                        </span>
                        <span className="text-sm sm:text-base font-black text-orange-600">
                          ৳{formatPrice(customerSavings)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 text-center font-medium">
                      🔒 {lang === 'bn' 
                        ? 'এই লাভ হিসাব শুধুমাত্র প্রতিষ্ঠাতা ও মালিক MD. ALIM BISSAS দেখতে পাবেন, সাধারণ ক্রেতারা দেখতে পাবে না।' 
                        : 'Profit metrics are strictly private to store owner MD. ALIM BISSAS.'}
                    </p>
                  </div>
                </div>

                {/* Stock Quantity & Barcode */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t.stockInput}</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="20"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {lang === 'bn' ? 'বারকোড / SKU নম্বর' : 'Barcode / SKU'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newBarcode}
                      onChange={(e) => setNewBarcode(e.target.value)}
                      placeholder="e.g. 8901001"
                      className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs font-mono font-bold"
                    />
                    <Barcode className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* SPECIAL OFFER & VOUCHER SECTION */}
                <div className="sm:col-span-2 bg-gradient-to-r from-pink-50/70 to-rose-50/70 p-3.5 rounded-xl border border-pink-200 space-y-3">
                  <div className="flex items-center space-x-1.5 pb-1 border-b border-pink-200">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span className="font-bold text-gray-900 text-xs">
                      {lang === 'bn' ? 'পণ্যের অফার ও ভাউচার ডিসকাউন্ট কন্ট্রোল' : 'Offer & Voucher Settings'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Offer Type Selector */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        {lang === 'bn' ? 'অফার বা বিশেষ ডিল নির্বাচন করুন:' : 'Select Special Deal / Offer:'}
                      </label>
                      <select
                        value={newOfferType}
                        onChange={(e) => setNewOfferType(e.target.value)}
                        className="w-full p-2.5 bg-white border border-pink-300 rounded-lg outline-none focus:border-pink-500 text-xs font-semibold"
                      >
                        <option value="none">{lang === 'bn' ? 'কোনো অফার নেই (সাধারণ বিক্রি)' : 'No Special Offer (Regular)'}</option>
                        <option value="flash">{lang === 'bn' ? '⚡ ফ্ল্যাশ সেল অফার (Flash Sale)' : '⚡ Flash Sale Deal'}</option>
                        <option value="special">{lang === 'bn' ? '🔥 বিশেষ মূল্যছাড় অফার (Special Discount)' : '🔥 Special Discount'}</option>
                        <option value="bogo">{lang === 'bn' ? '🎁 ১টি কিনলে ১টি ফ্রি (Buy 1 Get 1 Free)' : '🎁 Buy 1 Get 1 Free (BOGO)'}</option>
                        <option value="eid">{lang === 'bn' ? '🌙 মেগা উৎসব অফার (Mega Festive Deal)' : '🌙 Mega Festive Deal'}</option>
                        <option value="gift">{lang === 'bn' ? '🎀 ফ্রি গিফট অফার (Free Gift with Item)' : '🎀 Free Gift with Item'}</option>
                      </select>
                    </div>

                    {/* Voucher Discount Eligibility Toggle */}
                    <div className="flex items-center pt-5">
                      <label className="flex items-center space-x-2.5 cursor-pointer bg-white p-2.5 rounded-lg border border-pink-200 w-full hover:border-pink-400 transition">
                        <input
                          type="checkbox"
                          checked={newVoucherEligible}
                          onChange={(e) => setNewVoucherEligible(e.target.checked)}
                          className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <div>
                          <span className="font-bold text-gray-800 block text-xs">
                            🏷️ {lang === 'bn' ? 'ভাউচার ডিসকাউন্ট প্রযোজ্য' : 'Voucher Eligible'}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {lang === 'bn' ? 'ক্রেতা চেকআউটে BISWAS10 কুপন কোড ব্যবহার করতে পারবে' : 'Allows coupon discounts on checkout'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* PERISHABLE PRODUCTS: MANUFACTURING & EXPIRY DATES */}
                <div className="sm:col-span-2 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasExpiry}
                        onChange={(e) => setHasExpiry(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'bn' ? 'মেয়াদ সংক্রান্ত পণ্য (মুদি, খাদ্যদ্রব্য, প্রসাধন সামগ্রী বা ব্যাটারি)' : 'Perishable / Expiry Date Sensitive Product'}</span>
                      </span>
                    </label>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      FEFO Alert
                    </span>
                  </div>

                  {hasExpiry && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          {lang === 'bn' ? '📅 উৎপাদন তারিখ (MFD):' : '📅 Manufacturing Date (MFD):'}
                        </label>
                        <input
                          type="date"
                          value={newMfgDate}
                          onChange={(e) => setNewMfgDate(e.target.value)}
                          className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg outline-none focus:border-emerald-500 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          {lang === 'bn' ? '⏰ মেয়াদ উত্তীর্ণের তারিখ (EXP):' : '⏰ Expiry Date (EXP):'}
                        </label>
                        <input
                          type="date"
                          value={newExpDate}
                          onChange={(e) => setNewExpDate(e.target.value)}
                          className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg outline-none focus:border-emerald-500 text-xs font-mono font-bold text-gray-900"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 text-[11px] text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-200">
                        ℹ️ {lang === 'bn' 
                          ? 'পদ্ধতি: First Expired, First Out (FEFO) - মেয়াদ শেষের ৬০ দিন আগে সিস্টেম স্বয়ংক্রিয়ভাবে হলুদ সতর্কবার্তা দিবে যাতে এই পণ্য আগে বিক্রি করা যায়।' 
                          : 'FEFO Protocol: Alerts will trigger within 60 days of expiry to ensure older inventory sells first.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Image Selection - Local PC Upload or Web URL */}
                <div className="sm:col-span-2 bg-gradient-to-r from-orange-50/70 to-amber-50/70 p-3.5 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-gray-800 flex items-center space-x-1.5 text-xs">
                      <Camera className="w-4 h-4 text-orange-600" />
                      <span>{lang === 'bn' ? 'পণ্যের ছবি (পিসি থেকে আপলোড করুন)' : 'Product Image (Upload from PC)'}</span>
                    </label>
                    <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-gray-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('file')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                          imageUploadMode === 'file' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {lang === 'bn' ? '📁 পিসি থেকে ফাইল' : '📁 Upload File'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('url')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                          imageUploadMode === 'url' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {lang === 'bn' ? '🔗 ছবির লিংক (URL)' : '🔗 Image URL'}
                      </button>
                    </div>
                  </div>

                  {imageUploadMode === 'file' ? (
                    <div>
                      {!newImageUrl ? (
                        <label className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition group">
                          <UploadCloud className="w-8 h-8 text-orange-500 group-hover:scale-110 transition mb-1.5" />
                          <span className="font-bold text-gray-800 text-xs">
                            {lang === 'bn' ? 'আপনার পিসি থেকে পণ্যের ছবি নির্বাচন করতে এখানে ক্লিক করুন' : 'Click to browse & choose image from your PC'}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5">
                            JPG, PNG, WEBP, GIF (স্বয়ংক্রিয়ভাবে অপ্টিমাইজ ও যুক্ত হবে)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
                          <div className="flex items-center space-x-3">
                            <img src={newImageUrl} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                            <div>
                              <p className="font-bold text-gray-900 text-xs flex items-center space-x-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="truncate max-w-[200px]">{uploadedFileName || (lang === 'bn' ? 'ছবি সফলভাবে সিলেক্ট হয়েছে' : 'Image Selected')}</span>
                              </p>
                              <p className="text-[11px] text-emerald-600 font-medium">✓ {lang === 'bn' ? 'রেডি টু পাবলিশ' : 'Ready to save'}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setNewImageUrl(''); setUploadedFileName(''); }}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg font-bold text-xs flex items-center space-x-1 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>{lang === 'bn' ? 'ছবি মুছুন' : 'Remove'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 text-xs"
                      />
                      {newImageUrl && (
                        <div className="mt-2 flex items-center space-x-2">
                          <img src={newImageUrl} alt="Preview" className="w-10 h-10 object-cover rounded border" />
                          <span className="text-[11px] text-gray-500">{lang === 'bn' ? 'লিংক প্রিভিউ' : 'Link Preview'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">{t.descInput}</label>
                  <textarea
                    rows="3"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder={lang === 'bn' ? "পণ্যের বিশেষ ফিচার, স্পেসিফিকেশন ও ওয়ারেন্টি..." : "Product features, specifications, and warranty details..."}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-orange-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm py-3.5 rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t.saveProductBtn}</span>
              </button>
            </form>
          )}

          {/* TAB 3: STOCK PRODUCTS LIST WITH PROFIT, BARCODE & EXPIRY */}
          {activeTab === 'products-list' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span>{lang === 'bn' ? 'ইনভেন্টরি ও স্টক ব্যবস্থাপনা' : 'Inventory & Stock Management'}</span>
                    <span className="bg-orange-100 text-orange-700 font-black text-xs px-2 py-0.5 rounded-full">
                      {products.length} {lang === 'bn' ? 'টি পণ্য' : 'items'}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' 
                      ? 'ক্রয় মূল্য, বিক্রয় মূল্য, লাভ মার্জিন ও মেয়াদ উত্তীর্ণের তারিখ সহ সম্পূর্ণ ইনভেন্টরি।' 
                      : 'Complete inventory with cost, customer price, profit per unit, and expiry tracker.'}
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                  <button
                    onClick={() => setStockFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      stockFilter === 'all' ? 'bg-orange-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang === 'bn' ? 'সকল পণ্য' : 'All'} ({products.length})
                  </button>
                  <button
                    onClick={() => setStockFilter('expiring')}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
                      stockFilter === 'expiring' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'মেয়াদ ঝুঁকি (FEFO)' : 'Expiring'} ({expiringProductsCount})</span>
                  </button>
                  <button
                    onClick={() => setStockFilter('offers')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      stockFilter === 'offers' ? 'bg-pink-600 text-white shadow-xs' : 'bg-pink-50 text-pink-800 hover:bg-pink-100'
                    }`}
                  >
                    {lang === 'bn' ? 'অফার পণ্য' : 'Offers'} ({products.filter(p => p.isFlashSale || p.offerBadge).length})
                  </button>
                </div>
              </div>

              {/* Responsive Stock Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-800 uppercase font-black text-[11px] border-b border-gray-200">
                    <tr>
                      <th className="p-3">{lang === 'bn' ? 'পণ্য ও ছবি' : 'Product'}</th>
                      <th className="p-3">{lang === 'bn' ? 'ক্যাটাগরি / ব্র্যান্ড' : 'Category / Brand'}</th>
                      <th className="p-3">{lang === 'bn' ? 'বারকোড' : 'Barcode'}</th>
                      <th className="p-3">{lang === 'bn' ? '🔒 ক্রয় মূল্য' : 'Cost'}</th>
                      <th className="p-3">{lang === 'bn' ? 'বিক্রয় মূল্য' : 'Price'}</th>
                      <th className="p-3">{lang === 'bn' ? 'লাভ / মার্জিন' : 'Profit / Margin'}</th>
                      <th className="p-3">{lang === 'bn' ? 'স্টক' : 'Stock'}</th>
                      <th className="p-3">{lang === 'bn' ? 'মেয়াদ স্ট্যাটাস' : 'Expiry Status'}</th>
                      <th className="p-3 text-center">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredProducts.map((p) => {
                      const cost = p.buyingPrice || Math.round(p.price * 0.8);
                      const unitP = p.price - cost;
                      const margin = cost > 0 ? Math.round((unitP / cost) * 100) : 0;
                      const expDetails = getExpiryDetails(p);

                      return (
                        <tr key={p.id} className="hover:bg-orange-50/40 transition">
                          {/* Image & Title */}
                          <td className="p-3">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
                                alt=""
                                className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                              />
                              <div className="min-w-0 max-w-[180px] sm:max-w-[220px]">
                                <p className="font-bold text-gray-900 line-clamp-1">
                                  {lang === 'bn' ? p.titleBn : p.titleEn}
                                </p>
                                {p.offerBadge && (
                                  <span className="inline-block bg-pink-100 text-pink-700 text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5">
                                    {p.offerBadge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category & Brand */}
                          <td className="p-3">
                            <span className="font-semibold text-blue-700 block text-[11px]">{p.brand}</span>
                            <span className="text-gray-500 text-[10px] capitalize">{p.category}</span>
                          </td>

                          {/* Barcode */}
                          <td className="p-3 font-mono font-bold text-gray-700 text-[11px]">
                            {p.barcode || 'N/A'}
                          </td>

                          {/* Buying Cost */}
                          <td className="p-3 font-mono font-semibold text-gray-800">
                            ৳{formatPrice(cost)}
                          </td>

                          {/* Selling Price */}
                          <td className="p-3 font-mono font-bold text-orange-600">
                            ৳{formatPrice(p.price)}
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="block text-[10px] text-gray-400 line-through">
                                ৳{formatPrice(p.originalPrice)}
                              </span>
                            )}
                          </td>

                          {/* Profit & Margin */}
                          <td className="p-3 font-mono">
                            <span className="font-black text-emerald-700 block">
                              +৳{formatPrice(unitP)}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              {margin}%
                            </span>
                          </td>

                          {/* Stock */}
                          <td className="p-3 font-mono font-bold">
                            <span className={p.stock <= 5 ? 'text-red-600' : 'text-gray-900'}>
                              {p.stock}
                            </span>
                          </td>

                          {/* Expiry Status */}
                          <td className="p-3">
                            {expDetails.status === 'none' ? (
                              <span className="text-gray-500 text-[11px]">
                                {expDetails.label}
                              </span>
                            ) : expDetails.status === 'expired' ? (
                              <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[11px] block">
                                {expDetails.label}
                              </span>
                            ) : expDetails.status === 'warning' ? (
                              <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px] block">
                                {expDetails.label}
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] block">
                                {expDetails.label}
                              </span>
                            )}
                          </td>

                          {/* Delete Action */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'bn' ? `আপনি কি '${p.titleBn.slice(0, 20)}' মুছে ফেলতে চান?` : `Delete '${p.titleEn.slice(0, 20)}'?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                              title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-gray-900 pb-2 border-b">
                {t.customerOrdersTitle}
              </h4>
              {orders.length > 0 ? (
                orders.map((ord) => (
                  <div key={ord.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2">
                      <div>
                        <span className="font-black text-gray-900 text-sm">#{ord.id}</span>
                        <span className="text-gray-500 text-[11px] ml-2">{ord.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(ord.id, e.target.value)}
                          className="p-1 bg-white border border-gray-300 rounded font-bold text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600">
                      <div>
                        <p><strong>{lang === 'bn' ? 'গ্রাহক:' : 'Customer:'}</strong> {ord.customer.fullName} ({ord.customer.phone})</p>
                        <p><strong>{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {ord.customer.address}, {ord.customer.thana}, {ord.customer.district}</p>
                      </div>
                      <div className="sm:text-right">
                        <p><strong>{lang === 'bn' ? 'পেমেন্ট:' : 'Payment:'}</strong> <span className="uppercase text-blue-700 font-bold">{ord.paymentMethod}</span></p>
                        <p><strong>{lang === 'bn' ? 'মোট প্রদেয়:' : 'Total:'}</strong> <span className="text-orange-600 font-black text-sm">৳{formatPrice(ord.total)}</span></p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {lang === 'bn' ? 'এখনো কোনো নতুন অর্ডার আসেনি।' : 'No orders placed yet.'}
                </div>
              )}
            </div>
          )}

          {/* TAB: VOUCHER & DISCOUNT CODE MANAGEMENT (মালিকের জন্য ভাউচার পরিবর্তন) */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {lang === 'bn' ? 'অফার ও কুপন কন্ট্রোল প্যানেল' : 'Promo & Voucher Control'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                      <Ticket className="w-6 h-6" />
                      <span>{lang === 'bn' ? 'ভাউচার কোড ব্যবস্থাপনা' : 'Voucher Code Management'}</span>
                    </h2>
                    <p className="text-xs text-orange-100 mt-1 max-w-xl">
                      {lang === 'bn' 
                        ? 'দোকানের মালিক MD. ALIM BISSAS এখানে যেকোনো সময় হোমপেজের ভাউচার কোড (যেমন: BISWAS10) পরিবর্তন করতে পারবেন, এবং যেকোনো উৎসব বা বিশেষ দিনে নতুন নতুন ভাউচার তৈরি বা বাতিল করতে পারবেন।'
                        : 'Store owner MD. ALIM BISSAS can change the primary homepage voucher code anytime and create new discount vouchers.'}
                    </p>
                  </div>
                  <button
                    onClick={handleResetDefaultVouchers}
                    className="bg-white/10 hover:bg-white/25 border border-white/30 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডিফল্ট রিস্টোর' : 'Reset Defaults'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback Success Message */}
              {voucherMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn shadow-xs">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{voucherMsg}</span>
                </div>
              )}

              {/* SECTION 1: QUICK CHANGE PRIMARY HERO PROMO CODE */}
              <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                      {lang === 'bn' ? 'হোমপেজে প্রদর্শিত প্রধান ভাউচার কোড পরিবর্তন' : 'Quickly Change Hero Voucher Code'}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {lang === 'bn' ? 'ওয়েবসাইট ব্যানারে সক্রিয়' : 'Active on Website'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-amber-200">
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500">{lang === 'bn' ? 'বর্তমানে সাইটের ব্যানার ও কার্টে ব্যবহৃত কোড:' : 'Currently active voucher code:'}</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xl sm:text-2xl font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                        {activePromoVoucher?.code || 'BISWAS10'}
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        ({activePromoVoucher?.titleBn || '১০% ছাড়'} — {activePromoVoucher?.descriptionBn || '১৫০০ টাকায় প্রযোজ্য'})
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleQuickUpdatePromo} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={quickPromoCode}
                      onChange={(e) => setQuickPromoCode(e.target.value.toUpperCase())}
                      placeholder={lang === 'bn' ? "নতুন কোড লিখুন (যেমন: EID2026, ALIM20, BOISHAKH)" : "Enter new code (e.g. EID2026, ALIM20)"}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase outline-none focus:border-orange-500 shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'প্রধান কোড আপডেট করুন' : 'Update Primary Code'}</span>
                  </button>
                </form>
              </div>

              {/* SECTION 2: ADD NEW VOUCHER FORM */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <Plus className="w-5 h-5 text-orange-600" />
                  <h3 className="font-black text-gray-900 text-sm sm:text-base">
                    {lang === 'bn' ? 'নতুন ভাউচার ও ছাড় কুপন যোগ করুন' : 'Create New Voucher Coupon'}
                  </h3>
                </div>

                <form onSubmit={handleCreateVoucher} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    
                    {/* Voucher Code */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'ভাউচার কোড *' : 'Voucher Code *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newVCode}
                        onChange={(e) => setNewVCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SPECIAL20"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500 font-mono font-bold uppercase"
                      />
                    </div>

                    {/* Discount Type */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'ছাড়ের ধরন *' : 'Discount Type *'}
                      </label>
                      <select
                        value={newVDiscountType}
                        onChange={(e) => setNewVDiscountType(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500 font-medium"
                      >
                        <option value="percent">{lang === 'bn' ? 'শতাংশ (%) ছাড় (যেমন: ১০% বা ১৫%)' : 'Percentage (%) Discount'}</option>
                        <option value="fixed">{lang === 'bn' ? 'ফিক্সড টাকা (৳) ছাড় (যেমন: ৫০৳ বা ১০০৳)' : 'Fixed Amount (৳) Discount'}</option>
                      </select>
                    </div>

                    {/* Discount Amount */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {newVDiscountType === 'percent' 
                          ? (lang === 'bn' ? 'ছাড়ের শতকরা হার (%) *' : 'Discount Percent (%) *') 
                          : (lang === 'bn' ? 'ছাড়ের টাকার পরিমাণ (৳) *' : 'Discount Amount (৳) *')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={newVDiscountType === 'percent' ? "90" : "10000"}
                        required
                        value={newVDiscountVal}
                        onChange={(e) => setNewVDiscountVal(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500 font-bold"
                      />
                    </div>

                    {/* Minimum Spend */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'ন্যূনতম অর্ডারের পরিমাণ (৳) *' : 'Minimum Spend (৳) *'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newVMinSpend}
                        onChange={(e) => setNewVMinSpend(e.target.value)}
                        placeholder="e.g. 1500"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Max Discount Cap */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'সর্বোচ্চ ছাড়ের সীমা (৳)' : 'Max Discount Cap (৳)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newVMaxDiscount}
                        onChange={(e) => setNewVMaxDiscount(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'মেয়াদ উত্তীর্ণের তারিখ' : 'Expiry Date'}
                      </label>
                      <input
                        type="text"
                        value={newVExpDate}
                        onChange={(e) => setNewVExpDate(e.target.value)}
                        placeholder="e.g. ২০২৬-১২-৩১"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Title Bn */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'ভাউচারের শিরোনাম (Title) *' : 'Voucher Title *'}
                      </label>
                      <input
                        type="text"
                        value={newVTitle}
                        onChange={(e) => setNewVTitle(e.target.value)}
                        placeholder={lang === 'bn' ? "e.g. ১৫% উৎসব মেগা ছাড়" : "e.g. 15% Festive Mega Deal"}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Description Bn */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'শর্ত ও বিবরণ (Description)' : 'Rules & Description'}
                      </label>
                      <input
                        type="text"
                        value={newVDesc}
                        onChange={(e) => setNewVDesc(e.target.value)}
                        placeholder={lang === 'bn' ? "e.g. ১৫০০ টাকার কেনাকাটায় সর্বোচ্চ ৫০০ টাকা ছাড়" : "e.g. Max ৳500 off on ৳1500 min spend"}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Make Primary Checkbox */}
                  <label className="flex items-center space-x-2.5 p-3 bg-orange-50/60 rounded-xl border border-orange-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newVIsPrimary}
                      onChange={(e) => setNewVIsPrimary(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="font-bold text-gray-900">
                      {lang === 'bn' 
                        ? '⭐ এই ভাউচারটিকে প্রধান ভাউচার হিসেবে হোমপেজের ব্যানারে সরাসরি সক্রিয় করুন' 
                        : '⭐ Set this voucher as the primary featured promo on the homepage banner'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'নতুন ভাউচার যুক্ত করুন' : 'Add Voucher'}</span>
                  </button>
                </form>
              </div>

              {/* SECTION 3: LIST OF ALL ACTIVE VOUCHERS */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    <h3 className="font-black text-gray-900 text-sm sm:text-base">
                      {lang === 'bn' ? `সকল সক্রিয় ভাউচারের তালিকা (${(vouchers || []).length} টি)` : `All Active Vouchers (${(vouchers || []).length})`}
                    </h3>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {lang === 'bn' ? 'যে কোনো ভাউচারকে ১-ক্লিকে প্রধান ভাউচার বানাতে পারেন' : 'Click to promote any voucher to primary'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(vouchers || []).map((v) => (
                    <div 
                      key={v.id || v.code}
                      className={`p-4 rounded-xl border-2 transition relative flex flex-col justify-between space-y-3 ${
                        v.isPrimary 
                          ? 'border-orange-500 bg-orange-50/60 shadow-sm' 
                          : 'border-gray-200 bg-gray-50/70 hover:border-orange-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-lg font-black text-gray-900 bg-white border border-gray-300 px-2.5 py-0.5 rounded-lg shadow-2xs">
                            {v.code}
                          </span>
                          {v.isPrimary ? (
                            <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'প্রধান ভাউচার' : 'Primary'}</span>
                            </span>
                          ) : (
                            <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {lang === 'bn' ? 'সাধারণ কুপন' : 'Secondary'}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 mt-1">{v.titleBn}</h4>
                        <p className="text-[11px] text-gray-600 mt-0.5">{v.descriptionBn}</p>

                        <div className="mt-2.5 space-y-1 text-[11px] text-gray-600 border-t border-gray-200/60 pt-2">
                          <p className="flex justify-between">
                            <span>{lang === 'bn' ? 'ছাড়:' : 'Discount:'}</span>
                            <strong className="text-emerald-700">
                              {v.discountPercent > 0 ? `${v.discountPercent}%` : `৳${v.fixedDiscount || 0}`}
                            </strong>
                          </p>
                          <p className="flex justify-between">
                            <span>{lang === 'bn' ? 'ন্যূনতম অর্ডার:' : 'Min Spend:'}</span>
                            <span>৳{v.minSpend || 0}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>{lang === 'bn' ? 'সর্বোচ্চ ছাড়:' : 'Max Discount:'}</span>
                            <span>৳{v.maxDiscount || 'অসীম'}</span>
                          </p>
                          {v.expiryDate && (
                            <p className="flex justify-between text-gray-400">
                              <span>{lang === 'bn' ? 'মেয়াদ:' : 'Expiry:'}</span>
                              <span>{v.expiryDate}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                        {!v.isPrimary && (
                          <button
                            onClick={() => handleSetPrimaryVoucher(v.code)}
                            className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-[11px] py-1.5 px-2 rounded-lg transition text-center"
                          >
                            {lang === 'bn' ? 'প্রধান কোড বানান' : 'Make Primary'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVoucher(v.code)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={lang === 'bn' ? 'মুছুন' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: PASSWORD CHANGE FOR OWNER MD. ALIM BISSAS */}
          {activeTab === 'security' && (
            <div className="max-w-md mx-auto py-6 space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-gray-900">
                  {lang === 'bn' ? 'অ্যাডমিন মাস্টার পাসওয়ার্ড পরিবর্তন' : 'Change Admin Master Password'}
                </h4>
                <p className="text-xs text-gray-500">
                  {lang === 'bn' 
                    ? 'প্রতিষ্ঠাতা ও মালিক MD. ALIM BISSAS-এর জন্য প্যানেল সিকিউরিটি কন্ট্রোল।' 
                    : 'Security control for Founder & Owner MD. ALIM BISSAS.'}
                </p>
              </div>

              {passSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold text-center animate-fadeIn">
                  {passSuccessMsg}
                </div>
              )}

              {passErrorMsg && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-bold text-center animate-fadeIn">
                  {passErrorMsg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {lang === 'bn' ? 'বর্তমান পাসওয়ার্ড:' : 'Current Password:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="e.g. alim2026"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {lang === 'bn' ? 'নতুন পাসওয়ার্ড:' : 'New Password:'}
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder={lang === 'bn' ? "নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৪ অক্ষর)" : "Enter new password (min 4 chars)"}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {lang === 'bn' ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন (কনফার্ম):' : 'Confirm New Password:'}
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    placeholder={lang === 'bn' ? "নতুন পাসওয়ার্ডটি আবার লিখুন" : "Confirm new password"}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg transition shadow-md mt-2 flex items-center justify-center space-x-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}</span>
                </button>
              </form>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                <p className="font-bold">💡 {lang === 'bn' ? 'গুরুত্বপূর্ণ নোট:' : 'Important Note:'}</p>
                <p>
                  {lang === 'bn' 
                    ? 'মালিক MD. ALIM BISSAS তার পাসওয়ার্ড পরিবর্তন করলে তা ব্রাউজারের সুরক্ষায় সংরক্ষিত থাকবে।' 
                    : 'Owner MD. ALIM BISSAS can change the password anytime and it persists locally.'}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
