import React from 'react';
import {
  ArrowRight,
  Leaf,
  MapPin,
  Users,
  Zap,
  Sparkles,
  Sun,
  Moon,
  Trophy,
  Star,
  Shield,
  CheckCircle,
  TrendingUp,
  Camera,
  Brain,
  Banknote,
  Award,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';

interface LandingProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onGetStarted }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="sm" className="sm:hidden" />
          <Logo size="md" className="hidden sm:flex" />
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-all hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-6 animate-pulse">
                <Sparkles className="w-4 h-4" />
                AI-Powered Smart Waste Management
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-4 sm:mb-6">
                Clean cities
                <span className="block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  start from zero.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                Report waste, earn rewards, track cleanups in real-time. Join the movement making Dhaka cleaner, one report at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-green-200 dark:hover:shadow-green-900/50 transition-all hover:-translate-y-0.5"
                >
                  Start Reporting Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Explore Features
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6">
                <StatCard value="2.4k+" label="Reports Filed" icon={<Camera size={16} />} />
                <StatCard value="89%" label="Resolved" icon={<CheckCircle size={16} />} />
                <StatCard value="৳45k+" label="Rewards Paid" icon={<Banknote size={16} />} />
              </div>
            </div>

            {/* Right - App Preview */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                <img
                  src="https://plus.unsplash.com/premium_photo-1726704235738-c5d97caeb391?w=600&h=700&auto=format&fit=crop&q=80"
                  alt="Clean environment"
                  className="relative rounded-3xl shadow-2xl border-8 border-white dark:border-slate-800 w-full h-[520px] object-cover"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">+25 Points!</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Report Approved</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">#5 on Leaderboard</span>
                </div>
              </div>

              <div className="absolute left-1/4 -bottom-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">AI: 85% Plastic Detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              One Platform, Three Roles
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Whether you're a citizen, cleaner, or administrator - Zero has everything you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              icon={<Users className="w-8 h-8" />}
              title="Citizens"
              color="green"
              features={['Report waste with photos', 'Earn Green Points', 'Track cleanup progress', 'Rate cleaner performance', 'Climb the leaderboard']}
            />
            <RoleCard
              icon={<Zap className="w-8 h-8" />}
              title="Cleaners"
              color="blue"
              features={['Browse available tasks', 'Earn real money (BDT)', 'Compete for top earnings', 'Build your reputation', 'Get AI-verified completions']}
            />
            <RoleCard
              icon={<Shield className="w-8 h-8" />}
              title="Administrators"
              color="purple"
              features={['Approve citizen reports', 'Create & assign tasks', 'Manage zone boundaries', 'Track city-wide analytics', 'Set task rewards']}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need for cleaner cities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI Waste Analysis"
              description="Upload a photo and our AI detects waste composition, estimates volume, and suggests cleanup priority."
              gradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Zone-Based Mapping"
              description="Interactive maps with polygon zones. Click to report, see zone cleanliness scores in real-time."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="Gamification System"
              description="Earn Green Points, unlock badges, climb leaderboards. Make waste reporting fun and rewarding."
              gradient="from-amber-500 to-orange-500"
            />
            <FeatureCard
              icon={<Banknote className="w-6 h-6" />}
              title="Real Rewards"
              description="Cleaners earn real money (BDT) for completing tasks. Transparent payment tracking."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Star className="w-6 h-6" />}
              title="Citizen Watchdog"
              description="Review completed cleanups with before/after comparison. Hold cleaners accountable."
              gradient="from-pink-500 to-rose-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Analytics Dashboard"
              description="Track reports by zone, monitor completion rates, view financial summaries all in one place."
              gradient="from-slate-600 to-slate-800"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Simple steps to a cleaner city</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="1" title="Spot Waste" description="See illegal dumping or overflowing bins in your area" icon={<Camera />} />
            <StepCard number="2" title="Report It" description="Snap a photo, AI analyzes it, drop a pin on the map" icon={<MapPin />} />
            <StepCard number="3" title="Task Created" description="Admin approves and creates a paid task for cleaners" icon={<CheckCircle />} />
            <StepCard number="4" title="Get Rewarded" description="Cleaner completes, you review, everyone earns points" icon={<Award />} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10 bg-white" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to make a difference?
              </h2>
              <p className="text-green-100 mb-8 max-w-lg mx-auto text-lg">
                Join thousands of citizens already making Dhaka cleaner. Start earning points today!
              </p>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-green-700 font-bold text-lg rounded-full hover:bg-green-50 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Meet the Team</h2>
            <p className="text-slate-600 dark:text-slate-400">The developers behind Zero Waste Management</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <DeveloperCard name="Ahammad Shawki" role="Full Stack Developer" avatar="https://i.pravatar.cc/150?img=12" />
            <DeveloperCard name="SM Abu Fayeem" role="Full Stack Developer" avatar="https://i.pravatar.cc/150?img=11" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Zero Waste Management. Building cleaner cities for Bangladesh.</p>
        </div>
      </footer>
    </div>
  );
};

// Component helpers
const StatCard = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <div className="text-center p-2 sm:p-4 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700">
    <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-600 dark:text-green-400 mb-1">{icon}</div>
    <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{label}</div>
  </div>
);

const RoleCard = ({ icon, title, color, features }: { icon: React.ReactNode; title: string; color: string; features: string[] }) => {
  const colors: Record<string, string> = {
    green: 'from-green-500 to-emerald-500 bg-green-100 dark:bg-green-900/30 text-green-600',
    blue: 'from-blue-500 to-cyan-500 bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    purple: 'from-purple-500 to-indigo-500 bg-purple-100 dark:bg-purple-900/30 text-purple-600',
  };
  return (
    <div className="bg-white dark:bg-slate-800 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${colors[color].split(' ').slice(2).join(' ')}`}>{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{title}</h3>
      <ul className="space-y-2 sm:space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) => (
  <div className="group bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>{icon}</div>
    <h3 className="font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) => (
  <div className="text-center">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 text-green-600 dark:text-green-400">{icon}</div>
    <div className="text-2xl sm:text-4xl font-bold text-green-200 dark:text-green-800 mb-1 sm:mb-2">{number}</div>
    <h3 className="font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{description}</p>
  </div>
);

const DeveloperCard = ({ name, role, avatar }: { name: string; role: string; avatar: string }) => (
  <div className="bg-white dark:bg-slate-800 p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 text-center hover:shadow-xl transition-all">
    <img src={avatar} alt={name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-green-100 dark:border-green-900 object-cover" />
    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{name}</h3>
    <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">{role}</p>
  </div>
);
