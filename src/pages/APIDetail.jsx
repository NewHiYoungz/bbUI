import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAPIById } from '../data/mockAPIs';
import copy from 'copy-to-clipboard';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import { FiCopy, FiCheck, FiPlay, FiArrowLeft, FiStar, FiZap, FiShield, FiGlobe } from 'react-icons/fi';

/* ──────────────────────────── helpers ──────────────────────────── */

const TYPE_COLORS = {
  text: 'bg-blue-50 text-blue-700 border border-blue-200',
  image: 'bg-pink-50 text-pink-700 border border-pink-200',
  video: 'bg-purple-50 text-purple-700 border border-purple-200',
  audio: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const formatPrice = (pricing) => {
  if (!pricing) return 'Contact for pricing';
  if (pricing.input !== undefined && pricing.output !== undefined) {
    return `$${pricing.input} / $${pricing.output} ${pricing.unit}`;
  }
  if (pricing.standard !== undefined && pricing.hd !== undefined) {
    return `$${pricing.standard} standard / $${pricing.hd} HD ${pricing.unit}`;
  }
  if (pricing.standard !== undefined && pricing.pro !== undefined) {
    return `$${pricing.standard} standard / $${pricing.pro} pro ${pricing.unit}`;
  }
  if (pricing.standard !== undefined) {
    return `$${pricing.standard} ${pricing.unit}`;
  }
  if (pricing.rate !== undefined) {
    return `$${pricing.rate} ${pricing.unit}`;
  }
  return 'Contact for pricing';
};

/* ──────────────────────────── copy button ──────────────────────── */

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors duration-200 ${
        copied ? 'text-green-500' : 'text-text-secondary hover:text-text-dark'
      } ${className}`}
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

/* ──────────────────────────── code block ─────────────────────────── */

const CodeBlock = ({ code, language }) => (
  <div className="relative group">
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton text={code} />
    </div>
    <pre className="bg-bg-code text-white rounded-[10px] p-5 overflow-x-auto text-sm leading-relaxed">
      <code
        className={`language-${language === 'curl' ? 'bash' : language}`}
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(
            code,
            Prism.languages[language === 'curl' ? 'bash' : language],
            language === 'curl' ? 'bash' : language
          ),
        }}
      />
    </pre>
  </div>
);

/* ──────────────────────────── playground: text ───────────────────── */

const TextPlayground = ({ api }) => {
  const [prompt, setPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={5}
          className="w-full border-2 border-border-light rounded-[10px] p-4 text-sm resize-none
                     focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">Model</label>
          <select
            className="w-full border-2 border-border-light rounded-[10px] px-4 py-2.5 text-sm
                       focus:border-primary focus:outline-none bg-white transition-colors"
            defaultValue={api.id}
          >
            <option value={api.id}>{api.name}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Max Tokens: <span className="text-primary font-semibold">{maxTokens}</span>
          </label>
          <input
            type="range"
            min={1}
            max={4096}
            step={1}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>1</span>
            <span>4096</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">
          Temperature: <span className="text-primary font-semibold">{temperature}</span>
        </label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0 (Deterministic)</span>
          <span>2 (Creative)</span>
        </div>
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <FiPlay size={16} />
        Run
      </button>

      <div className="border-2 border-border-light rounded-[10px] p-6 bg-bg-subtle min-h-[120px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">Response will appear here</p>
      </div>
    </div>
  );
};

/* ──────────────────────────── playground: image ──────────────────── */

const ImagePlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('natural');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={4}
          className="w-full border-2 border-border-light rounded-[10px] p-4 text-sm resize-none
                     focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border-2 border-border-light rounded-[10px] px-4 py-2.5 text-sm
                       focus:border-primary focus:outline-none bg-white transition-colors"
          >
            <option value="1024x1024">1024 x 1024</option>
            <option value="512x512">512 x 512</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">Style</label>
          <div className="flex gap-3">
            {['natural', 'vivid', 'anime'].map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-[10px] text-sm font-medium border-2 transition-colors ${
                  style === s
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border-light text-text-secondary hover:border-primary/40'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <FiPlay size={16} />
        Generate
      </button>

      <div className="border-2 border-border-light rounded-[10px] p-6 bg-bg-subtle min-h-[200px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">Generated image will appear here</p>
      </div>
    </div>
  );
};

/* ──────────────────────────── playground: video ──────────────────── */

const VideoPlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [aspectRatio, setAspectRatio] = useState('16:9');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to generate..."
          rows={4}
          className="w-full border-2 border-border-light rounded-[10px] p-4 text-sm resize-none
                     focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Duration: <span className="text-primary font-semibold">{duration}s</span>
          </label>
          <input
            type="range"
            min={5}
            max={25}
            step={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>5s</span>
            <span>25s</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">Aspect Ratio</label>
          <div className="flex gap-3">
            {['16:9', '9:16', '1:1'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 rounded-[10px] text-sm font-medium border-2 transition-colors ${
                  aspectRatio === ratio
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border-light text-text-secondary hover:border-primary/40'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <FiPlay size={16} />
        Generate
      </button>

      <div className="border-2 border-border-light rounded-[10px] p-6 bg-bg-subtle min-h-[200px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">Generated video will appear here</p>
      </div>
    </div>
  );
};

/* ──────────────────────────── playground: audio ──────────────────── */

const AudioPlayground = () => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-text-dark mb-2">Upload Audio File</label>
      <div className="border-2 border-dashed border-border-light rounded-[10px] p-8 text-center">
        <p className="text-text-secondary text-sm">Drag and drop an audio file here, or click to browse</p>
        <button className="mt-4 btn-secondary text-sm py-2 px-4">Choose File</button>
      </div>
    </div>

    <button className="btn-primary inline-flex items-center gap-2">
      <FiPlay size={16} />
      Transcribe
    </button>

    <div className="border-2 border-border-light rounded-[10px] p-6 bg-bg-subtle min-h-[120px] flex items-center justify-center">
      <p className="text-text-secondary text-sm">Response will appear here</p>
    </div>
  </div>
);

/* ──────────────────────────── tab: playground ────────────────────── */

const PlaygroundTab = ({ api }) => {
  const playgrounds = {
    text: TextPlayground,
    image: ImagePlayground,
    video: VideoPlayground,
    audio: AudioPlayground,
  };

  const Playground = playgrounds[api.type] || TextPlayground;
  return <Playground api={api} />;
};

/* ──────────────────────────── tab: introduction ─────────────────── */

const IntroductionTab = ({ api }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: 'Users', value: '50K+', icon: FiGlobe },
    { label: 'Uptime', value: '99.9%', icon: FiShield },
    { label: 'Faster', value: '2x', icon: FiZap },
    { label: 'Cost Savings', value: '70%', icon: FiStar },
  ];

  const steps = [
    { num: 1, title: 'Sign Up', desc: 'Create your free APIMart account to get started.' },
    { num: 2, title: 'Add Funds', desc: 'Add credits to your account. Pay only for what you use.' },
    { num: 3, title: 'Generate API Key', desc: 'Create a secure API key from your dashboard.' },
    { num: 4, title: 'Make First API Call', desc: 'Use our SDK or REST API to integrate in minutes.' },
  ];

  const faqs = [
    {
      q: `What is ${api.name} and what can it do?`,
      a: `${api.name} is a ${api.type} model by ${api.provider}. ${api.description} It is available through the APIMart unified API with a single API key.`,
    },
    {
      q: `How much does ${api.name} cost?`,
      a: `Pricing for ${api.name} is ${formatPrice(api.pricing)}. You only pay for what you use with no minimum commitments or monthly fees.`,
    },
    {
      q: 'How do I get started?',
      a: 'Sign up for a free APIMart account, add funds, generate your API key, and start making requests. Our SDK supports Python, JavaScript, and REST API calls.',
    },
    {
      q: 'Is there a rate limit?',
      a: 'Free tier accounts have standard rate limits. Paid plans offer higher throughput and priority access. Contact us for enterprise-grade limits.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* hero */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-dark mb-3">{api.name}</h2>
        <p className="text-lg text-text-secondary mb-2">{formatPrice(api.pricing)}</p>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <s.icon className="text-primary" size={22} />
              <span className="text-xl font-bold text-text-dark">{s.value}</span>
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* capabilities */}
      {api.features && api.features.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-text-dark mb-6">Capabilities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {api.features.map((feat, idx) => (
              <div
                key={idx}
                className="border-2 border-border-light rounded-[10px] p-5 hover:border-primary transition-colors"
              >
                <p className="font-medium text-text-dark">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* use cases */}
      {api.useCases && api.useCases.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-text-dark mb-6">Use Cases</h3>
          <div className="flex flex-wrap gap-3">
            {api.useCases.map((uc, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-bg-subtle border border-border-light rounded-[10px] text-sm text-text-dark"
              >
                {uc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* getting started */}
      <div>
        <h3 className="text-xl font-bold text-text-dark mb-6">Getting Started</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.num} className="border-2 border-border-light rounded-[10px] p-5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mb-3">
                {step.num}
              </div>
              <h4 className="font-semibold text-text-dark mb-1">{step.title}</h4>
              <p className="text-sm text-text-secondary">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* faq */}
      <div>
        <h3 className="text-xl font-bold text-text-dark mb-6">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-2 border-border-light rounded-[10px] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-text-dark hover:bg-bg-subtle transition-colors"
              >
                {faq.q}
                <span className={`ml-2 transition-transform duration-200 ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`faq-answer ${openFaq === idx ? 'open' : ''}`}>
                <div>
                  <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────── tab: API ───────────────────────────── */

