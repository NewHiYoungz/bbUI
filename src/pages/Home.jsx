import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAPIs, getAPIsByType } from '../data/mockAPIs';
import { FiArrowRight, FiZap, FiLayers, FiCode, FiShield, FiBook, FiLock, FiChevronDown, FiCopy, FiCheck } from 'react-icons/fi';
import copy from 'copy-to-clipboard';

// ── useInView hook ──
function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

// ── Animated Circuit SVG ──
const AnimatedCircuit = ({ className = '' }) => {
  const lines = [
    { x1: 0, y1: 80, x2: 150, y2: 80, length: 150, delay: 0 },
    { x1: 150, y1: 80, x2: 150, y2: 200, length: 120, delay: 0.2 },
    { x1: 150, y1: 200, x2: 350, y2: 200, length: 200, delay: 0.4 },
    { x1: 350, y1: 200, x2: 350, y2: 320, length: 120, delay: 0.6 },
    { x1: 350, y1: 320, x2: 600, y2: 320, length: 250, delay: 0.8 },
    { x1: 250, y1: 0, x2: 250, y2: 120, length: 120, delay: 0.3 },
    { x1: 250, y1: 120, x2: 450, y2: 120, length: 200, delay: 0.5 },
    { x1: 450, y1: 120, x2: 450, y2: 260, length: 140, delay: 0.7 },
    { x1: 80, y1: 300, x2: 80, y2: 400, length: 100, delay: 0.4 },
    { x1: 80, y1: 300, x2: 200, y2: 200, length: 156, delay: 0.6 },
    { x1: 500, y1: 0, x2: 500, y2: 80, length: 80, delay: 0.2 },
    { x1: 500, y1: 80, x2: 600, y2: 80, length: 100, delay: 0.4 },
  ];

  const nodes = [
    { cx: 150, cy: 80, delay: 0.3 },
    { cx: 150, cy: 200, delay: 0.6 },
    { cx: 350, cy: 200, delay: 0.8 },
    { cx: 350, cy: 320, delay: 1.0 },
    { cx: 250, cy: 120, delay: 0.6 },
    { cx: 450, cy: 120, delay: 0.8 },
    { cx: 450, cy: 260, delay: 1.0 },
    { cx: 80, cy: 300, delay: 0.7 },
    { cx: 500, cy: 80, delay: 0.5 },
  ];

  return (
    <svg className={`absolute pointer-events-none opacity-[0.3] ${className}`} width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="#243656" strokeWidth="1"
          className="circuit-line"
          style={{ '--line-length': l.length, animationDelay: `${l.delay}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx} cy={n.cy} r="4"
          fill="#F47920"
          className="circuit-node"
          style={{ animationDelay: `${n.delay + 1.2}s`, opacity: 0 }}
        />
      ))}
    </svg>
  );
};

// ── Wave Section Divider ──
const WaveDivider = ({ topColor = '#0B1221', bottomColor = '#0F1929' }) => (
  <div className="w-full leading-[0]">
    <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full block" style={{ height: 48 }}>
      <rect width="1440" height="48" fill={topColor} />
      <path d="M0 18C180 46 360 42 540 28C720 14 900 6 1080 22C1200 34 1360 42 1440 18V48H0Z" fill={bottomColor} />
    </svg>
  </div>
);

// ── Floating Decorative Shapes ──
const FloatingShapes = ({ variant = 'a' }) => {
  const sets = {
    a: [
      <svg key="a1" className="absolute top-[8%] left-[3%] w-7 h-7 animate-drift pointer-events-none" style={{ animationDuration: '20s' }} viewBox="0 0 28 28" fill="none"><polygon points="14,0 28,7 28,21 14,28 0,21 0,7" stroke="#F47920" strokeWidth="1" opacity="0.12" /></svg>,
      <svg key="a2" className="absolute top-[22%] right-[4%] w-5 h-5 animate-drift pointer-events-none" style={{ animationDelay: '3s', animationDuration: '24s' }} viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" transform="rotate(45 11 11)" stroke="#F47920" strokeWidth="1" opacity="0.1" /></svg>,
      <svg key="a3" className="absolute bottom-[18%] left-[5%] w-5 h-5 animate-drift-reverse pointer-events-none" style={{ animationDelay: '1.5s', animationDuration: '22s' }} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#243656" strokeWidth="1.5" opacity="0.3" /></svg>,
      <svg key="a4" className="absolute bottom-[25%] right-[6%] w-6 h-6 animate-drift pointer-events-none" style={{ animationDelay: '4s', animationDuration: '18s' }} viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,20 2,20" stroke="#243656" strokeWidth="1" opacity="0.15" /></svg>,
      <svg key="a5" className="absolute top-[55%] left-[8%] w-4 h-4 animate-drift-reverse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '26s' }} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="#F47920" strokeWidth="1" opacity="0.15" /></svg>,
    ],
    b: [
      <svg key="b1" className="absolute top-[12%] right-[5%] w-6 h-6 animate-drift pointer-events-none" style={{ animationDuration: '22s' }} viewBox="0 0 24 24" fill="none"><polygon points="12,0 24,6 24,18 12,24 0,18 0,6" stroke="#243656" strokeWidth="1.5" opacity="0.2" /></svg>,
      <svg key="b2" className="absolute top-[30%] left-[4%] w-5 h-5 animate-drift-reverse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '18s' }} viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#F47920" strokeWidth="1" opacity="0.1" /></svg>,
      <svg key="b3" className="absolute bottom-[12%] right-[7%] w-4 h-4 animate-drift pointer-events-none" style={{ animationDelay: '3.5s', animationDuration: '25s' }} viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" transform="rotate(45 9 9)" stroke="#F47920" strokeWidth="1" opacity="0.1" /></svg>,
      <svg key="b4" className="absolute bottom-[20%] left-[6%] w-5 h-5 animate-drift-reverse pointer-events-none" style={{ animationDelay: '1s', animationDuration: '20s' }} viewBox="0 0 20 20" fill="none"><polygon points="10,1 19,18 1,18" stroke="#243656" strokeWidth="1" opacity="0.15" /></svg>,
    ],
    c: [
      <svg key="c1" className="absolute top-[10%] left-[4%] w-6 h-6 animate-drift pointer-events-none" style={{ animationDuration: '19s' }} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#243656" strokeWidth="1" opacity="0.2" /></svg>,
      <svg key="c2" className="absolute top-[18%] right-[3%] w-7 h-7 animate-drift-reverse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '23s' }} viewBox="0 0 28 28" fill="none"><polygon points="14,0 28,7 28,21 14,28 0,21 0,7" stroke="#F47920" strokeWidth="1" opacity="0.1" /></svg>,
      <svg key="c3" className="absolute bottom-[22%] left-[7%] w-4 h-4 animate-drift pointer-events-none" style={{ animationDelay: '4s', animationDuration: '21s' }} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F47920" strokeWidth="1" opacity="0.12" /></svg>,
      <svg key="c4" className="absolute bottom-[15%] right-[5%] w-5 h-5 animate-drift-reverse pointer-events-none" style={{ animationDelay: '1.5s', animationDuration: '26s' }} viewBox="0 0 20 20" fill="none"><line x1="10" y1="1" x2="10" y2="19" stroke="#243656" strokeWidth="1.5" opacity="0.2" /><line x1="1" y1="10" x2="19" y2="10" stroke="#243656" strokeWidth="1.5" opacity="0.2" /></svg>,
      <svg key="c5" className="absolute top-[60%] right-[9%] w-5 h-5 animate-drift pointer-events-none" style={{ animationDelay: '3s', animationDuration: '17s' }} viewBox="0 0 20 20" fill="none"><polygon points="10,2 18,18 2,18" stroke="#F47920" strokeWidth="1" opacity="0.08" /></svg>,
    ],
  };
  return <>{sets[variant] || sets.a}</>;
};

// ── Glow Orb ──
const GlowOrb = ({ size = 300, top, left, right, bottom, color = '#F47920', opacity = 0.04, delay = 0 }) => (
  <div
    className="absolute rounded-full pointer-events-none animate-orb"
    style={{
      width: size, height: size, top, left, right, bottom,
      background: color, opacity, filter: `blur(${Math.round(size * 0.4)}px)`,
      animationDelay: `${delay}s`,
    }}
  />
);

// ── Dot Grid Background ──
const DotGrid = ({ className = '' }) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
    <defs>
      <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="16" cy="16" r="0.8" fill="#243656" opacity="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dot-grid)" />
  </svg>
);

// ── Rotating Ring ──
const RotatingRing = ({ size = 120, className = '' }) => (
  <svg className={`absolute pointer-events-none animate-spin-slow ${className}`} width={size} height={size} viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="55" stroke="#243656" strokeWidth="0.5" opacity="0.3" strokeDasharray="8 6" />
    <circle cx="60" cy="60" r="40" stroke="#F47920" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 8" />
  </svg>
);

// ── Animated Counter ──
function AnimatedNumber({ value, visible }) {
  const [display, setDisplay] = useState(value);
  const numericPart = value.replace(/[^0-9.]/g, '');
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';
  const suffix = value.replace(numericPart, '').replace(prefix, '');

  useEffect(() => {
    if (!visible || !numericPart) { setDisplay(value); return; }
    const target = parseFloat(numericPart);
    const duration = 1200;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target * 10) / 10;
      const formatted = Number.isInteger(target) ? Math.round(eased * target) : current.toFixed(1);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return <>{display}</>;
}

// ── Hero Section ──
const Hero = () => {
  const navigate = useNavigate();
  const stats = [
    { value: '500+', label: 'AI Models' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<50ms', label: 'Latency' },
    { value: 'SOC 2', label: 'Certified' },
  ];
  const [statsRef, statsVisible] = useInView();

  return (
    <section className="relative overflow-hidden">
      <AnimatedCircuit className="top-0 left-0 w-full h-full" />
      <AnimatedCircuit className="top-0 right-0 w-full h-full scale-x-[-1]" />

      <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4" />

      {/* Extra hero decorations */}
      <RotatingRing size={160} className="top-[5%] left-[8%] opacity-40 hidden md:block" />
      <RotatingRing size={100} className="bottom-[10%] right-[6%] opacity-30 hidden md:block" />
      <svg className="absolute top-[15%] right-[12%] w-6 h-6 animate-drift pointer-events-none hidden md:block" style={{ animationDuration: '18s' }} viewBox="0 0 24 24" fill="none"><polygon points="12,0 24,6 24,18 12,24 0,18 0,6" stroke="#F47920" strokeWidth="1" opacity="0.15" /></svg>
      <svg className="absolute bottom-[20%] left-[14%] w-5 h-5 animate-drift-reverse pointer-events-none hidden md:block" style={{ animationDelay: '2s', animationDuration: '22s' }} viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" stroke="#F47920" strokeWidth="1" opacity="0.12" /></svg>

      <div className="section-container section-padding text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="hero-fade-up text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance" style={{ animationDelay: '0.2s' }}>
            One API for Everything
            <span className="text-primary"> — Enterprise-Grade</span>
          </h1>
          <p className="hero-fade-up text-lg text-text-secondary mb-10 max-w-xl mx-auto" style={{ animationDelay: '0.5s' }}>
            Secure &middot; Reliable &middot; Compliant — 500+ Models Through One Endpoint
          </p>

          <div className="hero-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" style={{ animationDelay: '0.8s' }}>
            <button onClick={() => navigate('/login?mode=signup')} className="btn-primary btn-pulse text-base px-8 py-3.5 flex items-center gap-2">
              Get API Key <FiArrowRight />
            </button>
            <button onClick={() => navigate('/docs')} className="btn-secondary text-base px-8 py-3.5">
              API Documentation
            </button>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center ${statsVisible ? 'animate-float' : ''}`} style={{ animationDelay: `${i * 0.4}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedNumber value={stat.value} visible={statsVisible} />
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Model Card Image ──
const ModelCardImage = ({ api, size = 'large' }) => {
  const src = api.image;

  if (size === 'small') {
    return (
      <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden">
        <img src={src} alt={api.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div className="h-32 rounded-lg mb-4 overflow-hidden">
      <img src={src} alt={api.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
};

// ── Popular Models ──
const PopularModels = () => {
  const navigate = useNavigate();
  const popular = mockAPIs.filter(a => a.popular).slice(0, 8);
  const [ref, visible] = useInView();

  const typeColors = {
    text: 'bg-blue-900/50 text-blue-300',
    image: 'bg-emerald-900/50 text-emerald-300',
    video: 'bg-violet-900/50 text-violet-300',
    audio: 'bg-amber-900/50 text-amber-300',
  };

  const getPriceDisplay = (api) => {
    const { pricing } = api;
    if (pricing.input) return `$${pricing.input}`;
    if (pricing.standard) return `$${pricing.standard}`;
    if (pricing.rate) return `$${pricing.rate}`;
    return 'Free';
  };

  return (
    <section className="bg-subtle section-padding relative overflow-hidden">
      <FloatingShapes variant="a" />
      <GlowOrb size={280} top="30%" right="-5%" delay={1} />
      <div className="section-container relative z-[1]">
        <div ref={ref} className={`text-center mb-12 reveal ${visible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Popular AI API Models</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Access the most popular AI models through a single, unified API.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((api, idx) => (
            <div
              key={api.id}
              onClick={() => navigate(`/api/${api.id}`)}
              className={`card-hover ${visible ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <ModelCardImage api={api} />

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary font-medium">{api.provider}</span>
                <span className="text-lg font-bold text-primary">{getPriceDisplay(api)}</span>
              </div>

              <h3 className="font-semibold text-white mb-1">{api.name}</h3>
              <p className="text-xs text-text-secondary line-clamp-2 mb-3">{api.description}</p>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${typeColors[api.type] || typeColors.text}`}>
                  {api.type === 'text' ? 'Text' : api.type === 'image' ? 'Image' : api.type === 'video' ? 'Video' : 'Audio'}
                </span>
                <div className="flex gap-1">
                  {api.popular && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/15 text-primary rounded-md">Popular</span>}
                  {api.new && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/15 text-blue-300 rounded-md">NEW</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/marketplace" className="btn-secondary inline-flex items-center gap-2">
            View All Models <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── Integration Steps ──
const IntegrationSteps = () => {
  const [copied, setCopied] = useState(false);
  const [ref, visible] = useInView();

  const handleCopy = () => {
    copy(`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { num: '01', title: 'Create API Key', desc: 'Sign up for free — no credit card required. Generate your API key in seconds.' },
    { num: '02', title: 'Update Base URL', desc: 'One-line code change. If you use the OpenAI SDK, just change the base URL.' },
    { num: '03', title: 'Start Using AI Models', desc: 'Access 500+ models via OpenAI-compatible format. Switch models with a single parameter.' },
  ];

  return (
    <div className="relative overflow-hidden">
      <DotGrid className="opacity-40" />
      <GlowOrb size={350} top="-10%" left="-8%" color="#F47920" opacity={0.03} delay={2} />
      <GlowOrb size={250} bottom="5%" right="-5%" color="#F47920" opacity={0.025} delay={0} />
      <FloatingShapes variant="b" />
      <section className="section-container section-padding relative z-[1]">
      <div ref={ref} className={`text-center mb-16 reveal ${visible ? 'visible' : ''}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Integrate in 3 Simple Steps
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          Start using 500+ AI models in minutes with our OpenAI-compatible API.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {steps.map((step, i) => (
          <div key={step.num} className="text-center">
            <div
              className={`w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4 icon-bounce ${visible ? 'animate-scale-in' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.2 + 0.3}s` }}
            >
              <span className="text-primary font-bold text-sm">{step.num}</span>
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-[10px] overflow-hidden border border-border-light relative code-shimmer">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light">
            <span className="text-xs text-text-muted font-mono">JavaScript</span>
            <button onClick={handleCopy} className="text-xs text-text-muted hover:text-white flex items-center gap-1 transition-colors">
              {copied ? <><FiCheck className="w-3 h-3" /> Copied</> : <><FiCopy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
          <pre className="p-4 text-sm text-text-secondary font-mono overflow-x-auto leading-relaxed">
{`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'gpt-5',  // or claude-sonnet-4-6, gemini-2-5-pro, etc.
  messages: [{ role: 'user', content: 'Hello!' }],
});`}
          </pre>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <Link to="/login?mode=signup" className="btn-primary inline-flex items-center gap-2">
          Get API Key <FiArrowRight />
        </Link>
        <Link to="/docs" className="btn-secondary inline-flex items-center gap-2">
          View Documentation
        </Link>
      </div>
    </section>
    </div>
  );
};

// ── API Showcase Tabs ──
const APIShowcase = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();
  const [ref, visible] = useInView();

  const tabs = [
    { key: 'text', label: 'Chat API' },
    { key: 'video', label: 'Video API' },
    { key: 'image', label: 'Image API' },
  ];

  const models = getAPIsByType(activeTab).slice(0, 5);

  const getPriceDisplay = (api) => {
    const { pricing } = api;
    if (pricing.input) return `$${pricing.input}/${pricing.unit}`;
    if (pricing.standard) return `$${pricing.standard}/${pricing.unit}`;
    if (pricing.rate) return `$${pricing.rate}/${pricing.unit}`;
    return 'Free';
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setTabKey(prev => prev + 1);
  };

  return (
    <section className="bg-subtle section-padding relative overflow-hidden">
      <FloatingShapes variant="c" />
      <RotatingRing size={140} className="top-[5%] right-[3%] opacity-20 hidden lg:block" />
      <GlowOrb size={220} bottom="10%" left="-4%" delay={3} />
      <div className="section-container relative z-[1]">
        <div ref={ref} className={`text-center mb-12 reveal ${visible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">APIs for Your Projects</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Powerful AI APIs for text, image, and video generation.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-5 py-2.5 rounded-[10px] text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary border border-border-light hover:border-primary'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={tabKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 tab-fade-enter">
          {models.map((api) => (
            <div
              key={api.id}
              onClick={() => navigate(`/api/${api.id}`)}
              className="card-hover flex items-center gap-4"
            >
              <ModelCardImage api={api} size="small" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white text-sm truncate">{api.name}</h3>
                  <span className="text-xs font-semibold text-primary ml-2 shrink-0">{getPriceDisplay(api)}</span>
                </div>
                <p className="text-xs text-text-secondary">{api.provider}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/marketplace" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1">
            Explore {tabs.find(t => t.key === activeTab)?.label} <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── Value Propositions ──
const ValueProps = () => {
  const [ref, visible] = useInView();

  const props = [
    { icon: FiShield, title: 'Enterprise Security', desc: 'SOC 2 Type II compliant with end-to-end encryption, audit trails, and role-based access control.' },
    { icon: FiLock, title: 'Zero Data Retention', desc: 'Prompts and completions are never stored, logged, or used for training. Full privacy by default.' },
    { icon: FiLayers, title: '500+ Models, One API', desc: 'Access all major AI models through a single endpoint and API key.' },
    { icon: FiCode, title: 'OpenAI-Compatible', desc: 'Drop-in replacement — just change the base URL in your existing code.' },
    { icon: FiZap, title: '99.9% Uptime SLA', desc: 'Enterprise-grade infrastructure with global CDN, automatic failover, and <50ms latency.' },
    { icon: FiBook, title: 'Compliance Ready', desc: 'GDPR and HIPAA-eligible. IP whitelisting, per-key restrictions, and comprehensive audit logging.' },
  ];

  return (
    <div className="relative overflow-hidden">
      <FloatingShapes variant="b" />
      <GlowOrb size={320} top="20%" left="-6%" color="#F47920" opacity={0.035} delay={1} />
      <RotatingRing size={110} className="bottom-[8%] right-[4%] opacity-25 hidden md:block" />
      <section className="section-container section-padding relative z-[1]">
      <div ref={ref} className={`text-center mb-12 reveal ${visible ? 'visible' : ''}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Why Enterprises Choose supremind.ai
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          The secure, compliant AI API platform trusted by enterprise teams worldwide.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.map((prop, idx) => (
          <div key={idx} className={`card-base ${visible ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="w-10 h-10 rounded-[10px] bg-primary/15 flex items-center justify-center mb-4 icon-bounce">
              <prop.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">{prop.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{prop.desc}</p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

// ── Provider Logos ──
const ProviderLogos = () => {
  const providers = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'ByteDance', 'Alibaba', 'xAI', 'MiniMax'];
  const doubled = [...providers, ...providers];

  return (
    <section className="bg-subtle py-12 overflow-hidden">
      <div className="animate-scroll-logos flex items-center gap-16 whitespace-nowrap">
        {doubled.map((name, idx) => (
          <span key={idx} className="text-xl font-semibold text-text-muted/40 select-none shrink-0 logo-hover cursor-default">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
};

// ── FAQ ──
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [ref, visible] = useInView();

  const faqs = [
    {
      q: 'What is supremind.ai and what does it offer?',
      a: 'supremind.ai is an enterprise-grade AI API gateway that provides secure access to 500+ AI models from leading providers like OpenAI, Anthropic, Google, and more — all through a single, compliant API endpoint.',
    },
    {
      q: 'What AI models are available on supremind.ai?',
      a: 'We offer 500+ models including GPT-5, Claude Sonnet 4, Gemini 3 Pro, DALL-E 3, Sora 2, Veo 3.1, Seedream, Nano Banana, Whisper, and many more across text, image, video, and audio generation.',
    },
    {
      q: 'How does supremind.ai handle data privacy and security?',
      a: 'We enforce zero data retention — your prompts and completions are never stored, logged, or used for model training. All traffic is encrypted with AES-256, and we support IP whitelisting, per-key model restrictions, and comprehensive audit logging.',
    },
    {
      q: 'What compliance certifications does supremind.ai hold?',
      a: 'supremind.ai is SOC 2 Type II certified and GDPR compliant. We also support HIPAA-eligible configurations for healthcare workloads. Detailed compliance reports are available upon request for enterprise customers.',
    },
    {
      q: 'How do I integrate supremind.ai into my application?',
      a: 'Integration is simple — if you already use the OpenAI SDK, just change the base URL to api.supremind.ai. The API is fully OpenAI-compatible, so no other code changes are needed.',
    },
    {
      q: 'Why do enterprises choose supremind.ai over going directly to each provider?',
      a: 'supremind.ai gives enterprises a single compliant gateway with centralized access controls, unified audit logging, zero data retention, and the ability to switch between 500+ models without code changes. It simplifies governance and reduces operational overhead.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <GlowOrb size={200} top="10%" right="-3%" color="#F47920" opacity={0.03} delay={2} />
      <svg className="absolute top-[6%] left-[5%] w-6 h-6 animate-drift pointer-events-none hidden md:block" style={{ animationDuration: '21s' }} viewBox="0 0 24 24" fill="none"><polygon points="12,0 24,6 24,18 12,24 0,18 0,6" stroke="#243656" strokeWidth="1" opacity="0.2" /></svg>
      <svg className="absolute bottom-[10%] right-[4%] w-5 h-5 animate-drift-reverse pointer-events-none hidden md:block" style={{ animationDelay: '3s', animationDuration: '19s' }} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#F47920" strokeWidth="1" opacity="0.1" /></svg>
      <section className="section-container section-padding relative z-[1]">
      <div ref={ref} className={`text-center mb-12 reveal ${visible ? 'visible' : ''}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`border border-border-light rounded-[10px] overflow-hidden ${visible ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${idx * 80}ms` }}>
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-light transition-colors"
            >
              <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
              <FiChevronDown className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            <div className={`faq-answer ${openIdx === idx ? 'open' : ''}`}>
              <div>
                <p className="px-6 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

// ── Home Page ──
const Home = () => {
  return (
    <div>
      <Hero />
      <WaveDivider topColor="#0B1221" bottomColor="#0F1929" />
      <PopularModels />
      <WaveDivider topColor="#0F1929" bottomColor="#0B1221" />
      <IntegrationSteps />
      <WaveDivider topColor="#0B1221" bottomColor="#0F1929" />
      <APIShowcase />
      <WaveDivider topColor="#0F1929" bottomColor="#0B1221" />
      <ValueProps />
      <WaveDivider topColor="#0B1221" bottomColor="#0F1929" />
      <ProviderLogos />
      <WaveDivider topColor="#0F1929" bottomColor="#0B1221" />
      <FAQ />
    </div>
  );
};

export default Home;
