export const mockAPIs = [
  // ── Text / Chat Models ──
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Chat', 'Text Generation'],
    type: 'text',
    image: '/images/models/gpt-network.jpg',
    description: 'OpenAI\'s flagship multimodal model with strong performance across text, vision, and audio at an optimized cost.',
    pricing: { input: 2.50, output: 10.00, cachedInput: 1.25, unit: 'per 1M tokens' },
    features: ['128k context window', 'Multimodal (text, vision, audio)', 'Function calling', 'JSON mode'],
    contextWindow: '128k tokens',
    popular: true,
    new: false,
    documentation: 'Complete API reference for GPT-4o with examples and best practices.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`,
      curl: `curl https://api.supremind.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    }
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Chat', 'Text Generation'],
    type: 'text',
    image: '/images/models/milky-way.jpg',
    description: 'OpenAI\'s most advanced model with superior reasoning, 1M token context, and unified multimodal capabilities.',
    pricing: { input: 1.25, output: 10.00, cachedInput: 0.625, reasoning: 10.00, unit: 'per 1M tokens' },
    features: ['1M context window', 'Advanced reasoning', 'Tool use', 'Multimodal'],
    contextWindow: '1M tokens',
    popular: true,
    new: true,
    supportsReasoning: true,
    documentation: 'GPT-5 API documentation with advanced reasoning examples.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
print(response.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Explain quantum computing' }],
});

console.log(response.choices[0].message.content);`,
      curl: `curl https://api.supremind.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5",
    "messages": [{"role": "user", "content": "Explain quantum computing"}]
  }'`
    }
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    providerLogo: 'Anthropic',
    category: ['Chat', 'Text Generation'],
    type: 'text',
    image: '/images/models/butterfly-petals.jpg',
    description: 'Anthropic\'s frontier model delivering top-tier coding, agent, and professional task performance with 1M context.',
    pricing: { input: 3.00, output: 15.00, cacheWrite: 3.75, cacheRead: 0.30, reasoning: 15.00, unit: 'per 1M tokens' },
    features: ['1M context window', 'Extended thinking', 'Top-tier coding', 'Agent workflows'],
    contextWindow: '1M tokens',
    popular: true,
    new: true,
    supportsReasoning: true,
    documentation: 'Claude Sonnet 4.6 documentation with extended thinking examples.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

message = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const message = await client.chat.completions.create({
  model: 'claude-sonnet-4-6',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(message.choices[0].message.content);`,
      curl: `curl https://api.supremind.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    }
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    providerLogo: 'Google',
    category: ['Chat', 'Text Generation'],
    type: 'text',
    image: '/images/models/mountain-sunset.jpg',
    description: 'Google\'s frontier reasoning model with 1M context, strong software engineering and agentic reliability.',
    pricing: { input: 2.50, output: 15.00, cachedInput: 0.625, reasoning: 15.00, unit: 'per 1M tokens' },
    features: ['1M context window', 'Multimodal', 'Code generation', 'Agentic workflows'],
    contextWindow: '1M tokens',
    popular: true,
    new: false,
    supportsReasoning: true,
    documentation: 'Gemini 2.5 Pro API documentation and usage examples.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="gemini-2-5-pro",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'gemini-2-5-pro',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`,
      curl: `curl https://api.supremind.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-2-5-pro",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    }
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    providerLogo: 'DeepSeek',
    category: ['Chat', 'Text Generation'],
    type: 'text',
    image: '/images/models/ai-graphic.jpg',
    description: 'High-performance open model with strong reasoning and coding at an extremely low cost point.',
    pricing: { input: 0.14, output: 0.28, cachedInput: 0.014, reasoning: 0.28, unit: 'per 1M tokens' },
    features: ['128k context window', 'Strong coding', 'Math reasoning', 'Multi-language'],
    contextWindow: '128k tokens',
    popular: true,
    new: false,
    supportsReasoning: true,
    documentation: 'DeepSeek V3 API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'deepseek-v3',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`,
      curl: `curl https://api.supremind.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    }
  },
  {
    id: 'grok-4',
    name: 'Grok-4',
    provider: 'xAI',
    providerLogo: 'xAI',
    category: ['Chat', 'Text Generation'],
    type: 'text',
    image: '/images/models/classical-painting.jpg',
    description: 'xAI\'s flagship model with the lowest hallucination rate, strict prompt adherence, and real-time knowledge.',
    pricing: { input: 3.00, output: 15.00, unit: 'per 1M tokens' },
    features: ['1M context window', 'Low hallucination', 'Real-time knowledge', 'Code generation'],
    contextWindow: '1M tokens',
    popular: false,
    new: true,
    documentation: 'Grok-4 API documentation.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="grok-4",
    messages=[{"role": "user", "content": "What happened today?"}]
)
print(response.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
  model: 'grok-4',
  messages: [{ role: 'user', content: 'What happened today?' }],
});

console.log(response.choices[0].message.content);`,
      curl: `curl https://api.supremind.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "grok-4",
    "messages": [{"role": "user", "content": "What happened today?"}]
  }'`
    }
  },

  // ── Video Generation Models ──
  {
    id: 'sora-2',
    name: 'Sora 2',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Video Generation'],
    type: 'video',
    image: '/images/models/aurora-waterfall.jpg',
    description: 'Advanced text-to-video generation with synchronized audio, enhanced physics simulation, and cinematic controls.',
    pricing: { standard: 0.025, pro: 1.0, unit: 'per generation' },
    features: ['Synchronized audio', 'Physics simulation', 'Cinematic control', 'Image-to-video'],
    popular: true,
    new: false,
    capabilities: [
      { title: 'Synchronized Audio', desc: 'Auto-generate matching audio for videos' },
      { title: 'Advanced Physics', desc: 'Realistic physics simulation in generated scenes' },
      { title: 'Cinematic Control', desc: 'Camera angles, lighting, and scene direction' },
      { title: 'Image-to-Video', desc: 'Animate still images into video sequences' },
    ],
    useCases: ['Social Media', 'Film Production', 'Education', 'Product Demos', 'Content Creation', 'Marketing'],
    documentation: 'Sora 2 video generation API with playground and examples.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.videos.generate(
    model="sora-2",
    prompt="A serene lake at sunset with mountains",
    duration=10,
    aspect_ratio="16:9"
)
print(response.video_url)`,
      javascript: `const response = await fetch('https://api.supremind.ai/v1/videos/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'sora-2',
    prompt: 'A serene lake at sunset with mountains',
    duration: 10,
    aspect_ratio: '16:9',
  }),
});

const data = await response.json();
console.log(data.video_url);`,
      curl: `curl https://api.supremind.ai/v1/videos/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "sora-2",
    "prompt": "A serene lake at sunset with mountains",
    "duration": 10,
    "aspect_ratio": "16:9"
  }'`
    }
  },
  {
    id: 'sora-2-pro',
    name: 'Sora 2 Pro',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Video Generation'],
    type: 'video',
    image: '/images/models/cherry-field.jpg',
    description: 'Professional-grade video generation with 1080p output, up to 25-second videos, and multi-shot continuity.',
    pricing: { standard: 1.0, unit: 'per generation' },
    features: ['1080p resolution', 'Up to 25s', 'Multi-shot continuity', 'Commercial use'],
    popular: true,
    new: true,
    capabilities: [
      { title: '1080p Output', desc: 'Professional resolution for commercial and production use' },
      { title: 'Multi-shot Continuity', desc: 'Maintain consistency across multiple video segments' },
      { title: 'Extended Duration', desc: 'Generate videos up to 25 seconds long' },
      { title: 'Commercial License', desc: 'Full commercial usage rights for generated content' },
    ],
    documentation: 'Sora 2 Pro API reference for professional video workflows.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.videos.generate(
    model="sora-2-pro",
    prompt="Cinematic establishing shot of a futuristic city",
    duration=20,
    aspect_ratio="16:9"
)
print(response.video_url)`,
      javascript: `const response = await fetch('https://api.supremind.ai/v1/videos/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'sora-2-pro',
    prompt: 'Cinematic establishing shot of a futuristic city',
    duration: 20,
    aspect_ratio: '16:9',
  }),
});

