import React from 'react';
import { ArrowRight, Leaf, MapPin, Users, Zap, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';

interface LandingProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Waste Management
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Clean cities start
                <span className="block text-green-600">from zero.</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
                Report waste, track cleanups, and make your neighborhood cleaner. 
                One report at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors"
                >
                  Start Reporting
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-700 font-medium rounded-full hover:bg-slate-200 transition-colors"
                >
                  See How It Works
                </a>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
                <div>
                  <div className="text-3xl font-bold text-slate-900">2.4k+</div>
                  <div className="text-sm text-slate-500 mt-1">Reports Filed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">89%</div>
                  <div className="text-sm text-slate-500 mt-1">Resolved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">12</div>
                  <div className="text-sm text-slate-500 mt-1">Active Zones</div>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative lg:h-[540px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-3xl" />
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"
                alt="Clean city environment"
                className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-2xl shadow-2xl"
              />
              {/* Floating card */}
              <div className="absolute -left-6 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Report Resolved</div>
                    <div className="text-xs text-slate-500">Zone 4 • 2 min ago</div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -right-4 top-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                ✓ AI Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to keep your city clean
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              A complete platform connecting citizens, cleaners, and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MapPin className="w-5 h-5" />}
              title="Location Tracking"
              description="Pinpoint waste locations with GPS accuracy. Every report is mapped for efficient cleanup routes."
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="AI Analysis"
              description="Upload a photo and our AI identifies waste type and suggests priority level automatically."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Team Coordination"
              description="Assign tasks to cleanup crews, track progress, and manage zones from one dashboard."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Three steps to a cleaner city
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="01"
              title="Spot & Report"
              description="See waste in your area? Snap a photo, drop a pin, and submit your report in seconds."
            />
            <StepCard
              number="02"
              title="We Dispatch"
              description="Our system routes your report to the nearest available cleanup crew automatically."
            />
            <StepCard
              number="03"
              title="Track Progress"
              description="Get notified when your report is picked up and when the cleanup is complete."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-12 md:p-16 text-center">
            <Leaf className="w-12 h-12 text-green-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to make a difference?
            </h2>
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Join thousands of citizens already making their neighborhoods cleaner.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-full hover:bg-green-50 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-slate-500">
            © 2024 Zero Waste Management. Building cleaner cities.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-green-200 hover:shadow-lg hover:shadow-green-50 transition-all">
    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({
  number,
  title,
  description,
}) => (
  <div className="text-center">
    <div className="text-5xl font-bold text-green-100 mb-4">{number}</div>
    <h3 className="font-semibold text-slate-900 text-lg mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);
