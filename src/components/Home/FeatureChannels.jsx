import React from 'react';
import { ShoppingBag, Flame, Ticket, ShieldCheck, Smartphone } from 'lucide-react';

export function FeatureChannels({ lang, onScrollToSection, onOpenVouchers, t }) {
  const channels = [
    {
      id: 'mart',
      title: t.channelMartTitle,
      desc: t.channelMartDesc,
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      action: () => onScrollToSection('all-products')
    },
    {
      id: 'flash',
      title: t.channelFlashTitle,
      desc: t.channelFlashDesc,
      icon: <Flame className="w-5 h-5 text-red-600 animate-pulse" />,
      bg: 'bg-red-50 border-red-200',
      action: () => onScrollToSection('flash-sale')
    },
    {
      id: 'vouchers',
      title: t.channelVoucherTitle,
      desc: t.channelVoucherDesc,
      icon: <Ticket className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      action: onOpenVouchers
    },
    {
      id: 'brands',
      title: t.channelBrandsTitle,
      desc: t.channelBrandsDesc,
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
      action: () => onScrollToSection('brands')
    },
    {
      id: 'recharge',
      title: t.channelRechargeTitle,
      desc: t.channelRechargeDesc,
      icon: <Smartphone className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
      action: () => alert(lang === 'bn' ? "মোবাইল রিচার্জ সেবা: ডায়াল করুন +8801723152730" : "Mobile recharge service: Dial +8801723152730")
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {channels.map((ch) => (
          <div
            key={ch.id}
            onClick={ch.action}
            className={`cursor-pointer rounded-xl p-3 border flex items-center space-x-3 hover:shadow-md transition transform hover:-translate-y-0.5 bg-white`}
          >
            <div className={`p-2.5 rounded-xl border ${ch.bg} flex-shrink-0`}>
              {ch.icon}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-gray-800 truncate">
                {ch.title}
              </h4>
              <p className="text-[11px] text-gray-500 truncate">
                {ch.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
