import React from 'react';
import {
  ArrowRight,
  Brain,
  Camera,
  CheckCircle2,
  ChevronRight,
  Leaf,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';

interface LandingProps {
  onGetStarted: () => void;
}

const marqueeItems = [
  'AI Waste Analysis',
  'Zone-Based Mapping',
  'Gamification System',
  'Real Rewards',
  'Citizen Watchdog',
  'Analytics Dashboard',
];

export const LandingPage: React.FC<LandingProps> = ({ onGetStarted }) => {
  const { theme, toggleTheme } = useTheme();
  const [spot, setSpot] = React.useState({ x: 50, y: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y });
  };

  const goToFeatures = () => {
    const section = document.getElementById('feature-grid');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div
      onMouseMove={onMove}
      className="min-h-screen bg-[#f4f7f3] text-slate-900 dark:bg-[#07130f] dark:text-slate-100 overflow-x-hidden"
      style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
    >
      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(8px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes pulseSoft {
          0% { opacity: .35; }
          50% { opacity: .75; }
          100% { opacity: .35; }
        }
        .drift {
          animation: drift 6s ease-in-out infinite;
        }
        .pulse-soft {
          animation: pulseSoft 5s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-80 dark:opacity-70"
          style={{
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(37,161,103,.28), rgba(9,22,17,0) 38%)`,
          }}
        />
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#9ee8bd]/40 blur-3xl pulse-soft" />
        <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-[#8bc7ff]/30 blur-3xl drift" />
      </div>

      <nav className="fixed top-0 inset-x-0 z-40 border-b border-slate-200/50 dark:border-emerald-900/50 backdrop-blur-xl bg-[#f4f7f3]/75 dark:bg-[#07130f]/70">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-slate-300/70 dark:border-emerald-800/70 text-slate-600 dark:text-emerald-200 hover:bg-white/70 dark:hover:bg-emerald-900/40 transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} className="mx-auto" /> : <Moon size={17} className="mx-auto" />}
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 md:px-6 py-2.5 rounded-full text-sm md:text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-300/35 dark:shadow-emerald-800/40"
            >
              Launch Zero
            </button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-28 md:pt-36 pb-14 md:pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_.85fr] gap-10 md:gap-14 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-300/60 dark:border-emerald-700/60 bg-white/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm mb-5">
              <Sparkles size={14} /> AI-Powered Smart Waste Management
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[.96]">
              Clean cities
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                start from zero.
              </span>
            </h1>

            <p className="mt-5 md:mt-7 max-w-2xl text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
              Report waste, earn rewards, track cleanups in real-time. Join the movement making Dhaka cleaner, one report at a time.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={onGetStarted}
                className="group px-7 py-3.5 rounded-2xl bg-slate-950 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm md:text-base inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
              >
                Start Reporting Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={goToFeatures}
                className="px-7 py-3.5 rounded-2xl border border-slate-300 dark:border-emerald-800 font-semibold text-sm md:text-base text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-emerald-950/40 transition-colors"
              >
                Explore Features
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <PulseMetric value="2.4K+" label="Reports Filed" icon={<Camera size={14} />} />
              <PulseMetric value="89%" label="Resolved" icon={<CheckCircle2 size={14} />} />
              <PulseMetric value="45K+" label="Rewards Paid" icon={<Wallet size={14} />} />
              <PulseMetric value="18m" label="Avg response" icon={<Zap size={14} />} />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/70 dark:border-emerald-900/70 bg-white/70 dark:bg-[#0b1c16]/75 backdrop-blur-xl shadow-2xl shadow-emerald-500/15 dark:shadow-emerald-950/60 p-4 md:p-5">
              <img
                src="https://plus.unsplash.com/premium_photo-1726704235738-c5d97caeb391?w=600&h=700&auto=format&fit=crop&q=80"
                alt="Urban cleanup coordination"
                className="h-[420px] w-full object-cover rounded-[1.45rem]"
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <GlassStat title="AI Confidence" value="92%" note="Image parsed in 2.1s" />
                <GlassStat title="Verification" value="3 checks" note="Citizen + admin + AI" />
              </div>
            </div>

            <div className="absolute -left-6 top-16 hidden md:block drift">
              <FloatingChip label="AI severity: HIGH" tone="teal" />
            </div>
            <div className="absolute -right-4 bottom-24 hidden md:block drift" style={{ animationDelay: '1.4s' }}>
              <FloatingChip label="Reward released" tone="amber" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-slate-200/60 dark:border-emerald-900/50 bg-white/60 dark:bg-[#081712]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 md:px-0">
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
            {marqueeItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3.5 py-2 rounded-full border border-slate-200 dark:border-emerald-900/70 bg-white/80 dark:bg-emerald-950/35 text-sm md:text-[15px] font-semibold text-slate-700 dark:text-emerald-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="feature-grid" className="relative z-10 px-4 md:px-8 py-14 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300 font-bold">Powerful Features</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-black leading-tight">Everything you need for cleaner cities</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-4 md:gap-5">
            <BentoCard
              className="md:col-span-7"
              icon={<Brain size={20} />}
              title="AI Waste Analysis"
              text="Upload a photo and our AI detects waste composition, estimates volume, and suggests cleanup priority."
              accent="from-cyan-500 to-teal-500"
            />
            <BentoCard
              className="md:col-span-5"
              icon={<ShieldCheck size={20} />}
              title="Zone-Based Mapping"
              text="Interactive maps with polygon zones. Click to report, see zone cleanliness scores in real-time."
              accent="from-emerald-500 to-lime-500"
            />
            <BentoCard
              className="md:col-span-4"
              icon={<Trophy size={20} />}
              title="Gamification System"
              text="Earn Green Points, unlock badges, climb leaderboards. Make waste reporting fun and rewarding."
              accent="from-amber-500 to-orange-500"
            />
            <BentoCard
              className="md:col-span-8"
              icon={<Wallet size={20} />}
              title="Real Rewards"
              text="Cleaners earn real money (BDT) for completing tasks. Transparent payment tracking."
              accent="from-slate-800 to-slate-600"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 md:px-8 pb-14 md:pb-24">
        <div className="max-w-7xl mx-auto rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-emerald-200/60 dark:border-emerald-900/60 bg-gradient-to-br from-[#082116] via-[#0a2d1e] to-[#0f4330]">
          <div className="p-8 md:p-14 lg:p-20 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-emerald-200/90">
                <Sparkles size={14} /> Join the movement
              </p>
              <h3 className="mt-3 text-3xl md:text-5xl font-black text-white leading-tight">
                Ready to make a
                <span className="block text-emerald-300">difference?</span>
              </h3>
              <p className="mt-4 text-emerald-100/90 max-w-xl text-sm md:text-base">
                Join thousands of citizens already making Dhaka cleaner. Start earning points today!
              </p>
              <button
                onClick={onGetStarted}
                className="mt-7 group px-7 py-3.5 rounded-2xl bg-white text-emerald-800 font-bold text-sm md:text-base inline-flex items-center gap-2 hover:bg-emerald-50 transition-colors"
              >
                Get Started Free
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid gap-3">
              <Testimonial label="Citizen" quote="I report in 20 seconds and can see cleanup proof in one place." />
              <Testimonial label="Cleaner" quote="Payment and reputation are finally tied to real completed work." />
              <Testimonial label="Admin" quote="I can approve, verify, and release payouts without chaos." />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 md:px-8 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto rounded-[2rem] border border-slate-200/70 dark:border-emerald-900/70 bg-white/70 dark:bg-[#0a1c15]/55 backdrop-blur-sm p-6 md:p-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Meet the Team</h2>
            <p className="text-slate-600 dark:text-slate-400">The developers behind Zero Waste Management</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            <DeveloperCard name="Ahammad Shawki" role="2305067" avatar="/team/ahammad-shawki.jpg" />
            <DeveloperCard name="SM Abu Fayeem" role="2305070" avatar="/team/sm-abu-fayeem.jpg" />
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-4 md:px-8 pb-10 md:pb-12">
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-300/60 dark:border-emerald-900/70 flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
            2026 Zero Waste Management. Building cleaner cities for Bangladesh.
          </p>
        </div>
      </footer>
    </div>
  );
};

const PulseMetric = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-slate-200/70 dark:border-emerald-900/70 bg-white/70 dark:bg-emerald-950/35 px-3 py-3 md:px-4 md:py-3.5 backdrop-blur-sm">
    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">{icon}</div>
    <div className="mt-1 text-lg md:text-2xl font-black">{value}</div>
    <div className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400">{label}</div>
  </div>
);

const GlassStat = ({ title, value, note }: { title: string; value: string; note: string }) => (
  <div className="rounded-2xl border border-slate-200/70 dark:border-emerald-800/70 bg-white/75 dark:bg-[#0f2a1f]/70 p-3">
    <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-emerald-200/70">{title}</p>
    <p className="text-xl font-black mt-0.5 text-slate-900 dark:text-emerald-100">{value}</p>
    <p className="text-xs text-slate-500 dark:text-emerald-200/70">{note}</p>
  </div>
);

const FloatingChip = ({ label, tone }: { label: string; tone: 'teal' | 'amber' }) => {
  const toneClass = tone === 'teal'
    ? 'bg-teal-500/90 text-white shadow-teal-500/30'
    : 'bg-amber-400/90 text-slate-900 shadow-amber-500/30';

  return (
    <div className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xl ${toneClass}`}>
      {label}
    </div>
  );
};

const BentoCard = ({
  className,
  icon,
  title,
  text,
  accent,
}: {
  className: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  accent: string;
}) => (
  <article className={`${className} rounded-3xl p-5 md:p-7 border border-slate-200/70 dark:border-emerald-900/70 bg-white/80 dark:bg-[#0a1c15]/60 backdrop-blur-sm group hover:-translate-y-0.5 transition-transform`}>
    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${accent} text-white flex items-center justify-center`}>
      {icon}
    </div>
    <h3 className="mt-4 text-xl md:text-2xl font-black leading-tight">{title}</h3>
    <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300">{text}</p>
  </article>
);

const Testimonial = ({ label, quote }: { label: string; quote: string }) => (
  <div className="rounded-2xl border border-emerald-300/20 bg-white/10 p-4 md:p-5 text-emerald-50 backdrop-blur-sm">
    <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-emerald-200/80">{label}</p>
    <p className="mt-2 text-sm md:text-base leading-relaxed">{quote}</p>
  </div>
);

const DeveloperCard = ({ name, role, avatar }: { name: string; role: string; avatar: string }) => (
  <div className="rounded-2xl border border-slate-200/70 dark:border-emerald-900/70 bg-white/85 dark:bg-[#0c231a]/70 p-5 md:p-7 text-center shadow-sm">
    <img
      src={avatar}
      alt={name}
      className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 border-4 border-emerald-100 dark:border-emerald-900 object-cover"
    />
    <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg">{name}</h3>
    <p className="text-emerald-600 dark:text-emerald-300 text-sm">{role}</p>
  </div>
);
