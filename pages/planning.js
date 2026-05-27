import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Planning() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dateInfo, setDateInfo] = useState({ date: '', formattedDate: '', time: '', food: '' });
  const [showCopyMsg, setShowCopyMsg] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const generatePlan = () => ({
    date: dateInfo.formattedDate || 'Soon',
    time: dateInfo.time || 'Evening',
    food: dateInfo.food || 'Something tasty',
  });

  const planText = () => {
    const p = generatePlan();
    return `💖 Our Date Plan 💖\n📅 Date: ${p.date}\n⏰ Time: ${p.time}\n🍽️ Eating: ${p.food}\n\nCan't wait to see you! ✨`;
  };

  const copyPlan = () => {
    navigator.clipboard.writeText(planText());
    setShowCopyMsg(true);
    setTimeout(() => setShowCopyMsg(false), 2000);
  };

  const sendToMe = () => {
    window.location.href = `sms:?body=${encodeURIComponent(planText())}`;
  };

  const next = () => {
    if (step === 1 && (!dateInfo.date || !dateInfo.time)) return alert('Please select a date and time 💕');
    if (step === 2 && !dateInfo.food) return alert('Pick something yummy to eat! 🍕');
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const timeOptions = [
    '10:00 AM (Brunch ☕)',
    '12:00 PM (Lunch 🥗)',
    '3:00 PM (Coffee date ☕)',
    '5:00 PM (Early dinner 🍽️)',
    '7:00 PM (Dinner date 🌙)',
    '8:00 PM (Romantic evening ✨)',
  ];

  const foodOptions = [
    { emoji: '🍕', name: 'Pizza', desc: 'Classic & cheesy' },
    { emoji: '🍔', name: 'Chicken Burger', desc: 'Juicy & crispy' },
    { emoji: '🍣', name: 'Sushi', desc: 'Fresh & fancy' },
    { emoji: '🍝', name: 'Pasta', desc: 'Cozy & creamy' },
    { emoji: '🥗', name: 'Healthy Bowl', desc: 'Fresh & light' },
    { emoji: '🌮', name: 'Tacos', desc: 'Spicy & fun' },
  ];

  const stepContent = {
    0: (
      <div className="text-center space-y-6">
        <div className="text-6xl">🎭</div>
        <h2 className="text-2xl md:text-3xl font-bold text-rose-600">My little speech...</h2>
        <div className="bg-rose-50 p-5 md:p-6 rounded-2xl border border-rose-200">
          <p className="text-gray-700 italic text-base md:text-lg">
            "If I had said no, here's what I would have said... But I'm SO happy you said YES! 💖 You make my world brighter. Now let's plan the most magical date ever!"
          </p>
          <p className="mt-4 text-rose-500 font-semibold">✨ To the moon and back, I'm excited! ✨</p>
        </div>
        <button onClick={next} className="btn-primary w-full py-3 text-base">Let's plan the date! ➡️</button>
      </div>
    ),
    1: (
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-5xl">📅</span>
          <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mt-2">When are you free?</h2>
          <p className="text-gray-500 text-sm md:text-base">Pick a date & time that makes your heart flutter</p>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Pick a date ✨</label>
          <input
            type="date"
            min={getMinDate()}
            value={dateInfo.date}
            onChange={(e) => setDateInfo({ ...dateInfo, date: e.target.value, formattedDate: formatDate(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-300 text-base"
          />
        </div>
        {dateInfo.formattedDate && (
          <p className="text-rose-500 text-sm -mt-3">Selected: {dateInfo.formattedDate}</p>
        )}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">What time feels right? ⏰</label>
          <select
            value={dateInfo.time}
            onChange={(e) => setDateInfo({ ...dateInfo, time: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-300 text-base"
          >
            <option value="">Select a time</option>
            {timeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button onClick={back} className="btn-secondary flex-1 py-3">← Back</button>
          <button onClick={next} className="btn-primary flex-1 py-3">Next →</button>
        </div>
      </div>
    ),
    2: (
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-5xl">🍽️</span>
          <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mt-2">What are we feeling to eat?</h2>
          <p className="text-gray-500 text-sm md:text-base">Pick your craving, my treat! 💕</p>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {foodOptions.map((food) => (
            <div
              key={food.name}
              onClick={() => setDateInfo({ ...dateInfo, food: food.name })}
              className={`food-option ${dateInfo.food === food.name ? 'food-selected' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{food.emoji}</span>
                <div>
                  <p className="font-bold text-base md:text-lg">{food.name}</p>
                  <p className="text-xs md:text-sm text-gray-500">{food.desc}</p>
                </div>
              </div>
              {dateInfo.food === food.name && <span className="text-rose-500 font-bold text-xl">✓</span>}
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <button onClick={back} className="btn-secondary flex-1 py-3">← Back</button>
          <button onClick={next} className="btn-primary flex-1 py-3">Next →</button>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mt-2">Our Date Plan is Ready!</h2>
          <p className="text-gray-500 text-sm md:text-base">Here's what we have planned, lovely ✨</p>
        </div>
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-200 shadow-inner">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-base md:text-lg flex-wrap">
              <span className="text-2xl">📅</span>
              <span className="font-semibold">Date:</span>
              <span className="text-gray-700 break-words">{generatePlan().date}</span>
            </div>
            <div className="flex items-center gap-3 text-base md:text-lg flex-wrap">
              <span className="text-2xl">⏰</span>
              <span className="font-semibold">Time:</span>
              <span className="text-gray-700">{generatePlan().time}</span>
            </div>
            <div className="flex items-center gap-3 text-base md:text-lg flex-wrap">
              <span className="text-2xl">🍽️</span>
              <span className="font-semibold">Eating:</span>
              <span className="text-gray-700">{generatePlan().food}</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-rose-200 text-center">
            <p className="text-rose-600 font-medium">💖 Can't wait to see your beautiful smile! 💖</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={copyPlan}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition text-base"
          >
            📋 Copy the plan and send it to me
          </button>
          
          <button onClick={() => router.push('/')} className="btn-secondary w-full mt-2 py-3">
            🔄 Start Over
          </button>
        </div>
        {showCopyMsg && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm animate-bounce z-50">
            Plan copied! Now send it to me 💕
          </div>
        )}
      </div>
    ),
  };

  return (
    <>
      <Head>
        <title>Let's Plan Our Date! 💑</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full">
          {/* Progress bar - responsive */}
          <div className="mb-6 flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    step >= i ? 'bg-rose-500 w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
          {stepContent[step]}
        </div>
      </div>
    </>
  );
}