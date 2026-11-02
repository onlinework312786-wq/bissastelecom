import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export function LiveClock({ lang = 'bn' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bengali numerals converter
  const toBnNum = (num) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
  };

  const dayOfWeek = now.getDay();
  const dayOfMonth = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const pad = (n) => (n < 10 ? '0' + n : String(n));

  if (lang === 'bn') {
    const bnDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const bnMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const dayName = bnDays[dayOfWeek];
    const dateNum = toBnNum(dayOfMonth);
    const monthName = bnMonths[month];
    const yearNum = toBnNum(year);
    const timeStr = `${toBnNum(hours)}:${toBnNum(pad(minutes))}:${toBnNum(pad(seconds))} ${ampm}`;

    return (
      <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-xs">
        <span className="flex items-center space-x-1 text-orange-600">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{dayName}, {dateNum} {monthName} {yearNum}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center space-x-1 text-blue-700 font-mono font-bold">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse flex-shrink-0" />
          <span>{timeStr}</span>
        </span>
      </div>
    );
  }

  // English Mode
  const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = enDays[dayOfWeek];
  const dateNum = dayOfMonth;
  const monthName = enMonths[month];
  const yearNum = year;
  const timeStr = `${hours}:${pad(minutes)}:${pad(seconds)} ${ampm}`;

  return (
    <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-xs">
      <span className="flex items-center space-x-1 text-orange-600">
        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{dayName}, {dateNum} {monthName} {yearNum}</span>
      </span>
      <span className="text-gray-300">|</span>
      <span className="flex items-center space-x-1 text-blue-700 font-mono font-bold">
        <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse flex-shrink-0" />
        <span>{timeStr}</span>
      </span>
    </div>
  );
}
