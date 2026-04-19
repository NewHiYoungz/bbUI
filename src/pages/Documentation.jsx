import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import {
  FiCopy, FiCheck, FiSearch, FiMenu, FiX, FiChevronRight,
  FiBook, FiKey, FiCode, FiImage, FiFilm, FiMusic,
  FiDollarSign, FiAlertTriangle, FiZap, FiShield,
  FiTerminal, FiLayout, FiInfo, FiExternalLink,
  FiArrowRight, FiChevronDown, FiHash,
} from 'react-icons/fi';

/* ═══════════════════════════════════════════
   DATA CONSTANTS
   ═══════════════════════════════════════════ */

const BASE_URL = 'https://api.supremind.ai/v1';

const NAV_SECTIONS = [
  {
    label: 'GETTING STARTED',
    items: [
      { id: 'getting-started', title: 'Introduction', icon: FiBook, keywords: ['intro', 'overview', 'quick start', 'hello world'] },
      { id: 'authentication', title: 'Authentication', icon: FiKey, keywords: ['api key', 'auth', 'bearer', 'token', 'header'] },
    ],
  },
  {
    label: 'API REFERENCE',
    items: [
      { id: 'text-api', title: 'Text Completions', icon: FiCode, keywords: ['chat', 'completions', 'gpt', 'claude', 'gemini', 'messages', 'streaming'] },
      { id: 'image-api', title: 'Image Generation', icon: FiImage, keywords: ['dall-e', 'seedream', 'generate image', 'size', 'style'] },
      { id: 'video-api', title: 'Video Generation', icon: FiFilm, keywords: ['sora', 'veo', 'video', 'duration', 'camera'] },
      { id: 'audio-api', title: 'Audio Transcription', icon: FiMusic, keywords: ['whisper', 'transcribe', 'speech', 'srt', 'language'] },
    ],
  },
  {
    label: 'REFERENCE',
    items: [
      { id: 'models-pricing', title: 'Models & Pricing', icon: FiDollarSign, keywords: ['price', 'cost', 'tokens', 'models', 'cache', 'reasoning'] },
      { id: 'error-handling', title: 'Error Handling', icon: FiAlertTriangle, keywords: ['error', '400', '401', '429', '500', 'retry'] },
      { id: 'rate-limits', title: 'Rate Limits', icon: FiShield, keywords: ['rate limit', 'rpm', 'tpm', 'throttle', '429', 'quota'] },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { id: 'sdks', title: 'SDKs & Libraries', icon: FiTerminal, keywords: ['sdk', 'python', 'javascript', 'npm', 'pip', 'install', 'curl'] },
      { id: 'dashboard-guide', title: 'Dashboard Guide', icon: FiLayout, keywords: ['dashboard', 'console', 'analytics', 'billing', 'logs'] },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

const TEXT_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', context: '128K', input: 2.5, output: 10.0, cachedInput: 1.25, reasoning: null },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', context: '1M', input: 1.25, output: 10.0, cachedInput: 0.625, reasoning: 10.0 },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', context: '1M', input: 3.0, output: 15.0, cacheWrite: 3.75, cacheRead: 0.30, reasoning: 15.0 },
  { id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', context: '1M', input: 2.5, output: 15.0, cachedInput: 0.625, reasoning: 15.0 },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', context: '128K', input: 0.14, output: 0.28, cachedInput: 0.014, reasoning: 0.28 },
  { id: 'grok-4', name: 'Grok-4', provider: 'xAI', context: '1M', input: 3.0, output: 15.0, cachedInput: null, reasoning: null },
];

const IMAGE_MODELS = [
  { id: 'seedream-5-lite', name: 'Seedream 5.0 Lite', provider: 'ByteDance', price: '$0.028/image' },
  { id: 'seedream-4-5', name: 'Seedream 4.5', provider: 'ByteDance', price: '$0.020/image' },
  { id: 'nano-banana-2', name: 'Nano Banana 2', provider: 'ByteDance', price: '$0.015/image' },
  { id: 'gpt-4o-image', name: 'GPT-4o Image', provider: 'OpenAI', price: '$0.040/image' },
  { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', price: '$0.04 std / $0.08 HD' },
];

const VIDEO_MODELS = [
  { id: 'sora-2', name: 'Sora 2', provider: 'OpenAI', price: '$0.025 std / $1.0 pro' },
  { id: 'sora-2-pro', name: 'Sora 2 Pro', provider: 'OpenAI', price: '$1.0/generation' },
  { id: 'veo-3-1', name: 'Veo 3.1', provider: 'Google', price: '$0.05/second' },
  { id: 'wan-2-6', name: 'WAN 2.6', provider: 'Alibaba', price: '$0.02/generation' },
  { id: 'hailuo-02', name: 'Hailuo 02', provider: 'MiniMax', price: '$0.03/generation' },
];

const AUDIO_MODELS = [
  { id: 'whisper-1', name: 'Whisper', provider: 'OpenAI', price: '$0.006/minute' },
];

const TEXT_API_PARAMS = [
  { name: 'model', type: 'string', required: true, desc: 'Model ID — e.g. "gpt-4o", "claude-sonnet-4-6", "gemini-2-5-pro"' },
  { name: 'messages', type: 'array', required: true, desc: 'Array of message objects with role and content fields' },
  { name: 'max_tokens', type: 'integer', required: false, desc: 'Maximum number of tokens to generate (default varies by model)' },
  { name: 'temperature', type: 'number', required: false, desc: 'Sampling temperature between 0 and 2. Higher = more creative (default 1)' },
  { name: 'top_p', type: 'number', required: false, desc: 'Nucleus sampling — top cumulative probability cutoff (0–1)' },
  { name: 'stream', type: 'boolean', required: false, desc: 'If true, returns a stream of Server-Sent Events (SSE)' },
  { name: 'n', type: 'integer', required: false, desc: 'Number of completions to generate (default 1)' },
  { name: 'stop', type: 'string | array', required: false, desc: 'Sequence(s) where the model should stop generating' },
  { name: 'frequency_penalty', type: 'number', required: false, desc: 'Penalizes repeated tokens (−2.0 to 2.0, default 0)' },
  { name: 'presence_penalty', type: 'number', required: false, desc: 'Penalizes tokens already present (−2.0 to 2.0, default 0)' },
  { name: 'tools', type: 'array', required: false, desc: 'Function definitions for tool/function calling' },
  { name: 'response_format', type: 'object', required: false, desc: '{ type: "json_object" } to force valid JSON output' },
];

const MESSAGE_FIELDS = [
  { name: 'role', type: 'string', required: true, desc: '"system", "user", or "assistant"' },
  { name: 'content', type: 'string', required: true, desc: 'The message text content' },
  { name: 'name', type: 'string', required: false, desc: 'Optional participant name for multi-turn disambiguation' },
];

const IMAGE_API_PARAMS = [
  { name: 'model', type: 'string', required: true, desc: 'Model ID — e.g. "dall-e-3", "seedream-5-lite", "gpt-4o-image"' },
  { name: 'prompt', type: 'string', required: true, desc: 'Text description of the desired image' },
  { name: 'size', type: 'string', required: false, desc: 'Output dimensions — "512x512", "1024x1024", "2048x2048", "4096x4096"' },
  { name: 'quality', type: 'string', required: false, desc: '"standard" or "hd" (DALL-E 3 only)' },
  { name: 'style', type: 'string', required: false, desc: '"natural", "vivid", or "anime"' },
  { name: 'n', type: 'integer', required: false, desc: 'Number of images to generate (1–4, default 1)' },
  { name: 'response_format', type: 'string', required: false, desc: '"url" (default) or "b64_json"' },
];

const VIDEO_API_PARAMS = [
  { name: 'model', type: 'string', required: true, desc: 'Model ID — e.g. "sora-2", "veo-3-1", "wan-2-6"' },
  { name: 'prompt', type: 'string', required: true, desc: 'Text description of the desired video' },
  { name: 'duration', type: 'integer', required: false, desc: 'Duration in seconds (5–25, default 5)' },
  { name: 'aspect_ratio', type: 'string', required: false, desc: '"16:9", "9:16", "1:1", "4:3" (default "16:9")' },
  { name: 'resolution', type: 'string', required: false, desc: '"720p", "1080p", or "4k"' },
  { name: 'camera_movement', type: 'string', required: false, desc: 'Camera control — "pan_left", "zoom_in", "orbit", etc.' },
  { name: 'motion_intensity', type: 'integer', required: false, desc: 'Motion strength 1–10 (default 5)' },
  { name: 'negative_prompt', type: 'string', required: false, desc: 'Describe what to avoid in the generation' },
  { name: 'image', type: 'string', required: false, desc: 'Base64 or URL of a reference image (image-to-video mode)' },
];

const AUDIO_API_PARAMS = [
  { name: 'model', type: 'string', required: true, desc: '"whisper-1"' },
  { name: 'file', type: 'file', required: true, desc: 'Audio file — mp3, mp4, mpeg, mpga, m4a, wav, or webm (max 25 MB)' },
  { name: 'language', type: 'string', required: false, desc: 'ISO 639-1 code — e.g. "en", "es", "zh". Auto-detected if omitted.' },
  { name: 'response_format', type: 'string', required: false, desc: '"json" (default), "text", "srt", "vtt", "verbose_json"' },
  { name: 'temperature', type: 'number', required: false, desc: 'Sampling temperature 0–1 (default 0)' },
  { name: 'timestamp_granularities', type: 'array', required: false, desc: '["word", "segment"] — requires verbose_json format' },
];

const ERROR_CODES = [
  { status: 400, type: 'bad_request', desc: 'Invalid parameters — check your request body, types, and required fields', color: 'text-yellow-400' },
  { status: 401, type: 'unauthorized', desc: 'Missing or invalid API key — verify your Authorization header', color: 'text-red-400' },
  { status: 403, type: 'forbidden', desc: 'API key lacks permission for this model or action', color: 'text-red-400' },
  { status: 404, type: 'not_found', desc: 'Model ID or endpoint does not exist', color: 'text-yellow-400' },
  { status: 429, type: 'rate_limit_exceeded', desc: 'Too many requests — back off and retry with exponential delay', color: 'text-orange-400' },
  { status: 500, type: 'internal_error', desc: 'Server error on our side — retry after a short delay', color: 'text-red-400' },
  { status: 503, type: 'service_unavailable', desc: 'Model temporarily unavailable — try a different model or retry later', color: 'text-red-400' },
];

const RATE_LIMIT_TIERS = [
  { tier: 'Free', rpm: '60', tpm: '100K', concurrent: '5', daily: '$5' },
  { tier: 'Standard', rpm: '300', tpm: '1M', concurrent: '20', daily: '$50' },
  { tier: 'Pro', rpm: '1,000', tpm: '10M', concurrent: '50', daily: '$500' },
  { tier: 'Enterprise', rpm: 'Custom', tpm: 'Custom', concurrent: 'Custom', daily: 'Custom' },
];

/* ── Code Examples ── */

const CODE = {
  quickStart: {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}",
    api_key="YOUR_API_KEY",
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
)

print(response.choices[0].message.content)`,
    javascript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${BASE_URL}",
  apiKey: "YOUR_API_KEY",
});

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.choices[0].message.content);`,
    curl: `curl ${BASE_URL}/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
  },
  textApi: {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}",
    api_key="YOUR_API_KEY",
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in 3 sentences."},
    ],
    max_tokens=256,
    temperature=0.7,
)

print(response.choices[0].message.content)
print(f"Tokens used: {response.usage.total_tokens}")`,
    javascript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${BASE_URL}",
  apiKey: "YOUR_API_KEY",
});

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Explain quantum computing in 3 sentences." },
  ],
  max_tokens: 256,
  temperature: 0.7,
});

