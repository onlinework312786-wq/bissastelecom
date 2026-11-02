import React, { useState } from 'react';
import { X, User, Phone, Lock, Eye, EyeOff, LogOut, Package, ArrowLeft, CheckCircle2, KeyRound, Camera, UploadCloud, Trash2, Image, Sparkles } from 'lucide-react';

export function AuthModal({ isOpen, onClose, currentUser, setCurrentUser, userOrders, onTrackOrder, lang, t }) {
  if (!isOpen) return null;

  // Views: 'login', 'register', 'forgot', 'otp', 'reset-success'
  const [authView, setAuthView] = useState('login');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [resetPhone, setResetPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile Picture (Avatar) State
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  // Handle local image file upload from PC/mobile with canvas compression
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedData = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(compressedData);
        setAvatarPreview(compressedData);

        if (currentUser) {
          const updated = { ...currentUser, avatar: compressedData };
          setCurrentUser(updated);
          localStorage.setItem('bt_user', JSON.stringify(updated));
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const PRESET_AVATARS = [
    { label: "Executive", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" },
    { label: "Male Casual", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80" },
    { label: "Gentleman", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
    { label: "Techie", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone) {
      alert(lang === 'bn' ? "মোবাইল নম্বর প্রদান করুন" : "Please provide phone number");
      return;
    }
    const user = {
      name: authView === 'register' ? (name.trim() || (lang === 'bn' ? 'ব্যবহারকারী' : 'Customer')) : (lang === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed'),
      phone: phone || '+8801723152730',
      email: 'mdalimbissas24@gmail.com',
      avatar: avatar || (currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')
    };
    setCurrentUser(user);
    alert(authView === 'register' 
      ? (lang === 'bn' ? "রেজিস্ট্রেশন সফল হয়েছে!" : "Registration successful!") 
      : (lang === 'bn' ? "লগইন সফল হয়েছে!" : "Login successful!")
    );
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!resetPhone) {
      alert(lang === 'bn' ? "আপনার নিবন্ধিত মোবাইল নম্বর দিন" : "Enter your registered mobile number");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setAuthView('otp');
    alert(lang === 'bn' 
      ? `আপনার মোবাইল নম্বরে ৪ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে: ${code}` 
      : `4-digit verification OTP code sent to your phone: ${code}`
    );
  };

  const handleVerifyAndReset = (e) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp.trim()) {
      alert(lang === 'bn' ? "ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক কোড দিন।" : "Invalid OTP code! Please enter the correct code.");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      alert(lang === 'bn' ? "কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড দিন" : "Password must be at least 4 characters");
      return;
    }
    setAuthView('reset-success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleUp">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* ================= Profile & Orders Screen ================= */
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-200">
              <div className="relative inline-block mx-auto mb-2 group">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-20 h-20 rounded-full object-cover border-3 border-orange-500 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-orange-400">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-full cursor-pointer shadow-md transition" title={lang === 'bn' ? "ছবি পরিবর্তন করুন" : "Change Photo"}>
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{currentUser.name}</h3>
              <p className="text-xs text-gray-500 font-mono">{currentUser.phone}</p>
              <label className="mt-1 inline-flex items-center space-x-1 text-[11px] text-orange-600 hover:underline cursor-pointer font-semibold">
                <Camera className="w-3 h-3" />
                <span>{lang === 'bn' ? 'পিসি থেকে নতুন ছবি আপলোড করুন' : 'Upload photo from PC'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            {/* My Orders Section */}
            <div>
              <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-orange-600" />
                <span>{t.myOrdersSection} ({userOrders.length})</span>
              </h4>

              {userOrders.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {userOrders.map((ord, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-mono font-bold text-gray-800">{ord.orderId}</p>
                        <p className="text-[10px] text-gray-500">{ord.date} • {ord.status}</p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(ord.orderId);
                        }}
                        className="text-blue-600 font-semibold hover:underline text-[11px]"
                      >
                        {t.trackOrder}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 text-center">{t.noOrdersUser}</p>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logoutBtn}</span>
            </button>
          </div>
        ) : authView === 'forgot' ? (
          /* ================= Forgot Password View ================= */
          <div className="space-y-4">
            <button
              onClick={() => setAuthView('login')}
              className="text-xs text-gray-500 hover:text-orange-600 flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগইন পেজে ফিরুন' : 'Back to Login'}</span>
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'bn' 
                  ? 'আপনার অ্যাকাউন্টের মোবাইল নম্বর দিন, আমরা ওটিপি কোড পাঠাবো।' 
                  : 'Enter your registered phone number to receive an OTP code.'}
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.phoneLabel}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    placeholder="+88017xxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-orange-500/20"
              >
                {lang === 'bn' ? 'ওটিপি কোড পাঠান (Send OTP)' : 'Send Verification OTP'}
              </button>
            </form>
          </div>
        ) : authView === 'otp' ? (
          /* ================= Enter OTP & New Password View ================= */
          <div className="space-y-4">
            <button
              onClick={() => setAuthView('forgot')}
              className="text-xs text-gray-500 hover:text-orange-600 flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'পূর্বের পেজে যান' : 'Back'}</span>
            </button>

            <div className="text-center">
              <h3 className="text-lg font-black text-gray-900">
                {lang === 'bn' ? 'ওটিপি কোড ও নতুন পাসওয়ার্ড' : 'Enter OTP & New Password'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'bn' 
                  ? `${resetPhone} নম্বরে পাঠানো কোড ও নতুন পাসওয়ার্ড লিখুন` 
                  : `Enter the code sent to ${resetPhone} and set a new password`}
              </p>
            </div>

            <form onSubmit={handleVerifyAndReset} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  {lang === 'bn' ? '৪-ডিজিটের ওটিপি কোড' : '4-Digit OTP Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full text-center py-2 bg-gray-50 border border-gray-300 rounded-xl text-lg font-bold font-mono tracking-widest outline-none focus:bg-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={lang === 'bn' ? "নতুন পাসওয়ার্ড দিন" : "Enter new password"}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন নিশ্চিত করুন' : 'Confirm Password Reset'}
              </button>
            </form>
          </div>
        ) : authView === 'reset-success' ? (
          /* ================= Reset Success View ================= */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-gray-900">
              {lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!' : 'Password Reset Successful!'}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === 'bn' 
                ? 'আপনার নতুন পাসওয়ার্ড দিয়ে এখন সরাসরি লগইন করতে পারেন।' 
                : 'You can now log in using your newly set password.'}
            </p>
            <button
              onClick={() => setAuthView('login')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition"
            >
              {lang === 'bn' ? 'লগইন করুন' : 'Back to Login'}
            </button>
          </div>
        ) : (
          /* ================= Login / Register Form ================= */
          <div>
            <div className="text-center mb-5">
              <h3 className="text-xl font-black text-gray-900">
                {authView === 'register' ? t.createAccount : t.welcomeBiswas}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {authView === 'register' ? t.createAccountSub : t.welcomeBiswasSub}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              {authView === 'register' && (
                <>
                  {/* Profile Picture Upload Section */}
                  <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 text-center">
                    <label className="block font-bold text-gray-800 text-xs mb-2">
                      📷 {lang === 'bn' ? 'প্রোফাইল ছবি যুক্ত করুন (ঐচ্ছিক)' : 'Add Profile Picture (Optional)'}
                    </label>

                    <div className="flex items-center justify-center space-x-4">
                      {/* Avatar Preview */}
                      <div className="relative">
                        {avatarPreview ? (
                          <img 
                            src={avatarPreview} 
                            alt="Avatar Preview" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-orange-300 flex flex-col items-center justify-center text-orange-500">
                            <Camera className="w-6 h-6" />
                            <span className="text-[9px] font-semibold mt-0.5">{lang === 'bn' ? 'ছবি নেই' : 'No photo'}</span>
                          </div>
                        )}
                        {avatarPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setAvatar('');
                              setAvatarPreview('');
                            }}
                            className="absolute -top-1 -right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* File upload from PC button */}
                      <div className="text-left space-y-1">
                        <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-white hover:bg-orange-100 text-orange-700 border border-orange-300 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? '📁 পিসি থেকে ছবি বাছুন' : '📁 Choose from PC'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarUpload}
                            className="hidden" 
                          />
                        </label>
                        <p className="text-[10px] text-gray-500">
                          {lang === 'bn' ? 'JPG বা PNG ছবি অটো-রিসাইজ হবে' : 'JPG or PNG auto-resized'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Preset Avatars */}
                    <div className="mt-2.5 pt-2 border-t border-orange-200/60">
                      <p className="text-[10px] text-gray-600 font-medium mb-1.5">
                        {lang === 'bn' ? 'অথবা রেডিমেড ছবি সিলেক্ট করুন:' : 'Or pick a default avatar:'}
                      </p>
                      <div className="flex justify-center gap-2">
                        {PRESET_AVATARS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAvatar(p.url);
                              setAvatarPreview(p.url);
                            }}
                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                              avatarPreview === p.url ? 'border-orange-600 scale-110 shadow-sm' : 'border-gray-300 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">{t.nameLabel}</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={lang === 'bn' ? "যেমন: তানভীর আহমেদ" : "e.g. Tanvir Ahmed"}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.phoneLabel}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+88017xxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-600 font-semibold">{t.passwordLabel}</label>
                  {authView === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthView('forgot')}
                      className="text-orange-600 hover:underline text-[11px] font-semibold"
                    >
                      {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                    </button>
                  )}
                </div>

                {/* Password field with Eye/EyeOff Show/Hide toggle */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={lang === 'bn' ? "পাসওয়ার্ড লিখুন" : "Enter password"}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title={showPassword ? (lang === 'bn' ? 'পাসওয়ার্ড লুকান' : 'Hide password') : (lang === 'bn' ? 'পাসওয়ার্ড দেখুন' : 'Show password')}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm py-3 rounded-xl transition shadow-md shadow-orange-500/20"
              >
                {authView === 'register' ? t.registerSubmit : t.loginSubmit}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t text-center text-xs text-gray-500">
              {authView === 'register' ? (
                <p>
                  {t.alreadyHaveAccount}{' '}
                  <button onClick={() => setAuthView('login')} className="text-orange-600 font-bold hover:underline">
                    {t.loginSubmit}
                  </button>
                </p>
              ) : (
                <p>
                  {t.noAccountYet}{' '}
                  <button onClick={() => setAuthView('register')} className="text-orange-600 font-bold hover:underline">
                    {t.createAccount}
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