const APITab = ({ api }) => {
  const [lang, setLang] = useState('python');
  const languages = [
    { key: 'python', label: 'Python' },
    { key: 'javascript', label: 'JavaScript' },
    { key: 'curl', label: 'cURL' },
  ];

  useEffect(() => {
    Prism.highlightAll();
  }, [lang]);

  if (!api.codeExamples) {
    return <p className="text-text-secondary text-sm">No code examples available for this model.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-text-dark">Code Examples</h3>

      {/* language tabs */}
      <div className="flex gap-1 border-b border-border-light">
        {languages.map((l) => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              lang === l.key
                ? 'text-primary'
                : 'text-text-secondary hover:text-text-dark'
            }`}
          >
            {l.label}
            {lang === l.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* code */}
      {api.codeExamples[lang] && (
        <CodeBlock code={api.codeExamples[lang]} language={lang} />
      )}
    </div>
  );
};

/* ──────────────────────────── pricing sidebar ───────────────────── */

const PricingSidebar = ({ pricing }) => {
  if (!pricing) return null;

  const rows = [];

  if (pricing.input !== undefined && pricing.output !== undefined) {
    rows.push({ label: 'Input', value: `$${pricing.input}` });
    rows.push({ label: 'Output', value: `$${pricing.output}` });
    rows.push({ label: 'Unit', value: pricing.unit });
  } else if (pricing.standard !== undefined && pricing.hd !== undefined) {
    rows.push({ label: 'Standard', value: `$${pricing.standard}` });
    rows.push({ label: 'HD', value: `$${pricing.hd}` });
    rows.push({ label: 'Unit', value: pricing.unit });
  } else if (pricing.standard !== undefined && pricing.pro !== undefined) {
    rows.push({ label: 'Standard', value: `$${pricing.standard}` });
    rows.push({ label: 'Pro', value: `$${pricing.pro}` });
    rows.push({ label: 'Unit', value: pricing.unit });
  } else if (pricing.standard !== undefined) {
    rows.push({ label: 'Price', value: `$${pricing.standard}` });
    rows.push({ label: 'Unit', value: pricing.unit });
  } else if (pricing.rate !== undefined) {
    rows.push({ label: 'Price', value: `$${pricing.rate}` });
    rows.push({ label: 'Unit', value: pricing.unit });
  }

  return (
    <div className="border-2 border-border-light rounded-[10px] p-6 sticky top-8">
      <h3 className="text-lg font-bold text-text-dark mb-4">Pricing</h3>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{row.label}</span>
            <span className="font-semibold text-text-dark">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border-light">
        <button className="btn-primary w-full text-sm py-2.5">Get API Key</button>
      </div>
    </div>
  );
};

/* ──────────────────────────── main component ────────────────────── */

const TABS = [
  { key: 'playground', label: 'Playground' },
  { key: 'introduction', label: 'Introduction' },
  { key: 'api', label: 'API' },
];

const APIDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('playground');
  const [idCopied, setIdCopied] = useState(false);

  const api = getAPIById(id);

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab]);

  /* 404 */
  if (!api) {
    return (
      <div className="section-container py-24 text-center">
        <h1 className="text-3xl font-bold text-text-dark mb-4">Model not found</h1>
        <p className="text-text-secondary mb-8">
          The model you are looking for does not exist or has been removed.
        </p>
        <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft size={16} />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const handleCopyId = () => {
    copy(api.id);
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  const hasCommercialUse = api.features?.some((f) =>
    f.toLowerCase().includes('commercial')
  );

  return (
    <div className="section-container py-10">
      {/* back link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
      >
        <FiArrowLeft size={14} />
        Back
      </button>

      {/* ─── header ─── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-text-dark">{api.name}</h1>
          <button
            onClick={handleCopyId}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
              idCopied
                ? 'border-green-300 text-green-600 bg-green-50'
                : 'border-border-light text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {idCopied ? <FiCheck size={12} /> : <FiCopy size={12} />}
            {api.id}
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-1">by {api.provider}</p>
        <p className="text-text-dark mb-4 max-w-2xl">{api.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[api.type] || TYPE_COLORS.text}`}>
            {api.type.charAt(0).toUpperCase() + api.type.slice(1)}
          </span>
          {hasCommercialUse && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Commercial use
            </span>
          )}
        </div>
      </div>

      {/* ─── tabs ─── */}
      <div className="flex gap-1 border-b border-border-light mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? 'text-primary'
                : 'text-text-secondary hover:text-text-dark'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ─── body + sidebar ─── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* main content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'playground' && <PlaygroundTab api={api} />}
          {activeTab === 'introduction' && <IntroductionTab api={api} />}
          {activeTab === 'api' && <APITab api={api} />}
        </div>

        {/* sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <PricingSidebar pricing={api.pricing} />
        </div>
      </div>
    </div>
  );
};

export default APIDetail;