console.log(response.choices[0].message.content);
console.log(\`Tokens used: \${response.usage.total_tokens}\`);`,
    curl: `curl ${BASE_URL}/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in 3 sentences."}
    ],
    "max_tokens": 256,
    "temperature": 0.7
  }'`,
  },
  streaming: {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}",
    api_key="YOUR_API_KEY",
)

stream = client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "Write a haiku about AI."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
    javascript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${BASE_URL}",
  apiKey: "YOUR_API_KEY",
});

const stream = await client.chat.completions.create({
  model: "gpt-5",
  messages: [{ role: "user", content: "Write a haiku about AI." }],
  stream: true,
});

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content;
  if (delta) process.stdout.write(delta);
}`,
    curl: `curl ${BASE_URL}/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -N \\
  -d '{
    "model": "gpt-5",
    "messages": [{"role": "user", "content": "Write a haiku about AI."}],
    "stream": true
  }'`,
  },
  imageApi: {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}",
    api_key="YOUR_API_KEY",
)

response = client.images.generate(
    model="dall-e-3",
    prompt="A futuristic city at sunset, cyberpunk style",
    size="1024x1024",
    quality="hd",
    n=1,
)

print(response.data[0].url)`,
    javascript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${BASE_URL}",
  apiKey: "YOUR_API_KEY",
});

const response = await client.images.generate({
  model: "dall-e-3",
  prompt: "A futuristic city at sunset, cyberpunk style",
  size: "1024x1024",
  quality: "hd",
  n: 1,
});

console.log(response.data[0].url);`,
    curl: `curl ${BASE_URL}/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "dall-e-3",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "size": "1024x1024",
    "quality": "hd",
    "n": 1
  }'`,
  },
  videoApi: {
    python: `import requests

response = requests.post(
    "${BASE_URL}/videos/generate",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "sora-2",
        "prompt": "A drone flying over misty mountains at sunrise",
        "duration": 10,
        "aspect_ratio": "16:9",
        "resolution": "1080p",
    },
)

result = response.json()
print(result["data"]["url"])`,
    javascript: `const response = await fetch("${BASE_URL}/videos/generate", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "sora-2",
    prompt: "A drone flying over misty mountains at sunrise",
    duration: 10,
    aspect_ratio: "16:9",
    resolution: "1080p",
  }),
});

const result = await response.json();
console.log(result.data.url);`,
    curl: `curl ${BASE_URL}/videos/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "sora-2",
    "prompt": "A drone flying over misty mountains at sunrise",
    "duration": 10,
    "aspect_ratio": "16:9",
    "resolution": "1080p"
  }'`,
  },
  audioApi: {
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}",
    api_key="YOUR_API_KEY",
)

