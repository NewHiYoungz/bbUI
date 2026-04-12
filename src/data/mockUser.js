import { getAPIById } from './mockAPIs';

// ── Model pools by type ──
const TEXT_MODELS = ['gpt-4o', 'gpt-5', 'claude-sonnet-4-6', 'gemini-2-5-pro', 'deepseek-v3', 'grok-4'];
const IMAGE_MODELS = ['dall-e-3', 'gpt-4o-image', 'seedream-5-lite', 'seedream-4-5', 'nano-banana-2'];
const VIDEO_MODELS = ['sora-2', 'sora-2-pro', 'veo-3-1', 'wan-2-6', 'hailuo-02'];
const AUDIO_MODELS = ['whisper-1'];
const ALL_MODELS = [...TEXT_MODELS, ...IMAGE_MODELS, ...VIDEO_MODELS, ...AUDIO_MODELS];

const REASONING_MODELS = new Set(['gpt-5', 'claude-sonnet-4-6', 'gemini-2-5-pro', 'deepseek-v3']);
const ANTHROPIC_CACHE_MODELS = new Set(['claude-sonnet-4-6']);

const API_KEYS = ['sk-supremind-****abc1', 'sk-supremind-****dev2'];
const ENDPOINTS = {
  text: '/v1/chat/completions',
  image: '/v1/images/generations',
  video: '/v1/videos/generate',
  audio: '/v1/audio/transcriptions',
};
const FINISH_REASONS = ['stop', 'stop', 'stop', 'length', 'tool_calls'];
const IMAGE_SIZES = ['512x512', '1024x1024', '2048x2048', '4096x4096'];
const IMAGE_RATIOS = ['1:1', '4:3', '16:9', '9:16'];
const IMAGE_STYLES = ['natural', 'vivid', 'anime'];
const VIDEO_RESOLUTIONS = ['720p', '1080p', '4k'];
const VIDEO_RATIOS = ['16:9', '9:16', '1:1', '4:3'];
const AUDIO_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ko'];
const AUDIO_FORMATS = ['json', 'text', 'srt', 'verbose_json'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── Cost helpers ──
const tokenCost = (count, ratePerMillion) =>
  parseFloat(((count * ratePerMillion) / 1_000_000).toFixed(6));

const calcTextCostBreakdown = (model, tokens) => {
  const api = getAPIById(model);
  const p = api?.pricing || { input: 3.00, output: 15.00 };
  const bd = {};

  bd.input = tokenCost(tokens.inputTokens, p.input);

  if (tokens.cacheReadTokens > 0) {
    const rate = p.cacheRead ?? p.cachedInput ?? p.input;
    bd.cacheRead = tokenCost(tokens.cacheReadTokens, rate);
  }
  if (tokens.cacheWriteTokens > 0) {
    const rate = p.cacheWrite ?? p.input;
    bd.cacheWrite = tokenCost(tokens.cacheWriteTokens, rate);
  }

  bd.output = tokenCost(tokens.outputTokens, p.output);

  if (tokens.reasoningTokens > 0) {
    bd.reasoning = tokenCost(tokens.reasoningTokens, p.reasoning ?? p.output);
  }

  return bd;
};

// ── Generate rich call records ──
const generateRecentCalls = () => {
  const calls = [];
  const statuses = [200, 200, 200, 200, 200, 200, 200, 200, 429, 500, 400, 401];

  for (let i = 0; i < 200; i++) {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - i * rand(3, 45));

    // Weight towards text (60%), then image (20%), video (12%), audio (8%)
    const roll = Math.random();
    let type, model;
    if (roll < 0.60) { type = 'text'; model = pick(TEXT_MODELS); }
    else if (roll < 0.80) { type = 'image'; model = pick(IMAGE_MODELS); }
    else if (roll < 0.92) { type = 'video'; model = pick(VIDEO_MODELS); }
    else { type = 'audio'; model = pick(AUDIO_MODELS); }

    const status = pick(statuses);
    const base = {
      id: `call_${Date.now()}_${i}`,
      timestamp: timestamp.toISOString(),
      model,
      type,
      status,
      latency: status === 200 ? rand(80, 2500) : rand(20, 200),
      apiKey: pick(API_KEYS),
      endpoint: ENDPOINTS[type],
    };

    if (type === 'text') {
      const inputTokens = rand(10, 4000);
      const outputTokens = status === 200 ? rand(20, 4096) : 0;

      // Cache activity: 60% no cache, 25% read-heavy, 15% write-heavy
      let cacheReadTokens = 0;
      let cacheWriteTokens = 0;
      if (status === 200) {
        const cacheRoll = Math.random();
        if (cacheRoll < 0.25) {
          // Read-heavy: large read, small or zero write
          cacheReadTokens = rand(500, 5000);
          if (ANTHROPIC_CACHE_MODELS.has(model)) {
            cacheWriteTokens = Math.random() > 0.6 ? rand(100, 800) : 0;
          }
        } else if (cacheRoll < 0.40) {
          // Write-heavy: tokens written to cache
          if (ANTHROPIC_CACHE_MODELS.has(model)) {
            cacheWriteTokens = rand(200, 2000);
            cacheReadTokens = Math.random() > 0.5 ? rand(200, 1000) : 0;
          } else {
            // OpenAI-style: only reads are discounted, writes are just normal input
            cacheReadTokens = rand(200, 1500);
          }
        }
      }

      // Reasoning tokens: only for reasoning-capable models, ~60% of their calls
      let reasoningTokens = 0;
      if (status === 200 && REASONING_MODELS.has(model) && Math.random() < 0.60) {
        reasoningTokens = rand(500, 3000);
      }

      const totalTokens = inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens + reasoningTokens;

      const tokens = { inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens };
      const costBreakdown = status === 200 ? calcTextCostBreakdown(model, tokens) : {};
      const cost = status === 200
        ? parseFloat(Object.values(costBreakdown).reduce((a, b) => a + b, 0).toFixed(6))
        : 0;

      Object.assign(base, {
        inputTokens,
        outputTokens,
        cacheReadTokens,
        cacheWriteTokens,
        reasoningTokens,
        totalTokens,
        costBreakdown,
        cost,
        streaming: Math.random() > 0.4,
        temperature: parseFloat((Math.random()).toFixed(1)),
        maxTokens: pick([1024, 2048, 4096, 8192]),
        finishReason: status === 200 ? pick(FINISH_REASONS) : null,
        systemFingerprint: status === 200 ? `fp_${rand(10000, 99999)}` : null,
      });
    } else if (type === 'image') {
      const imageCount = rand(1, 4);
      const quality = pick(['standard', 'standard', 'standard', 'hd']);
      const api = getAPIById(model);
      const rate = (quality === 'hd' && api?.pricing?.hd) ? api.pricing.hd : (api?.pricing?.standard || 0.04);

      Object.assign(base, {
        size: pick(IMAGE_SIZES),
        aspectRatio: pick(IMAGE_RATIOS),
        style: pick(IMAGE_STYLES),
        quality,
        imageCount,
        seed: Math.random() > 0.5 ? rand(1, 999999) : null,
        cost: status === 200 ? parseFloat((imageCount * rate).toFixed(4)) : 0,
      });
    } else if (type === 'video') {
      const duration = pick([5, 10]);
      const api = getAPIById(model);
      const isPerSecond = api?.pricing?.unit === 'per second';
      const rate = api?.pricing?.standard || 0.05;
      const videoCost = isPerSecond ? duration * rate : rate;

      Object.assign(base, {
        duration,
        resolution: pick(VIDEO_RESOLUTIONS),
        aspectRatio: pick(VIDEO_RATIOS),
        fps: pick([24, 30]),
        mode: pick(['text-to-video', 'image-to-video']),
        hasAudio: Math.random() > 0.4,
        cost: status === 200 ? parseFloat(videoCost.toFixed(4)) : 0,
      });
    } else {
      const audioDuration = rand(5, 300);
      const api = getAPIById(model);
      const rate = api?.pricing?.rate || 0.006;

      Object.assign(base, {
        audioDuration,
        language: pick(AUDIO_LANGUAGES),
        format: pick(AUDIO_FORMATS),
        timestamps: Math.random() > 0.5,
        segments: rand(1, Math.ceil(audioDuration / 10)),
        cost: status === 200 ? parseFloat(((audioDuration / 60) * rate).toFixed(6)) : 0,
      });
    }

    calls.push(base);
  }

  return calls;
};

