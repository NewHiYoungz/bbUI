export const mockAPIs = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    category: ['Chat', 'Text Generation'],
    description: 'Most capable GPT model for complex tasks requiring advanced reasoning and creativity.',
    pricing: {
      input: 0.03,
      output: 0.06,
      unit: 'per 1k tokens'
    },
    features: ['128k context window', 'Function calling', 'JSON mode', 'Vision capabilities'],
    contextWindow: '128k tokens',
    popular: true,
    new: false,
    documentation: 'Complete API reference for GPT-4 with examples and best practices.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
  model="gpt-4",
  messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`,
      curl: `curl https://api.apimart.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    }
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    category: ['Chat', 'Text Generation'],
    description: 'Anthropic\'s most intelligent model, balancing performance and speed for complex tasks.',
    pricing: {
      input: 0.015,
      output: 0.075,
      unit: 'per 1k tokens'
    },
    features: ['200k context window', 'Extended thinking', 'Vision', 'Tool use'],
    contextWindow: '200k tokens',
    popular: true,
    new: true,
    documentation: 'Claude Sonnet 4 documentation with extended thinking examples.',
    codeExamples: {
      python: `import anthropic

client = anthropic.Anthropic(api_key="YOUR_API_KEY")

message = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content[0].text)`,
      javascript: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await client.messages.create({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(message.content[0].text);`,
      curl: `curl https://api.apimart.ai/v1/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    category: ['Chat', 'Text Generation'],
    description: 'Google\'s most capable AI model for text, code, and multimodal tasks.',
    pricing: {
      input: 0.0125,
      output: 0.05,
      unit: 'per 1k tokens'
    },
    features: ['1M context window', 'Multimodal', 'Code generation', 'Fast responses'],
    contextWindow: '1M tokens',
    popular: true,
    new: false,
    documentation: 'Gemini Pro API documentation and usage examples.',
    codeExamples: {
      python: `import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-pro')

response = model.generate_content("Hello!")
print(response.text)`,
      javascript: `import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent("Hello!");
console.log(result.response.text());`,
      curl: `curl https://api.apimart.ai/v1/models/gemini-pro:generateContent \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"contents": [{"parts": [{"text": "Hello!"}]}]}'`
    }
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    category: ['Image Generation'],
    description: 'State-of-the-art image generation model with exceptional prompt understanding.',
    pricing: {
      standard: 0.04,
      hd: 0.08,
      unit: 'per image'
    },
    features: ['1024x1024 resolution', 'Natural language prompts', 'Style control', 'High quality'],
    popular: true,
    new: false,
    documentation: 'DALL-E 3 image generation API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(api_key="YOUR_API_KEY")

response = client.images.generate(
  model="dall-e-3",
  prompt="A serene landscape with mountains",
  size="1024x1024",
  quality="standard",
  n=1,
)
print(response.data[0].url)`,
      javascript: `import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.images.generate({
  model: "dall-e-3",
  prompt: "A serene landscape with mountains",
  size: "1024x1024",
  quality: "standard",
  n: 1,
});

console.log(response.data[0].url);`,
      curl: `curl https://api.apimart.ai/v1/images/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "dall-e-3",
    "prompt": "A serene landscape with mountains",
    "size": "1024x1024"
  }'`
    }
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    category: ['Image Generation'],
    description: 'Open-source image generation model with high-quality outputs and fine-tuning support.',
    pricing: {
      standard: 0.02,
      unit: 'per image'
    },
    features: ['1024x1024 resolution', 'Custom fine-tuning', 'Multiple styles', 'Fast generation'],
    popular: false,
    new: false,
    documentation: 'Stable Diffusion XL API documentation.',
    codeExamples: {
      python: `import requests

response = requests.post(
    "https://api.apimart.ai/v1/generate",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "model": "stable-diffusion-xl",
        "prompt": "A futuristic city at sunset",
        "width": 1024,
        "height": 1024
    }
)
print(response.json()["image_url"])`,
      javascript: `const response = await fetch('https://api.apimart.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'stable-diffusion-xl',
    prompt: 'A futuristic city at sunset',
    width: 1024,
    height: 1024,
  }),
});

const data = await response.json();
console.log(data.image_url);`,
      curl: `curl https://api.apimart.ai/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "stable-diffusion-xl",
    "prompt": "A futuristic city at sunset",
    "width": 1024,
    "height": 1024
  }'`
    }
  },
  {
    id: 'whisper',
    name: 'Whisper',
    provider: 'OpenAI',
    category: ['Audio', 'Speech-to-Text'],
    description: 'Robust speech recognition model supporting multiple languages and transcription tasks.',
    pricing: {
      rate: 0.006,
      unit: 'per minute'
    },
    features: ['99 languages', 'High accuracy', 'Noise robust', 'Timestamps'],
    popular: true,
    new: false,
    documentation: 'Whisper audio transcription API reference.',
    codeExamples: {
      python: `from openai import OpenAI
client = OpenAI(api_key="YOUR_API_KEY")

with open("audio.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )
print(transcript.text)`,
      javascript: `import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const transcript = await client.audio.transcriptions.create({
  file: fs.createReadStream("audio.mp3"),
  model: "whisper-1",
});

console.log(transcript.text);`,
      curl: `curl https://api.apimart.ai/v1/audio/transcriptions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F file="@audio.mp3" \\
  -F model="whisper-1"`
    }
  },
];

export const getAPIById = (id) => mockAPIs.find(api => api.id === id);

export const getPopularAPIs = () => mockAPIs.filter(api => api.popular);

export const getNewAPIs = () => mockAPIs.filter(api => api.new);

export const getAPIsByCategory = (category) =>
  mockAPIs.filter(api => api.category.includes(category));

export const searchAPIs = (query) =>
  mockAPIs.filter(api =>
    api.name.toLowerCase().includes(query.toLowerCase()) ||
    api.description.toLowerCase().includes(query.toLowerCase()) ||
    api.provider.toLowerCase().includes(query.toLowerCase())
  );