with open("meeting.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        language="en",
        response_format="verbose_json",
        timestamp_granularities=["segment"],
    )

print(transcript.text)
for segment in transcript.segments:
    print(f"[{segment.start:.1f}s] {segment.text}")`,
    javascript: `import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  baseURL: "${BASE_URL}",
  apiKey: "YOUR_API_KEY",
});

const transcript = await client.audio.transcriptions.create({
  model: "whisper-1",
  file: fs.createReadStream("meeting.mp3"),
  language: "en",
  response_format: "verbose_json",
  timestamp_granularities: ["segment"],
});

console.log(transcript.text);
transcript.segments.forEach((s) =>
  console.log(\`[\${s.start.toFixed(1)}s] \${s.text}\`)
);`,
    curl: `curl ${BASE_URL}/audio/transcriptions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F model="whisper-1" \\
  -F file="@meeting.mp3" \\
  -F language="en" \\
  -F response_format="verbose_json"`,
  },
  auth: {
    python: `import os
from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}",
    api_key=os.environ["SUPREMIND_API_KEY"],
)`,
    javascript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${BASE_URL}",
  apiKey: process.env.SUPREMIND_API_KEY,
});`,
    curl: `# Pass your key via the Authorization header
curl ${BASE_URL}/chat/completions \\
  -H "Authorization: Bearer $SUPREMIND_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "model": "gpt-4o", "messages": [{"role":"user","content":"Hi"}] }'`,
  },
  retry: {
    python: `import time
import requests

def call_with_retry(payload, max_retries=5):
    url = "${BASE_URL}/chat/completions"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    }

    for attempt in range(max_retries):
        response = requests.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            return response.json()

        if response.status_code == 429:
            wait = 2 ** attempt  # exponential backoff
            print(f"Rate limited — retrying in {wait}s...")
            time.sleep(wait)
            continue

        response.raise_for_status()

    raise Exception("Max retries exceeded")`,
    javascript: `async function callWithRetry(payload, maxRetries = 5) {
  const url = "${BASE_URL}/chat/completions";
  const headers = {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  };

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) return res.json();

    if (res.status === 429) {
      const wait = 2 ** attempt * 1000;
      console.log(\`Rate limited — retrying in \${wait}ms...\`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    throw new Error(\`API error: \${res.status}\`);
  }

  throw new Error("Max retries exceeded");
}`,
    curl: `# Bash retry loop with exponential backoff
for i in 1 2 3 4 5; do
  response=$(curl -s -w "\\n%{http_code}" \\
    ${BASE_URL}/chat/completions \\
    -H "Authorization: Bearer $SUPREMIND_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hi"}]}')

  status=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')

  if [ "$status" = "200" ]; then
    echo "$body"
    break
  elif [ "$status" = "429" ]; then
    sleep $((2 ** i))
  else
    echo "Error: $status" && exit 1
  fi
done`,
  },
};

const RESPONSES = {
  text: `{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1714502400,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  }
}`,
  textStream: `data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1714502400,"model":"gpt-4o","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1714502400,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1714502400,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1714502400,"model":"gpt-4o","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]`,
  image: `{
  "created": 1714502400,
  "data": [
    {
      "url": "https://api.supremind.ai/files/img-abc123.png",
      "revised_prompt": "A futuristic city at sunset..."
    }
  ]
}`,
  video: `{
  "id": "vid-abc123def456",
  "status": "completed",
  "created": 1714502400,
  "model": "sora-2",
  "data": {
    "url": "https://api.supremind.ai/files/vid-abc123.mp4",
    "duration": 10,
    "resolution": "1080p"
  }
}`,
  audio: `{
  "text": "Good morning everyone. Today we'll discuss the quarterly results...",
  "language": "en",
  "duration": 145.2,
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 3.84,
      "text": "Good morning everyone."
    },
    {
      "id": 1,
      "start": 3.84,
      "end": 8.16,
      "text": "Today we'll discuss the quarterly results..."
    }
  ]
}`,
  error: `{
  "error": {
    "type": "invalid_request_error",
    "message": "The model 'xyz' does not exist.",
    "code": "model_not_found"
  }
}`,
};