const data = await response.json();
console.log(data.video_url);`,
      curl: `curl https://api.supremind.ai/v1/videos/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "sora-2-pro",
    "prompt": "Cinematic establishing shot of a futuristic city",
    "duration": 20,
    "aspect_ratio": "16:9"
  }'`
    }
  },
  {
    id: 'veo-3-1',
    name: 'Veo 3.1',
    provider: 'Google',
    providerLogo: 'Google',
    category: ['Video Generation'],
    type: 'video',
    image: '/images/models/anime-blossom.jpg',
    description: 'Google\'s next-gen video model with high fidelity, temporal consistency, native audio, and 4K output.',
    pricing: { standard: 0.05, unit: 'per second' },
    features: ['Native audio', 'Temporal consistency', 'High fidelity', '4K output'],
    popular: true,
    new: true,
    capabilities: [
      { title: 'Native Audio', desc: 'Generate synchronized audio tracks alongside video' },
      { title: 'Temporal Consistency', desc: 'Smooth, coherent motion across all frames' },
      { title: '4K Output', desc: 'Ultra-high resolution video generation' },
      { title: 'High Fidelity', desc: 'Photorealistic quality with fine detail preservation' },
    ],
    documentation: 'Veo 3.1 video generation API documentation.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.videos.generate(
    model="veo-3-1",
    prompt="A drone shot flying over a tropical island",
    duration=15
)
print(response.video_url)`,
      javascript: `const response = await fetch('https://api.supremind.ai/v1/videos/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'veo-3-1',
    prompt: 'A drone shot flying over a tropical island',
    duration: 15,
  }),
});

const data = await response.json();
console.log(data.video_url);`,
      curl: `curl https://api.supremind.ai/v1/videos/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "veo-3-1",
    "prompt": "A drone shot flying over a tropical island",
    "duration": 15
  }'`
    }
  },
  {
    id: 'wan-2-6',
    name: 'WAN 2.6',
    provider: 'Alibaba',
    providerLogo: 'Alibaba',
    category: ['Video Generation'],
    type: 'video',
    image: '/images/models/sprout-butterfly.jpg',
    description: 'Alibaba\'s open-source video generation model with excellent motion quality and style control.',
    pricing: { standard: 0.02, unit: 'per generation' },
    features: ['Open source', 'Motion quality', 'Style control', 'Fast generation'],
    popular: false,
    new: false,
    documentation: 'WAN 2.6 video API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.videos.generate(
    model="wan-2-6",
    prompt="A cat playing with a ball of yarn",
    duration=8
)
print(response.video_url)`,
      javascript: `const response = await fetch('https://api.supremind.ai/v1/videos/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'wan-2-6',
    prompt: 'A cat playing with a ball of yarn',
    duration: 8,
  }),
});

const data = await response.json();
console.log(data.video_url);`,
      curl: `curl https://api.supremind.ai/v1/videos/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "wan-2-6",
    "prompt": "A cat playing with a ball of yarn",
    "duration": 8
  }'`
    }
  },
  {
    id: 'hailuo-02',
    name: 'MiniMax Hailuo 02',
    provider: 'MiniMax',
    providerLogo: 'MiniMax',
    category: ['Video Generation'],
    type: 'video',
    image: '/images/models/galaxy-bubbles.jpg',
    description: 'Fast and affordable video generation with natural motion and expressive character animation.',
    pricing: { standard: 0.03, unit: 'per generation' },
    features: ['Character animation', 'Natural motion', 'Fast generation', 'Expressive faces'],
    popular: false,
    new: false,
    documentation: 'MiniMax Hailuo 02 API documentation.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.videos.generate(
    model="hailuo-02",
    prompt="A person walking through a garden",
    duration=10
)
print(response.video_url)`,
      javascript: `const response = await fetch('https://api.supremind.ai/v1/videos/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'hailuo-02',
    prompt: 'A person walking through a garden',
    duration: 10,
  }),
});

