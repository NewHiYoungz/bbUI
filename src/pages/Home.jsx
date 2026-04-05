import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAPIs, getAPIsByType } from '../data/mockAPIs';
import { FiArrowRight, FiZap, FiLayers, FiCode, FiShield, FiBook, FiDollarSign, FiChevronDown, FiCopy, FiCheck } from 'react-icons/fi';
import copy from 'copy-to-clipboard';

// ── Hero Section ──
const Hero = () => {
  const navigate = useNavigate();
  const stats = [
    { value: '500+', label: 'AI Models' },
    { value: '99.9%', label: 'Uptime' },
    { value: '<50ms', label: 'Latency' },
    { value: '70%', label: 'Cost Savings' },
  ];

  return (
    <section className="section-container section-padding text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark mb-6 leading-tight text-balance">
          One API for Everything
          <span className="text-primary"> — Save 30-70%</span>
        </h1>
        <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
          One Endpoint &middot; Hundreds of Models &middot; Infinite Possibilities
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={() => navigate('/login?mode=signup')} className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            Get API Key <FiArrowRight />
          </button>
          <button onClick={() => navigate('/docs')} className="btn-secondary text-base px-8 py-3.5">
            API Documentation
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Popular Models ──
const PopularModels = () => {
  const navigate = useNavigate();
  const popular = mockAPIs.filter(a => a.popular).slice(0, 8);

  const typeColors = {
    text: 'bg-blue-50 text-blue-600',
    image: 'bg-green-50 text-green-600',
    video: 'bg-purple-50 text-purple-600',
    audio: 'bg-amber-50 text-amber-600',
  };

  const getPriceDisplay = (api) => {
    const { pricing } = api;
    if (pricing.input) return `$${pricing.input}`;
    if (pricing.standard) return `$${pricing.standard}`;
    if (pricing.rate) return `$${pricing.rate}`;
    return 'Free';
  };

  return (
    <section className="bg-bg-subtle section-padding">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">Popular AI API Models</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Access the most popular AI models through a single, unified API.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((api, idx) => (
            <div
              key={api.id}
              onClick={() => navigate(`/api/${api.id}`)}
              className="card-hover animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="h-32 bg-bg-subtle rounded-lg mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-text-secondary/30">{api.name.charAt(0)}</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary font-medium">{api.provider}</span>
                <span className="text-lg font-bold text-primary">{getPriceDisplay(api)}</span>
              </div>

              <h3 className="font-semibold text-text-dark mb-1">{api.name}</h3>
              <p className="text-xs text-text-secondary line-clamp-2 mb-3">{api.description}</p>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${typeColors[api.type] || typeColors.text}`}>
                  {api.type === 'text' ? 'Text' : api.type === 'image' ? 'Image' : api.type === 'video' ? 'Video' : 'Audio'}
                </span>
                <div className="flex gap-1">
                  {api.popular && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent/10 text-accent rounded-md">Popular</span>}
                  {api.new && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-md">NEW</span>}
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

  const handleCopy = () => {
    copy(`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.apimart.ai/v1',
  apiKey: 'YOUR_API_KEY',
});`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: '01',
      title: 'Create API Key',
      desc: 'Sign up for free — no credit card required. Generate your API key in seconds.',
    },
    {
      num: '02',
      title: 'Update Base URL',
      desc: 'One-line code change. If you use the OpenAI SDK, just change the base URL.',
    },
    {
      num: '03',
      title: 'Start Using AI Models',
      desc: 'Access 500+ models via OpenAI-compatible format. Switch models with a single parameter.',
    },
  ];

  return (
    <section className="section-container section-padding">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
          Integrate in 3 Simple Steps
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          Start using 500+ AI models in minutes with our OpenAI-compatible API.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {steps.map((step) => (
          <div key={step.num} className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-sm">{step.num}</span>
            </div>
            <h3 className="font-semibold text-text-dark text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-bg-code rounded-[10px] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-xs text-gray-400 font-mono">JavaScript</span>
            <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              {copied ? <><FiCheck className="w-3 h-3" /> Copied</> : <><FiCopy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
          <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.apimart.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'gpt-5',  // or claude-sonnet-4, gemini-3-pro, etc.
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
  );
};

// ── API Showcase Tabs ──
const APIShowcase = () => {
  const [activeTab, setActiveTab] = useState('text');
  const navigate = useNavigate();

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

  return (
    <section className="bg-bg-subtle section-padding">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">APIs for Your Projects</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Powerful AI APIs for text, image, and video generation.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-[10px] text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-dark border border-border-light hover:border-primary'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {models.map((api) => (
            <div
              key={api.id}
              onClick={() => navigate(`/api/${api.id}`)}
              className="card-hover flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary">{api.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-text-dark text-sm truncate">{api.name}</h3>
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
  const props = [
    { icon: FiDollarSign, title: 'Lower Cost', desc: 'Save 30-70% compared to direct provider pricing with our unified API.' },
    { icon: FiLayers, title: '500+ Models, One API', desc: 'Access all major AI models through a single endpoint and API key.' },
    { icon: FiCode, title: 'OpenAI-Compatible', desc: 'Drop-in replacement — just change the base URL in your existing code.' },
    { icon: FiShield, title: 'High Performance', desc: '99.9% uptime SLA with global CDN and <50ms latency worldwide.' },
    { icon: FiBook, title: 'Developer-Friendly', desc: 'Comprehensive docs, code examples, and interactive playground.' },
    { icon: FiZap, title: 'Flexible Pricing', desc: 'Pay-as-you-go with no commitments, minimums, or hidden fees.' },
  ];

  return (
    <section className="section-container section-padding">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
          Why Choose APIMart
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          The unified AI API platform trusted by developers worldwide.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.map((prop, idx) => (
          <div key={idx} className="card-base">
            <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center mb-4">
              <prop.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-text-dark mb-2">{prop.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{prop.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Provider Logos ──
const ProviderLogos = () => {
  const providers = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'ByteDance', 'Alibaba', 'xAI', 'MiniMax'];
  const doubled = [...providers, ...providers];

  return (
    <section className="bg-bg-subtle py-12 overflow-hidden">
      <div className="animate-scroll-logos flex items-center gap-16 whitespace-nowrap">
        {doubled.map((name, idx) => (
          <span key={idx} className="text-xl font-semibold text-text-secondary/40 select-none shrink-0">
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

  const faqs = [
    {
      q: 'What is APIMart and what does it offer?',
      a: 'APIMart is a unified AI API platform that provides access to 500+ AI models from leading providers like OpenAI, Anthropic, Google, and more — all through a single API endpoint. You can use text, image, video, and audio AI models with one API key.',
    },
    {
      q: 'What AI models are available on APIMart?',
      a: 'We offer 500+ models including GPT-5, Claude Sonnet 4, Gemini 3 Pro, DALL-E 3, Sora 2, Veo 3.1, Seedream, Nano Banana, Whisper, and many more across text, image, video, and audio generation.',
    },
    {
      q: 'How does APIMart pricing compare to direct providers?',
      a: 'APIMart typically saves you 30-70% compared to using providers directly. We aggregate demand to negotiate better rates and pass the savings to you, with no markups or hidden fees.',
    },
    {
      q: 'How do I integrate APIMart into my application?',
      a: 'Integration is simple — if you already use the OpenAI SDK, just change the base URL to api.apimart.ai. The API is fully OpenAI-compatible, so no other code changes are needed.',
    },
    {
      q: 'Why use APIMart instead of going directly to each provider?',
      a: 'APIMart gives you a single billing account, one API key, unified documentation, lower costs, and the ability to switch between 500+ models without any code changes. It simplifies operations and reduces costs.',
    },
    {
      q: 'Is my API key and data secure?',
      a: 'Yes. We use industry-standard encryption, never store your request/response data, and support IP whitelisting and per-key model restrictions for additional security.',
    },
  ];

  return (
    <section className="section-container section-padding">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-border-light rounded-[10px] overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-text-dark text-sm pr-4">{faq.q}</span>
              <FiChevronDown className={`w-4 h-4 text-text-secondary shrink-0 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
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
  );
};

// ── Home Page ──
const Home = () => {
  return (
    <div>
      <Hero />
      <PopularModels />
      <IntegrationSteps />
      <APIShowcase />
      <ValueProps />
      <ProviderLogos />
      <FAQ />
    </div>
  );
};

export default Home;