/* ═══════════════════════════════════════════
   SHARED UTILITY COMPONENTS
   ═══════════════════════════════════════════ */

const CopyBtn = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-xs transition-colors ${
        copied ? 'text-green-400' : 'text-text-muted hover:text-white'
      } ${className}`}
      title="Copy"
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
    </button>
  );
};

const CodeBlock = ({ code, language, showHeader = true }) => {
  const highlighted = useMemo(
    () => Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language),
    [code, language],
  );

  return (
    <div className="relative rounded-[10px] border border-border-light overflow-hidden bg-[#0a0f1a]">
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border-light">
          <span className="text-xs text-text-muted font-mono uppercase tracking-wider">{language}</span>
          <CopyBtn text={code} />
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
};

const LANG_LABELS = { python: 'Python', javascript: 'JavaScript', curl: 'cURL' };

const CodeTabs = ({ examples }) => {
  const [active, setActive] = useState('python');
  const langs = Object.keys(examples);

  return (
    <div className="rounded-[10px] border border-border-light overflow-hidden bg-[#0a0f1a]">
      <div className="flex items-center gap-0 bg-surface border-b border-border-light">
        {langs.map((lang) => (
          <button
            key={lang}
            onClick={() => setActive(lang)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              active === lang
                ? 'text-primary border-primary bg-primary/5'
                : 'text-text-muted border-transparent hover:text-white'
            }`}
          >
            {LANG_LABELS[lang] || lang}
          </button>
        ))}
        <div className="ml-auto pr-3">
          <CopyBtn text={examples[active]} />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              examples[active],
              Prism.languages[active] || Prism.languages.bash,
              active,
            ),
          }}
        />
      </pre>
    </div>
  );
};