// ── Generate daily usage history with breakdowns ──
const generateUsageHistory = (days = 90) => {
  const history = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const textCalls = rand(300, 900);
    const imageCalls = rand(50, 250);
    const videoCalls = rand(10, 80);
    const audioCalls = rand(5, 40);
    const totalCalls = textCalls + imageCalls + videoCalls + audioCalls;
    const tokens = rand(80000, 350000);
    const errorCount = rand(0, Math.floor(totalCalls * 0.05));
    const avgLatency = rand(150, 600);
    const cost = parseFloat((textCalls * 0.008 + imageCalls * 0.04 + videoCalls * 0.35 + audioCalls * 0.01).toFixed(2));

    // Per-model token distribution (text models only, roughly)
    const tokensByModel = {};
    const modelPool = [...TEXT_MODELS];
    let remaining = tokens;
    for (let m = 0; m < modelPool.length; m++) {
      if (m === modelPool.length - 1) {
        tokensByModel[modelPool[m]] = remaining;
      } else {
        const share = rand(Math.floor(remaining * 0.05), Math.floor(remaining * 0.4));
        tokensByModel[modelPool[m]] = share;
        remaining -= share;
      }
    }

    history.push({
      date: date.toISOString().split('T')[0],
      calls: totalCalls,
      tokens,
      cost,
      callsByType: { text: textCalls, image: imageCalls, video: videoCalls, audio: audioCalls },
      tokensByModel,
      errorCount,
      avgLatency,
    });
  }

  return history;
};

