import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAPIById } from '../data/mockAPIs';
import { useAuth } from '../context';
import copy from 'copy-to-clipboard';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import {
  FiCopy, FiCheck, FiPlay, FiArrowLeft, FiStar, FiZap, FiShield, FiGlobe,
  FiLock, FiUploadCloud, FiX, FiImage, FiFilm, FiChevronDown,
} from 'react-icons/fi';

const TYPE_COLORS = {
  text: 'bg-blue-900/50 text-blue-300 border border-blue-500/30',
  image: 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30',
  video: 'bg-violet-900/50 text-violet-300 border border-violet-500/30',
  audio: 'bg-amber-900/50 text-amber-300 border border-amber-500/30',
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

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

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
        copied ? 'text-green-400' : 'text-text-muted hover:text-white'
      } ${className}`}
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const CodeBlock = ({ code, language }) => (
  <div className="relative group">
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton text={code} />
    </div>
    <pre className="bg-body text-text-secondary rounded-[10px] p-5 overflow-x-auto text-sm leading-relaxed border border-border-light">
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

/* ── Shared: Toggle Button Group ── */
const ToggleGroup = ({ options, value, onChange, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {options.map((opt) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const label = typeof opt === 'string' ? opt : opt.label;
      return (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={`px-3 py-1.5 rounded-[10px] text-sm font-medium border-2 transition-colors ${
            value === val
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border-light text-text-secondary hover:border-border-hover'
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

/* ── Shared: File Upload Zone ── */
const FileUploadZone = ({ files, onAdd, onRemove, maxFiles = 8, label = 'Upload Images', subtitle }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const validateAndAdd = useCallback((fileList) => {
    setError('');
    const incoming = Array.from(fileList);
    const valid = [];

    for (const f of incoming) {
      if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) {
        setError(`"${f.name}" is not a supported format. Use JPEG, PNG, or WEBP.`);
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError(`"${f.name}" exceeds 30 MB.`);
        return;
      }
      valid.push(f);
    }

    if (files.length + valid.length > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed.`);
      return;
    }

    onAdd(valid);
  }, [files.length, maxFiles, onAdd]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndAdd(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      {subtitle && <p className="text-xs text-text-muted mb-2">{subtitle}</p>}

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((f, i) => (
            <div key={i} className="relative group/thumb w-20 h-20 rounded-lg overflow-hidden border border-border-light">
              <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
              >
                <FiX size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border-light hover:border-border-hover'
          }`}
        >
          <FiUploadCloud className="mx-auto mb-2 text-text-muted" size={24} />
          <p className="text-sm text-text-muted">Drag & drop or click to browse</p>
          <p className="text-xs text-text-muted mt-1">JPEG, PNG, WEBP &middot; Max 30 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple={maxFiles > 1}
            className="hidden"
            onChange={(e) => {
              validateAndAdd(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
};

/* ── Text Playground ── */
const TextPlayground = ({ api }) => {
  const [prompt, setPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={5}
          className="w-full border-2 border-border-light rounded-[10px] p-4 text-sm resize-none bg-surface-light text-white placeholder:text-text-muted
                     focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Model</label>
          <select
            className="w-full border-2 border-border-light rounded-[10px] px-4 py-2.5 text-sm
                       focus:border-primary focus:outline-none bg-surface-light text-white transition-colors"
            defaultValue={api.id}
          >
            <option value={api.id}>{api.name}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
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
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>1</span>
            <span>4096</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
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
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>0 (Deterministic)</span>
          <span>2 (Creative)</span>
        </div>
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <FiPlay size={16} />
        Run
      </button>

      <div className="border-2 border-border-light rounded-[10px] p-6 bg-body min-h-[120px] flex items-center justify-center">
        <p className="text-text-muted text-sm">Response will appear here</p>
      </div>
    </div>
  );
};

/* ── Image Playground ── */
const IMAGE_SIZES = [
  { value: '512x512', label: '512 \u00d7 512' },
  { value: '1024x1024', label: '1K (1024 \u00d7 1024)' },
  { value: '2048x2048', label: '2K (2048 \u00d7 2048)' },
  { value: '4096x4096', label: '4K (4096 \u00d7 4096)' },
];

const IMAGE_RATIOS = ['1:1', '4:3', '3:2', '16:9', '9:16'];

const ImagePlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('natural');
  const [files, setFiles] = useState([]);

  const addFiles = useCallback((newFiles) => {
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ name: f.name, size: f.size, preview: URL.createObjectURL(f) })),
    ]);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  }, []);

  // Compute display dimensions from base size + aspect ratio
  const basePx = parseInt(size.split('x')[0], 10);
  const [rw, rh] = aspectRatio.split(':').map(Number);
  const displayW = basePx;
  const displayH = Math.round(basePx * (rh / rw));

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <FileUploadZone
        files={files}
        onAdd={addFiles}
        onRemove={removeFile}
        maxFiles={8}
        label="Reference Images (optional)"
        subtitle="Upload images for editing or style reference. JPEG, PNG, WEBP \u2022 Max 30 MB \u2022 Up to 8 files"
      />

      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={4}
          className="w-full border-2 border-border-light rounded-[10px] p-4 text-sm resize-none bg-surface-light text-white placeholder:text-text-muted
                     focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Size + Aspect Ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border-2 border-border-light rounded-[10px] px-4 py-2.5 text-sm
                       focus:border-primary focus:outline-none bg-surface-light text-white transition-colors"
          >
            {IMAGE_SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Aspect Ratio</label>
          <ToggleGroup options={IMAGE_RATIOS} value={aspectRatio} onChange={setAspectRatio} />
        </div>
      </div>

      {/* Computed dimensions */}
      {aspectRatio !== '1:1' && (
        <p className="text-xs text-text-muted -mt-3">
          Output dimensions: {displayW} \u00d7 {displayH} px
        </p>
      )}

      {/* Style */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Style</label>
        <ToggleGroup options={['natural', 'vivid', 'anime']} value={style} onChange={setStyle} />
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <FiPlay size={16} />
        Generate
      </button>

      <div className="border-2 border-border-light rounded-[10px] p-6 bg-body min-h-[200px] flex items-center justify-center">
        <p className="text-text-muted text-sm">Generated image will appear here</p>
      </div>
    </div>
  );
};