const data = await response.json();
console.log(data.video_url);`,
      curl: `curl https://api.supremind.ai/v1/videos/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "hailuo-02",
    "prompt": "A person walking through a garden",
    "duration": 10
  }'`
    }
  },

  // ── Image Generation Models ──
  {
    id: 'seedream-5-lite',
    name: 'Seedream 5.0 Lite',
    provider: 'ByteDance',
    providerLogo: 'ByteDance',
    category: ['Image Generation'],
    type: 'image',
    image: '/images/models/holo-forest.jpg',
    description: 'ByteDance\'s latest image generation model with photorealistic quality and text rendering.',
    pricing: { standard: 0.028, unit: 'per image' },
    features: ['Photorealistic', 'Text rendering', 'Style control', 'High resolution'],
    popular: true,
    new: true,
    documentation: 'Seedream 5.0 Lite API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.images.generate(
    model="seedream-5-lite",
    prompt="A cozy coffee shop interior, warm lighting",
    size="1024x1024"
)
print(response.data[0].url)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.images.generate({
  model: 'seedream-5-lite',
  prompt: 'A cozy coffee shop interior, warm lighting',
  size: '1024x1024',
});

console.log(response.data[0].url);`,
      curl: `curl https://api.supremind.ai/v1/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "seedream-5-lite",
    "prompt": "A cozy coffee shop interior, warm lighting",
    "size": "1024x1024"
  }'`
    }
  },
  {
    id: 'seedream-4-5',
    name: 'Seedream 4.5',
    provider: 'ByteDance',
    providerLogo: 'ByteDance',
    category: ['Image Generation'],
    type: 'image',
    image: '/images/models/cherry-field.jpg',
    description: 'Versatile image generation with excellent prompt adherence and artistic styles.',
    pricing: { standard: 0.02, unit: 'per image' },
    features: ['Prompt adherence', 'Artistic styles', 'Fast generation', 'Batch support'],
    popular: true,
    new: false,
    documentation: 'Seedream 4.5 API documentation.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.images.generate(
    model="seedream-4-5",
    prompt="Mountain landscape at golden hour",
    size="1024x1024"
)
print(response.data[0].url)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.images.generate({
  model: 'seedream-4-5',
  prompt: 'Mountain landscape at golden hour',
  size: '1024x1024',
});

console.log(response.data[0].url);`,
      curl: `curl https://api.supremind.ai/v1/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "seedream-4-5",
    "prompt": "Mountain landscape at golden hour",
    "size": "1024x1024"
  }'`
    }
  },
  {
    id: 'nano-banana-2',
    name: 'Nano Banana 2',
    provider: 'ByteDance',
    providerLogo: 'ByteDance',
    category: ['Image Generation'],
    type: 'image',
    image: '/images/models/anime-blossom.jpg',
    description: 'Ultra-fast image generation optimized for speed without sacrificing quality.',
    pricing: { standard: 0.015, unit: 'per image' },
    features: ['Ultra-fast', 'High quality', 'Style variety', 'Inpainting'],
    popular: false,
    new: true,
    documentation: 'Nano Banana 2 API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.images.generate(
    model="nano-banana-2",
    prompt="Cyberpunk city street at night",
    size="1024x1024"
)
print(response.data[0].url)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.images.generate({
  model: 'nano-banana-2',
  prompt: 'Cyberpunk city street at night',
  size: '1024x1024',
});