const ParamTable = ({ params, title }) => (
  <div className="overflow-x-auto">
    {title && <h4 className="text-sm font-semibold text-text-secondary mb-3">{title}</h4>}
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border-light">
          <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Parameter</th>
          <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Type</th>
          <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Required</th>
          <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Description</th>
        </tr>
      </thead>
      <tbody>
        {params.map((p) => (
          <tr key={p.name} className="border-b border-border-light/50 hover:bg-surface-light/30">
            <td className="py-3 px-4 font-mono text-primary text-xs">{p.name}</td>
            <td className="py-3 px-4 text-text-secondary font-mono text-xs">{p.type}</td>
            <td className="py-3 px-4">
              {p.required ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 rounded-md">Required</span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-surface-light text-text-muted rounded-md">Optional</span>
              )}
            </td>
            <td className="py-3 px-4 text-text-secondary text-xs leading-relaxed">{p.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EndpointBadge = ({ method = 'POST', path }) => (
  <div className="flex items-center gap-3 bg-surface border border-border-light rounded-[10px] px-4 py-3 mb-6">
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
      method === 'GET' ? 'bg-blue-500/15 text-blue-400' : 'bg-green-500/15 text-green-400'
    }`}>
      {method}
    </span>
    <code className="text-sm font-mono text-white flex-1 overflow-x-auto">{BASE_URL}{path}</code>
    <CopyBtn text={`${BASE_URL}${path}`} />
  </div>
);

const ResponseBlock = ({ json, title = 'Response' }) => (
  <div className="mt-6">
    <h4 className="text-sm font-semibold text-text-secondary mb-3">{title}</h4>
    <CodeBlock code={json} language="json" />
  </div>
);

const AlertBox = ({ type = 'info', children }) => {
  const styles = {
    info: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-300', Icon: FiInfo },
    tip: { border: 'border-primary/30', bg: 'bg-primary/5', text: 'text-primary', Icon: FiZap },
    warning: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', text: 'text-yellow-300', Icon: FiAlertTriangle },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`rounded-[10px] border ${s.border} ${s.bg} px-5 py-4 flex gap-3 my-6`}>
      <s.Icon size={18} className={`${s.text} shrink-0 mt-0.5`} />
      <div className={`text-sm ${s.text} leading-relaxed`}>{children}</div>
    </div>
  );
};

const SectionHeading = ({ id, children }) => (
  <h2 id={id} className="text-2xl font-bold text-white mt-16 mb-6 pt-4 scroll-mt-24 flex items-center gap-3 group">
    <a href={`#${id}`} className="opacity-0 group-hover:opacity-60 transition-opacity text-text-muted">
      <FiHash size={20} />
    </a>
    {children}
  </h2>
);

const SubHeading = ({ id, children }) => (
  <h3 id={id} className="text-lg font-semibold text-white mt-10 mb-4 scroll-mt-24 flex items-center gap-2 group">
    <a href={`#${id}`} className="opacity-0 group-hover:opacity-60 transition-opacity text-text-muted">
      <FiHash size={16} />
    </a>
    {children}
  </h3>
);

const Prose = ({ children }) => (
  <div className="text-text-secondary text-sm leading-relaxed space-y-4">{children}</div>
);

/* ═══════════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════════ */

// ── 1. Getting Started ──
const GettingStartedSection = () => (
  <section>
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Documentation</h1>
      <p className="text-text-secondary text-base leading-relaxed max-w-2xl">
        supremind.ai provides a unified API gateway for 500+ AI models. Use a single API key
        and OpenAI-compatible endpoints to access text, image, video, and audio generation
        models from every major provider.
      </p>
    </div>

    <SectionHeading id="getting-started">Getting Started</SectionHeading>
    <Prose>
      <p>
        Get up and running in under 2 minutes. supremind.ai is fully compatible with the OpenAI SDK —
        if you already use OpenAI, just change your base URL and you are done.
      </p>
    </Prose>

    <div className="grid gap-4 my-8">
      {[
        { num: '1', title: 'Create an account', desc: 'Sign up at supremind.ai — no credit card required for the free tier.' },
        { num: '2', title: 'Generate an API key', desc: 'Go to Dashboard → API Keys and create your first key.' },
        { num: '3', title: 'Install the SDK', desc: 'pip install openai  or  npm install openai' },
        { num: '4', title: 'Set your base URL', desc: `Point the SDK to ${BASE_URL} and start calling any model.` },
      ].map((step) => (
        <div key={step.num} className="flex gap-4 items-start bg-surface border border-border-light rounded-[10px] p-4">
          <span className="w-8 h-8 shrink-0 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
            {step.num}
          </span>
          <div>
            <h4 className="text-sm font-semibold text-white">{step.title}</h4>
            <p className="text-xs text-text-secondary mt-1">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <SubHeading id="quick-start-example">Quick Start Example</SubHeading>
    <CodeTabs examples={CODE.quickStart} />

    <AlertBox type="tip">
      <strong>Already using OpenAI?</strong> Just change your <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">base_url</code> to{' '}
      <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">{BASE_URL}</code> — every other line of code stays the same.
      You can access 500+ models through the exact same SDK methods.
    </AlertBox>
  </section>
);

// ── 2. Authentication ──
const AuthenticationSection = () => (
  <section>
    <SectionHeading id="authentication">Authentication</SectionHeading>
    <Prose>
      <p>
        All API requests require an API key passed via the <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">Authorization</code> header.
        Keys follow the format <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">sk-supremind-...</code> and can be created in
        your <Link to="/dashboard?tab=apikey" className="text-primary hover:underline">Dashboard</Link>.
      </p>
    </Prose>

    <div className="my-6 bg-surface border border-border-light rounded-[10px] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Header</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Value</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Required</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border-light/50">
            <td className="py-3 px-4 font-mono text-primary text-xs">Authorization</td>
            <td className="py-3 px-4 font-mono text-text-secondary text-xs">Bearer YOUR_API_KEY</td>
            <td className="py-3 px-4">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 rounded-md">Required</span>
            </td>
          </tr>
          <tr>
            <td className="py-3 px-4 font-mono text-primary text-xs">Content-Type</td>
            <td className="py-3 px-4 font-mono text-text-secondary text-xs">application/json</td>
            <td className="py-3 px-4">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 rounded-md">Required</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CodeTabs examples={CODE.auth} />

    <AlertBox type="warning">
      <strong>Keep your keys safe.</strong> Never hardcode API keys in source code or commit them to version control.
      Use environment variables (<code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">SUPREMIND_API_KEY</code>)
      and rotate keys immediately if exposed.
    </AlertBox>
  </section>
);

// ── 3. Text Completions API ──
const TextAPISection = () => (
  <section>
    <SectionHeading id="text-api">Text Completions API</SectionHeading>
    <Prose>
      <p>
        Generate text completions using the chat format. Compatible with the OpenAI Chat Completions API —
        supports system messages, multi-turn conversations, function calling, JSON mode, and streaming.
      </p>
      <p className="text-xs text-text-muted">
        <strong>Available models:</strong> GPT-4o, GPT-5, Claude Sonnet 4.6, Gemini 2.5 Pro, DeepSeek V3, Grok-4
      </p>
    </Prose>

    <EndpointBadge method="POST" path="/chat/completions" />

    <SubHeading id="text-params">Request Parameters</SubHeading>
    <ParamTable params={TEXT_API_PARAMS} />

    <SubHeading id="text-messages">Message Format</SubHeading>
    <Prose>
      <p>Each message in the <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">messages</code> array requires these fields:</p>
    </Prose>
    <ParamTable params={MESSAGE_FIELDS} />

    <SubHeading id="text-example">Example Request</SubHeading>
    <CodeTabs examples={CODE.textApi} />
    <ResponseBlock json={RESPONSES.text} title="Response" />

    <SubHeading id="text-streaming">Streaming</SubHeading>
    <Prose>
      <p>
        Set <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">stream: true</code> to receive
        responses as Server-Sent Events (SSE). Each event contains a delta chunk. The stream ends with
        a <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">data: [DONE]</code> message.
      </p>
    </Prose>
    <CodeTabs examples={CODE.streaming} />
    <ResponseBlock json={RESPONSES.textStream} title="Streaming Response Format" />
  </section>
);

// ── 4. Image Generation API ──
const ImageAPISection = () => (
  <section>
    <SectionHeading id="image-api">Image Generation API</SectionHeading>
    <Prose>
      <p>
        Generate images from text prompts. Compatible with the OpenAI Images API.
        Supports multiple sizes, styles, quality tiers, and batch generation.
      </p>
      <p className="text-xs text-text-muted">
        <strong>Available models:</strong> Seedream 5.0 Lite, Seedream 4.5, Nano Banana 2, GPT-4o Image, DALL-E 3
      </p>
    </Prose>

    <EndpointBadge method="POST" path="/images/generations" />

    <SubHeading id="image-params">Request Parameters</SubHeading>
    <ParamTable params={IMAGE_API_PARAMS} />

    <SubHeading id="image-example">Example Request</SubHeading>
    <CodeTabs examples={CODE.imageApi} />
    <ResponseBlock json={RESPONSES.image} title="Response" />

    <AlertBox type="info">
      <strong>Size options by model:</strong> DALL-E 3 supports 1024x1024, 1024x1792, and 1792x1024.
      Seedream models support 512x512 up to 4096x4096. Use the Playground to preview available sizes for each model.
    </AlertBox>
  </section>
);

// ── 5. Video Generation API ──
const VideoAPISection = () => (
  <section>
    <SectionHeading id="video-api">Video Generation API</SectionHeading>
    <Prose>
      <p>
        Generate videos from text prompts or reference images. Supports multiple generation modes,
        camera controls, and quality tiers. Video generation is asynchronous — poll the status URL
        or use webhooks to receive completion notifications.
      </p>
      <p className="text-xs text-text-muted">
        <strong>Available models:</strong> Sora 2, Sora 2 Pro, Veo 3.1, WAN 2.6, Hailuo 02
      </p>
    </Prose>

    <EndpointBadge method="POST" path="/videos/generate" />

    <SubHeading id="video-params">Request Parameters</SubHeading>
    <ParamTable params={VIDEO_API_PARAMS} />

    <SubHeading id="video-example">Example Request</SubHeading>
    <CodeTabs examples={CODE.videoApi} />
    <ResponseBlock json={RESPONSES.video} title="Response" />

    <SubHeading id="video-modes">Generation Modes</SubHeading>
    <div className="grid sm:grid-cols-3 gap-4 my-4">
      {[
        { title: 'Text to Video', desc: 'Generate a video entirely from a text prompt. No image input required.' },
        { title: 'Image to Video', desc: 'Animate a reference image. Pass an image URL or base64 in the image field.' },
        { title: 'Start & End Frame', desc: 'Provide first and last frames — the model generates the motion between them.' },
      ].map((mode) => (
        <div key={mode.title} className="bg-surface border border-border-light rounded-[10px] p-4">
          <h5 className="text-sm font-semibold text-white mb-1">{mode.title}</h5>
          <p className="text-xs text-text-secondary leading-relaxed">{mode.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ── 6. Audio Transcription API ──
const AudioAPISection = () => (
  <section>
    <SectionHeading id="audio-api">Audio Transcription API</SectionHeading>
    <Prose>
      <p>
        Transcribe audio files into text. Supports 99 languages with automatic language detection,
        timestamps, and multiple output formats. Compatible with the OpenAI Audio API.
      </p>
      <p className="text-xs text-text-muted">
        <strong>Available model:</strong> Whisper
      </p>
    </Prose>

    <EndpointBadge method="POST" path="/audio/transcriptions" />

    <AlertBox type="info">
      Audio transcription uses <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">multipart/form-data</code> encoding instead of JSON.
      The file is sent as a form field.
    </AlertBox>

    <SubHeading id="audio-params">Request Parameters</SubHeading>
    <ParamTable params={AUDIO_API_PARAMS} />

    <SubHeading id="audio-example">Example Request</SubHeading>
    <CodeTabs examples={CODE.audioApi} />
    <ResponseBlock json={RESPONSES.audio} title="Response (verbose_json format)" />

    <SubHeading id="audio-formats">Output Formats</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Format</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            { f: 'json', d: 'Default — returns { text: "..." }' },
            { f: 'text', d: 'Plain text transcript only' },
            { f: 'srt', d: 'SubRip subtitle format with timestamps' },
            { f: 'vtt', d: 'WebVTT subtitle format' },
            { f: 'verbose_json', d: 'Full response with segments, timestamps, and language detection' },
          ].map((row) => (
            <tr key={row.f} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4 font-mono text-primary text-xs">{row.f}</td>
              <td className="py-3 px-4 text-text-secondary text-xs">{row.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// ── 7. Models & Pricing ──
const ModelsAndPricingSection = () => (
  <section>
    <SectionHeading id="models-pricing">Models & Pricing</SectionHeading>
    <Prose>
      <p>
        supremind.ai offers 17 models across four categories. Pricing is pay-as-you-go with no minimum commitment.
        Some text models support cached input pricing and reasoning tokens at different rates.
      </p>
    </Prose>

    <SubHeading id="pricing-text">Text Models</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Model</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Provider</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Context</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Input</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Output</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Cached</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Reasoning</th>
          </tr>
        </thead>
        <tbody>
          {TEXT_MODELS.map((m) => (
            <tr key={m.id} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4">
                <Link to={`/api/${m.id}`} className="text-primary hover:underline text-xs font-medium">{m.name}</Link>
              </td>
              <td className="py-3 px-4 text-text-secondary text-xs">{m.provider}</td>
              <td className="py-3 px-4 text-text-secondary text-xs font-mono">{m.context}</td>
              <td className="py-3 px-4 text-white text-xs font-mono">${m.input.toFixed(2)}</td>
              <td className="py-3 px-4 text-white text-xs font-mono">${m.output.toFixed(2)}</td>
              <td className="py-3 px-4 text-xs font-mono">
                {m.cachedInput != null ? (
                  <span className="text-green-400">${m.cachedInput.toFixed(3)}</span>
                ) : m.cacheRead != null ? (
                  <span className="text-green-400">${m.cacheRead.toFixed(2)} read</span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>
              <td className="py-3 px-4 text-xs font-mono">
                {m.reasoning != null ? (
                  <span className="text-violet-400">${m.reasoning.toFixed(2)}</span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11px] text-text-muted mt-2 px-4">All prices per 1M tokens. Cached = cached input rate. Reasoning = reasoning output tokens.</p>
    </div>

    <AlertBox type="info">
      <strong>Anthropic cache pricing:</strong> Claude Sonnet 4.6 uses a separate cache write ($3.75/1M) and cache read ($0.30/1M) model.
      Other providers use a single discounted cached-input rate.
    </AlertBox>

    <SubHeading id="pricing-image">Image Models</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Model</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Provider</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Pricing</th>
          </tr>
        </thead>
        <tbody>
          {IMAGE_MODELS.map((m) => (
            <tr key={m.id} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4">
                <Link to={`/api/${m.id}`} className="text-primary hover:underline text-xs font-medium">{m.name}</Link>
              </td>
              <td className="py-3 px-4 text-text-secondary text-xs">{m.provider}</td>
              <td className="py-3 px-4 text-white text-xs font-mono">{m.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SubHeading id="pricing-video">Video Models</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Model</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Provider</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Pricing</th>
          </tr>
        </thead>
        <tbody>
          {VIDEO_MODELS.map((m) => (
            <tr key={m.id} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4">
                <Link to={`/api/${m.id}`} className="text-primary hover:underline text-xs font-medium">{m.name}</Link>
              </td>
              <td className="py-3 px-4 text-text-secondary text-xs">{m.provider}</td>
              <td className="py-3 px-4 text-white text-xs font-mono">{m.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SubHeading id="pricing-audio">Audio Models</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Model</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Provider</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Pricing</th>
          </tr>
        </thead>
        <tbody>
          {AUDIO_MODELS.map((m) => (
            <tr key={m.id} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4">
                <Link to={`/api/${m.id}`} className="text-primary hover:underline text-xs font-medium">{m.name}</Link>
              </td>
              <td className="py-3 px-4 text-text-secondary text-xs">{m.provider}</td>
              <td className="py-3 px-4 text-white text-xs font-mono">{m.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// ── 8. Error Handling ──
const ErrorHandlingSection = () => (
  <section>
    <SectionHeading id="error-handling">Error Handling</SectionHeading>
    <Prose>
      <p>
        The API uses standard HTTP status codes. Errors return a JSON body with a consistent structure
        including an error type, message, and code.
      </p>
    </Prose>

    <SubHeading id="error-codes">Error Codes</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Type</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          {ERROR_CODES.map((e) => (
            <tr key={e.status} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className={`py-3 px-4 font-mono font-bold text-xs ${e.color}`}>{e.status}</td>
              <td className="py-3 px-4 font-mono text-text-secondary text-xs">{e.type}</td>
              <td className="py-3 px-4 text-text-secondary text-xs leading-relaxed">{e.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SubHeading id="error-format">Error Response Format</SubHeading>
    <ResponseBlock json={RESPONSES.error} title="Error Response Example" />

    <SubHeading id="error-retry">Retry Strategy</SubHeading>
    <Prose>
      <p>
        For <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">429</code> and{' '}
        <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">5xx</code> errors,
        implement exponential backoff: wait 1s, 2s, 4s, 8s, 16s between retries (max 5 attempts).
        Check the <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">Retry-After</code> header
        if present.
      </p>
    </Prose>
    <CodeTabs examples={CODE.retry} />
  </section>
);

// ── 9. Rate Limits ──
const RateLimitsSection = () => (
  <section>
    <SectionHeading id="rate-limits">Rate Limits</SectionHeading>
    <Prose>
      <p>
        Rate limits are applied per API key and vary by your account tier. Limits are enforced
        on both requests per minute (RPM) and tokens per minute (TPM).
      </p>
    </Prose>

    <SubHeading id="rate-tiers">Limits by Tier</SubHeading>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Tier</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">RPM</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">TPM</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Concurrent</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Daily Spend</th>
          </tr>
        </thead>
        <tbody>
          {RATE_LIMIT_TIERS.map((t) => (
            <tr key={t.tier} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4 text-white text-xs font-semibold">{t.tier}</td>
              <td className="py-3 px-4 text-text-secondary text-xs font-mono">{t.rpm}</td>
              <td className="py-3 px-4 text-text-secondary text-xs font-mono">{t.tpm}</td>
              <td className="py-3 px-4 text-text-secondary text-xs font-mono">{t.concurrent}</td>
              <td className="py-3 px-4 text-text-secondary text-xs font-mono">{t.daily}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SubHeading id="rate-headers">Rate Limit Headers</SubHeading>
    <Prose>
      <p>Every response includes rate limit headers so you can track your usage in real time:</p>
    </Prose>
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Header</th>
            <th className="text-left py-3 px-4 text-text-muted font-medium text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            { h: 'X-RateLimit-Limit-Requests', d: 'Max requests allowed per minute' },
            { h: 'X-RateLimit-Remaining-Requests', d: 'Requests remaining in this window' },
            { h: 'X-RateLimit-Limit-Tokens', d: 'Max tokens allowed per minute' },
            { h: 'X-RateLimit-Remaining-Tokens', d: 'Tokens remaining in this window' },
            { h: 'X-RateLimit-Reset', d: 'Seconds until limits reset' },
            { h: 'Retry-After', d: 'Seconds to wait before retrying (on 429 only)' },
          ].map((row) => (
            <tr key={row.h} className="border-b border-border-light/50 hover:bg-surface-light/30">
              <td className="py-3 px-4 font-mono text-primary text-xs">{row.h}</td>
              <td className="py-3 px-4 text-text-secondary text-xs">{row.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <AlertBox type="tip">
      Track the <code className="px-1.5 py-0.5 bg-surface-light rounded text-xs font-mono">X-RateLimit-Remaining-Requests</code> header
      to proactively throttle before hitting 429. This is more efficient than relying on retries.
    </AlertBox>
  </section>
);

// ── 10. SDKs & Libraries ──
const SDKsSection = () => (
  <section>
    <SectionHeading id="sdks">SDKs & Libraries</SectionHeading>
    <Prose>
      <p>
        supremind.ai is fully compatible with the OpenAI SDK. No custom library is required —
        just install the official OpenAI package and point it at our base URL.
      </p>
    </Prose>

    <div className="grid sm:grid-cols-2 gap-4 my-8">
      {[
        {
          lang: 'Python',
          install: 'pip install openai',
          version: 'Requires Python 3.8+',
          icon: '🐍',
        },
        {
          lang: 'JavaScript / TypeScript',
          install: 'npm install openai',
          version: 'Requires Node.js 18+',
          icon: '⚡',
        },
      ].map((sdk) => (
        <div key={sdk.lang} className="bg-surface border border-border-light rounded-[10px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{sdk.icon}</span>
            <div>
              <h4 className="text-sm font-semibold text-white">{sdk.lang}</h4>
              <p className="text-xs text-text-muted">{sdk.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#0a0f1a] rounded-lg px-3 py-2">
            <code className="text-xs font-mono text-green-400 flex-1">{sdk.install}</code>
            <CopyBtn text={sdk.install} />
          </div>
        </div>
      ))}
    </div>

    <SubHeading id="sdks-config">SDK Configuration</SubHeading>
    <Prose>
      <p>
        After installation, configure the client with your API key and the supremind.ai base URL.
        Every method available in the OpenAI SDK works seamlessly — chat completions, image generation,
        audio transcription, and more.
      </p>
    </Prose>
    <CodeTabs examples={CODE.auth} />

    <SubHeading id="sdks-curl">cURL / HTTP</SubHeading>
    <Prose>
      <p>
        No SDK needed for simple use cases — all endpoints accept standard HTTP requests. Use any
        HTTP client or scripting language that supports JSON and HTTPS.
      </p>
    </Prose>

    <AlertBox type="info">
      <strong>Community SDKs:</strong> Since we are OpenAI-compatible, third-party libraries for Go, Ruby, Rust, PHP,
      and other languages that support the OpenAI API also work with supremind.ai — just configure the base URL.
    </AlertBox>
  </section>
);

// ── 11. Dashboard Guide ──
const DashboardGuideSection = () => (
  <section>
    <SectionHeading id="dashboard-guide">Dashboard Guide</SectionHeading>
    <Prose>
      <p>
        The <Link to="/dashboard" className="text-primary hover:underline">Dashboard</Link> is your control
        center for managing API keys, monitoring usage, reviewing call logs, and managing billing.
      </p>
    </Prose>

    <div className="grid gap-4 my-8">
      {[
        {
          icon: FiLayout,
          title: 'Overview',
          desc: 'Real-time statistics — API calls, tokens consumed, cost, and average latency with 7-day trends. Monitor system status and recent errors at a glance.',
        },
        {
          icon: FiKey,
          title: 'API Keys',
          desc: 'Create and manage API keys with fine-grained controls: per-key quotas, IP whitelisting, model restrictions, and monthly budget limits. Rotate or revoke keys instantly.',
        },
        {
          icon: FiCode,
          title: 'Call Logs',
          desc: 'Searchable history of every API call. Filter by model, type, status, date range, and cache usage. Expand any call to see full token breakdown, cost itemization, and request details.',
        },
        {
          icon: FiZap,
          title: 'Analytics',
          desc: 'Usage trends over 24h to 90 days. See top models by call count, type distribution charts, error rate trends, and per-model cost breakdowns.',
        },
        {
          icon: FiDollarSign,
          title: 'Billing',
          desc: 'Add funds, track spending, view cost breakdown by model type (text, image, video, audio). Monitor monthly progress against budget limits.',
        },
      ].map((tab) => (
        <div key={tab.title} className="flex gap-4 items-start bg-surface border border-border-light rounded-[10px] p-5">
          <div className="w-10 h-10 shrink-0 rounded-[10px] bg-primary/10 flex items-center justify-center">
            <tab.icon size={18} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">{tab.title}</h4>
            <p className="text-xs text-text-secondary leading-relaxed">{tab.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <AlertBox type="tip">
      Access the dashboard anytime from the header menu. Direct links:{' '}
      <Link to="/dashboard" className="underline">Console</Link> ·{' '}
      <Link to="/dashboard?tab=apikey" className="underline">API Keys</Link> ·{' '}
      <Link to="/dashboard?tab=billing" className="underline">Billing</Link>
    </AlertBox>

    <div className="mt-12 mb-8 bg-surface border border-border-light rounded-[10px] p-8 text-center">
      <h3 className="text-lg font-bold text-white mb-2">Ready to get started?</h3>
      <p className="text-sm text-text-secondary mb-6">
        Create your free account and start using 500+ AI models in minutes.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/dashboard?tab=apikey" className="btn-primary text-sm inline-flex items-center gap-2">
          Get API Key <FiArrowRight />
        </Link>
        <Link to="/marketplace" className="btn-secondary text-sm inline-flex items-center gap-2">
          Browse Models
        </Link>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════════ */

const Sidebar = ({ activeSection, searchQuery, setSearchQuery, onItemClick }) => {
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return NAV_SECTIONS;
    const q = searchQuery.toLowerCase();
    return NAV_SECTIONS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.keywords.some((kw) => kw.includes(q)),
      ),
    })).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border-light">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Documentation</h2>
        <div className="relative">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-light border border-border-light rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <FiX size={12} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {filteredSections.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:text-white hover:bg-surface-light'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-primary' : 'text-text-muted'} />
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN DOCUMENTATION COMPONENT
   ═══════════════════════════════════════════ */

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isScrollingRef = useRef(false);

  // Hash-based navigation on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        setActiveSection(hash);
      }
    }
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sectionIds = ALL_NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            window.history.replaceState(null, '', `#${entry.target.id}`);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((id) => {
    setMobileNavOpen(false);
    setActiveSection(id);
    isScrollingRef.current = true;

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }

    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-body">
      {/* Mobile nav bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-surface border-b border-border-light px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
        >
          {mobileNavOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          <span className="font-medium">Docs Menu</span>
        </button>
        {activeSection && (
          <span className="text-xs text-text-muted ml-auto">
            {ALL_NAV_ITEMS.find((i) => i.id === activeSection)?.title}
          </span>
        )}
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            style={{ top: '112px' }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className="lg:hidden fixed left-0 z-40 w-72 bg-surface border-r border-border-light overflow-y-auto"
            style={{ top: '112px', height: 'calc(100vh - 112px)' }}
          >
            <Sidebar
              activeSection={activeSection}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onItemClick={handleNavClick}
            />
          </div>
        </>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:block w-64 shrink-0 border-r border-border-light bg-surface sticky overflow-y-auto"
          style={{ top: '64px', height: 'calc(100vh - 64px)' }}
        >
          <Sidebar
            activeSection={activeSection}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onItemClick={handleNavClick}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 lg:px-12 py-8 max-w-4xl">
          <GettingStartedSection />
          <AuthenticationSection />
          <TextAPISection />
          <ImageAPISection />
          <VideoAPISection />
          <AudioAPISection />
          <ModelsAndPricingSection />
          <ErrorHandlingSection />
          <RateLimitsSection />
          <SDKsSection />
          <DashboardGuideSection />
        </main>
      </div>
    </div>
  );
};

export default Documentation;