// ── Aggregation helpers ──
const cachedCalls = generateRecentCalls();
const cachedHistory = generateUsageHistory(90);

export const mockUser = {
  id: 'user_123',
  email: 'demo@supremind.ai',
  name: 'Demo User',
  apiKey: 'sk-supremind-demo-abc123xyz789',
  plan: 'Pro',
  joined: '2025-12-15',
  usage: {
    currentMonth: {
      calls: 15420,
      tokens: 2300000,
      cost: 127.50,
      limit: 1000000000,
    },
    history: cachedHistory,
  },
  recentCalls: cachedCalls,
};

export const getUsageByDateRange = (days = 30) => {
  return cachedHistory.slice(-days);
};

export const getRecentCalls = (limit = 200) => {
  return cachedCalls.slice(0, limit);
};

export const getModelUsageBreakdown = () => {
  const breakdown = {};
  for (const call of cachedCalls) {
    if (!breakdown[call.model]) {
      breakdown[call.model] = { model: call.model, type: call.type, calls: 0, tokens: 0, cost: 0, totalLatency: 0, errors: 0 };
    }
    const b = breakdown[call.model];
    b.calls++;
    b.tokens += call.totalTokens || 0;
    b.cost += call.cost || 0;
    b.totalLatency += call.latency;
    if (call.status !== 200) b.errors++;
  }
  return Object.values(breakdown).map((b) => ({
    ...b,
    cost: parseFloat(b.cost.toFixed(4)),
    avgLatency: Math.round(b.totalLatency / b.calls),
  })).sort((a, b) => b.calls - a.calls);
};

export const getErrorBreakdown = () => {
  const errors = {};
  for (const call of cachedCalls) {
    if (call.status !== 200) {
      if (!errors[call.status]) {
        errors[call.status] = { status: call.status, count: 0, lastOccurred: call.timestamp };
      }
      errors[call.status].count++;
      if (call.timestamp > errors[call.status].lastOccurred) {
        errors[call.status].lastOccurred = call.timestamp;
      }
    }
  }
  const total = Object.values(errors).reduce((s, e) => s + e.count, 0);
  return Object.values(errors).map((e) => ({
    ...e,
    percentage: total > 0 ? parseFloat(((e.count / total) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.count - a.count);
};