console.log(response.data[0].url);`,
      curl: `curl https://api.supremind.ai/v1/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nano-banana-2",
    "prompt": "Cyberpunk city street at night",
    "size": "1024x1024"
  }'`
    }
  },
  {
    id: 'gpt-4o-image',
    name: 'GPT-4o Image',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Image Generation'],
    type: 'image',
    image: '/images/models/gpt-network.jpg',
    description: 'GPT-4o native image generation with exceptional understanding of complex prompts and text rendering.',
    pricing: { standard: 0.04, unit: 'per image' },
    features: ['Complex prompts', 'Text in images', 'Consistent characters', 'Style transfer'],
    popular: true,
    new: true,
    documentation: 'GPT-4o Image generation API.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.images.generate(
    model="gpt-4o-image",
    prompt="A studio ghibli style illustration of a cottage",
    size="1024x1024"
)
print(response.data[0].url)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.images.generate({
  model: 'gpt-4o-image',
  prompt: 'A studio ghibli style illustration of a cottage',
  size: '1024x1024',
});

console.log(response.data[0].url);`,
      curl: `curl https://api.supremind.ai/v1/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-image",
    "prompt": "A studio ghibli style illustration of a cottage",
    "size": "1024x1024"
  }'`
    }
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Image Generation'],
    type: 'image',
    image: '/images/models/milky-way.jpg',
    description: 'Reliable image generation with excellent prompt understanding, multiple resolutions, and HD mode.',
    pricing: { standard: 0.04, hd: 0.08, unit: 'per image' },
    features: ['Multiple resolutions (1024, 1792x1024, 1024x1792)', 'Natural language prompts', 'Style control', 'HD quality mode'],
    popular: true,
    new: false,
    documentation: 'DALL-E 3 image generation API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.images.generate(
    model="dall-e-3",
    prompt="A serene landscape with mountains",
    size="1024x1024",
    quality="standard",
    n=1,
)
print(response.data[0].url)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const response = await client.images.generate({
  model: "dall-e-3",
  prompt: "A serene landscape with mountains",
  size: "1024x1024",
  quality: "standard",
  n: 1,
});

console.log(response.data[0].url);`,
      curl: `curl https://api.supremind.ai/v1/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "dall-e-3",
    "prompt": "A serene landscape with mountains",
    "size": "1024x1024"
  }'`
    }
  },

  // ── Audio Models ──
  {
    id: 'whisper-1',
    name: 'Whisper',
    provider: 'OpenAI',
    providerLogo: 'OpenAI',
    category: ['Audio', 'Speech-to-Text'],
    type: 'audio',
    image: '/images/models/mountain-sunset.jpg',
    description: 'Robust speech recognition model supporting multiple languages and transcription tasks.',
    pricing: { rate: 0.006, unit: 'per minute' },
    features: ['99 languages', 'High accuracy', 'Noise robust', 'Timestamps'],
    popular: true,
    new: false,
    documentation: 'Whisper audio transcription API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(
    base_url="https://api.supremind.ai/v1",
    api_key="YOUR_API_KEY"
)

with open("audio.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )
print(transcript.text)`,
      javascript: `import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
  baseURL: 'https://api.supremind.ai/v1',
  apiKey: 'YOUR_API_KEY',
});

const transcript = await client.audio.transcriptions.create({
  file: fs.createReadStream("audio.mp3"),
  model: "whisper-1",
});

console.log(transcript.text);`,
      curl: `curl https://api.supremind.ai/v1/audio/transcriptions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F file="@audio.mp3" \\
  -F model="whisper-1"`
    }
  },
];

export const getAPIById = (id) => mockAPIs.find(api => api.id === id);
export const getAPIsByType = (type) =>
  mockAPIs.filter(api => api.type === type);
export const searchAPIs = (query) =>
  mockAPIs.filter(api =>
    api.name.toLowerCase().includes(query.toLowerCase()) ||
    api.description.toLowerCase().includes(query.toLowerCase()) ||
    api.provider.toLowerCase().includes(query.toLowerCase())
  );