/* ── Video Playground ── */
const VIDEO_MODES = [
  { key: 'text', label: 'Text to Video', icon: FiFilm },
  { key: 'image', label: 'Image to Video', icon: FiImage },
  { key: 'frames', label: 'Start & End Frame', icon: FiImage },
];

const VIDEO_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:2', '21:9'];

const CAMERA_MOVEMENTS = [
  'None', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down',
  'Zoom In', 'Zoom Out', 'Orbit', 'Dolly In', 'Dolly Out',
];

const VideoPlayground = () => {
  const [mode, setMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [showNeg, setShowNeg] = useState(false);
  const [duration, setDuration] = useState('10');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1080p');
  const [camera, setCamera] = useState('None');
  const [motion, setMotion] = useState(5);
  const [startFrame, setStartFrame] = useState([]);
  const [endFrame, setEndFrame] = useState([]);

  const addStartFrame = useCallback((newFiles) => {
    setStartFrame(newFiles.map((f) => ({ name: f.name, size: f.size, preview: URL.createObjectURL(f) })));
  }, []);
  const removeStartFrame = useCallback(() => {
    startFrame.forEach((f) => URL.revokeObjectURL(f.preview));
    setStartFrame([]);
  }, [startFrame]);

  const addEndFrame = useCallback((newFiles) => {
    setEndFrame(newFiles.map((f) => ({ name: f.name, size: f.size, preview: URL.createObjectURL(f) })));
  }, []);
  const removeEndFrame = useCallback(() => {
    endFrame.forEach((f) => URL.revokeObjectURL(f.preview));
    setEndFrame([]);
  }, [endFrame]);

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex border-b border-border-light">
        {VIDEO_MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors relative ${
                mode === m.key ? 'text-primary' : 'text-text-secondary hover:text-white'
              }`}
            >
              <Icon size={14} />
              {m.label}
              {mode === m.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Frame Uploads */}
      {mode === 'image' && (
        <FileUploadZone
          files={startFrame}
          onAdd={addStartFrame}
          onRemove={removeStartFrame}
          maxFiles={1}
          label="Reference Image"
          subtitle="Upload a source image to animate. JPEG, PNG, WEBP \u2022 Max 30 MB"
        />
      )}

      {mode === 'frames' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadZone
            files={startFrame}
            onAdd={addStartFrame}
            onRemove={removeStartFrame}
            maxFiles={1}
            label="Start Frame"
            subtitle="Opening frame of the video"
          />
          <FileUploadZone
            files={endFrame}
            onAdd={addEndFrame}
            onRemove={removeEndFrame}
            maxFiles={1}
            label="End Frame"
            subtitle="Closing frame of the video"
          />
        </div>
      )}

      {/* Prompt */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to generate..."
          rows={4}
          className="w-full border-2 border-border-light rounded-[10px] p-4 text-sm resize-none bg-surface-light text-white placeholder:text-text-muted
                     focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Negative Prompt (collapsible) */}
      <div>
        <button
          onClick={() => setShowNeg(!showNeg)}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors"
        >
          <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${showNeg ? 'rotate-180' : ''}`} />
          Negative Prompt (optional)
        </button>
        {showNeg && (
          <textarea
            value={negPrompt}
            onChange={(e) => setNegPrompt(e.target.value)}
            placeholder="Describe what to avoid in the generated video..."
            rows={2}
            className="w-full mt-2 border-2 border-border-light rounded-[10px] p-4 text-sm resize-none bg-surface-light text-white placeholder:text-text-muted
                       focus:border-primary focus:outline-none transition-colors"
          />
        )}
      </div>

      {/* Duration + Aspect Ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Duration</label>
          <ToggleGroup
            options={[
              { value: '5', label: '5s' },
              { value: '10', label: '10s' },
            ]}
            value={duration}
            onChange={setDuration}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Aspect Ratio</label>
          <ToggleGroup options={VIDEO_RATIOS} value={aspectRatio} onChange={setAspectRatio} />
        </div>
      </div>

      {/* Resolution + Camera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Quality</label>
          <ToggleGroup
            options={[
              { value: '720p', label: 'Standard (720p)' },
              { value: '1080p', label: 'Professional (1080p)' },
              { value: '4k', label: '4K' },
            ]}
            value={resolution}
            onChange={setResolution}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Camera Movement</label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="w-full border-2 border-border-light rounded-[10px] px-4 py-2.5 text-sm
                       focus:border-primary focus:outline-none bg-surface-light text-white transition-colors"
          >
            {CAMERA_MOVEMENTS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Motion Intensity */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Motion Intensity: <span className="text-primary font-semibold">{motion}</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={motion}
          onChange={(e) => setMotion(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>Subtle</span>
          <span>Dynamic</span>
        </div>
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <FiPlay size={16} />
        Generate
      </button>

      <div className="border-2 border-border-light rounded-[10px] p-6 bg-body min-h-[200px] flex items-center justify-center">
        <p className="text-text-muted text-sm">Generated video will appear here</p>
      </div>
    </div>
  );
};

/* ── Audio Playground ── */
const AudioPlayground = () => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-white mb-2">Upload Audio File</label>
      <div className="border-2 border-dashed border-border-light rounded-[10px] p-8 text-center">
        <p className="text-text-muted text-sm">Drag and drop an audio file here, or click to browse</p>
        <button className="mt-4 btn-secondary text-sm py-2 px-4">Choose File</button>
      </div>
    </div>

    <button className="btn-primary inline-flex items-center gap-2">
      <FiPlay size={16} />
      Transcribe
    </button>

    <div className="border-2 border-border-light rounded-[10px] p-6 bg-body min-h-[120px] flex items-center justify-center">
      <p className="text-text-muted text-sm">Response will appear here</p>
    </div>
  </div>
);

/* ── Auth Gate + Playground Router ── */
const PlaygroundTab = ({ api }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="border-2 border-border-light rounded-[10px] p-12 text-center bg-surface">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FiLock className="text-primary" size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Sign in to use the Playground</h3>
        <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
          You need an account to try models in the playground. Sign up for free and get started in seconds.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/login" className="btn-primary text-sm py-2.5 px-6">Log In</Link>
          <Link to="/login?tab=signup" className="btn-secondary text-sm py-2.5 px-6">Sign Up</Link>
        </div>
      </div>
    );
  }

  const playgrounds = {
    text: TextPlayground,
    image: ImagePlayground,
    video: VideoPlayground,
    audio: AudioPlayground,
  };

  const Playground = playgrounds[api.type] || TextPlayground;
  return <Playground api={api} />;
};

/* ── Introduction Tab ── */
const IntroductionTab = ({ api }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: 'Users', value: '50K+', icon: FiGlobe },
    { label: 'Uptime', value: '99.9%', icon: FiShield },
    { label: 'Faster', value: '2x', icon: FiZap },
    { label: 'Cost Savings', value: '70%', icon: FiStar },
  ];

  const steps = [
    { num: 1, title: 'Sign Up', desc: 'Create your free supremind.ai account to get started.' },
    { num: 2, title: 'Add Funds', desc: 'Add credits to your account. Pay only for what you use.' },
    { num: 3, title: 'Generate API Key', desc: 'Create a secure API key from your dashboard.' },
    { num: 4, title: 'Make First API Call', desc: 'Use our SDK or REST API to integrate in minutes.' },
  ];

  const faqs = [
    {
      q: `What is ${api.name} and what can it do?`,
      a: `${api.name} is a ${api.type} model by ${api.provider}. ${api.description} It is available through the supremind.ai unified API with a single API key.`,
    },
    {
      q: `How much does ${api.name} cost?`,
      a: `Pricing for ${api.name} is ${formatPrice(api.pricing)}. You only pay for what you use with no minimum commitments or monthly fees.`,
    },
    {
      q: 'How do I get started?',
      a: 'Sign up for a free supremind.ai account, add funds, generate your API key, and start making requests. Our SDK supports Python, JavaScript, and REST API calls.',
    },
    {
      q: 'Is there a rate limit?',
      a: 'Free tier accounts have standard rate limits. Paid plans offer higher throughput and priority access. Contact us for enterprise-grade limits.',
    },
  ];

  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">{api.name}</h2>
        <p className="text-lg text-text-secondary mb-2">{formatPrice(api.pricing)}</p>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <s.icon className="text-primary" size={22} />
              <span className="text-xl font-bold text-white">{s.value}</span>
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {api.features && api.features.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Capabilities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {api.features.map((feat, idx) => (
              <div
                key={idx}
                className="border-2 border-border-light rounded-[10px] p-5 hover:border-primary transition-colors"
              >
                <p className="font-medium text-white">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {api.useCases && api.useCases.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Use Cases</h3>
          <div className="flex flex-wrap gap-3">
            {api.useCases.map((uc, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-surface border border-border-light rounded-[10px] text-sm text-text-secondary"
              >
                {uc}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-white mb-6">Getting Started</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.num} className="border-2 border-border-light rounded-[10px] p-5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mb-3">
                {step.num}
              </div>
              <h4 className="font-semibold text-white mb-1">{step.title}</h4>
              <p className="text-sm text-text-secondary">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-2 border-border-light rounded-[10px] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-white hover:bg-surface-light transition-colors"
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

/* ── API Tab ── */
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
      <h3 className="text-xl font-bold text-white">Code Examples</h3>

      <div className="flex gap-1 border-b border-border-light">
        {languages.map((l) => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              lang === l.key
                ? 'text-primary'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {l.label}
            {lang === l.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {api.codeExamples[lang] && (
        <CodeBlock code={api.codeExamples[lang]} language={lang} />
      )}
    </div>
  );
};

/* ── Pricing Sidebar ── */
const PricingSidebar = ({ pricing }) => {
  if (!pricing) return null;

  const rows = [];

  if (pricing.input !== undefined && pricing.output !== undefined) {
    rows.push({ label: 'Input', value: `$${pricing.input}` });
    rows.push({ label: 'Output', value: `$${pricing.output}` });
    if (pricing.cachedInput !== undefined) rows.push({ label: 'Cached Input', value: `$${pricing.cachedInput}` });
    if (pricing.cacheWrite !== undefined) rows.push({ label: 'Cache Write', value: `$${pricing.cacheWrite}` });
    if (pricing.cacheRead !== undefined) rows.push({ label: 'Cache Read', value: `$${pricing.cacheRead}` });
    if (pricing.reasoning !== undefined) rows.push({ label: 'Reasoning', value: `$${pricing.reasoning}` });
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
    <div className="border-2 border-border-light rounded-[10px] p-6 sticky top-8 bg-surface">
      <h3 className="text-lg font-bold text-white mb-4">Pricing</h3>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{row.label}</span>
            <span className="font-semibold text-white">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border-light">
        <button className="btn-primary w-full text-sm py-2.5">Get API Key</button>
      </div>
    </div>
  );
};

/* ── Main Page ── */
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

  if (!api) {
    return (
      <div className="section-container py-24 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Model not found</h1>
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
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
      >
        <FiArrowLeft size={14} />
        Back
      </button>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">{api.name}</h1>
          <button
            onClick={handleCopyId}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
              idCopied
                ? 'border-green-500/30 text-green-400 bg-green-500/10'
                : 'border-border-light text-text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {idCopied ? <FiCheck size={12} /> : <FiCopy size={12} />}
            {api.id}
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-1">by {api.provider}</p>
        <p className="text-text-secondary mb-4 max-w-2xl">{api.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[api.type] || TYPE_COLORS.text}`}>
            {api.type.charAt(0).toUpperCase() + api.type.slice(1)}
          </span>
          {hasCommercialUse && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
              Commercial use
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b border-border-light mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? 'text-primary'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {activeTab === 'playground' && <PlaygroundTab api={api} />}
          {activeTab === 'introduction' && <IntroductionTab api={api} />}
          {activeTab === 'api' && <APITab api={api} />}
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <PricingSidebar pricing={api.pricing} />
        </div>
      </div>
    </div>
  );
};

export default APIDetail;
