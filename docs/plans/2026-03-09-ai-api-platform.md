# AI API Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-quality AI API marketplace website (APIMart.ai clone) with React + Tailwind, featuring 7 pages, full interactivity, and component-driven architecture.

**Architecture:** Component-driven development with atomic design pattern. Mock data managed through React Context. All styling via Tailwind with custom design system. No backend - pure frontend showcase.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS, Recharts, Prism.js, React Icons

---

## Phase 1: Project Setup & Foundation

### Task 1: Initialize Vite React Project

**Files:**
- Create: Project structure via Vite CLI

**Step 1: Create Vite React project**

```bash
npm create vite@latest . -- --template react
```

Expected: Vite scaffolds React project in current directory

**Step 2: Install dependencies**

```bash
npm install
```

Expected: Dependencies installed successfully

**Step 3: Test dev server**

```bash
npm run dev
```

Expected: Dev server starts on http://localhost:5173

**Step 4: Stop dev server and commit**

```bash
git add .
git commit -m "chore: initialize Vite React project"
```

---

### Task 2: Install and Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Install Tailwind and dependencies**

```bash
npm install -D tailwindcss postcss autoprefixer
```

Expected: Packages installed

**Step 2: Initialize Tailwind config**

```bash
npx tailwindcss init -p
```

Expected: Creates tailwind.config.js and postcss.config.js

**Step 3: Configure Tailwind with custom colors**

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        accent: '#FF8C69',
        'text-dark': '#2D3436',
        'text-secondary': '#B2BEC3',
        'border-light': '#DFE6E9',
      },
      borderRadius: {
        'custom': '10px',
      },
    },
  },
  plugins: [],
}
```

**Step 4: Add Tailwind directives to CSS**

Edit `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-text-dark bg-white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

**Step 5: Test Tailwind**

Edit `src/App.jsx`:

```jsx
function App() {
  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-primary p-8">
        AI API Platform
      </h1>
      <button className="bg-primary text-white px-6 py-3 rounded-custom ml-8 hover:opacity-90">
        Test Button
      </button>
    </div>
  )
}

export default App
```

**Step 6: Run dev server and verify**

```bash
npm run dev
```

Expected: See purple heading and button with custom styling

**Step 7: Commit**

```bash
git add .
git commit -m "feat: configure Tailwind CSS with custom design system"
```

---

### Task 3: Install Additional Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install React Router**

```bash
npm install react-router-dom
```

**Step 2: Install UI libraries**

```bash
npm install recharts react-icons prismjs copy-to-clipboard
```

**Step 3: Verify installation**

```bash
npm list react-router-dom recharts react-icons prismjs copy-to-clipboard
```

Expected: All packages listed

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install dependencies (router, charts, icons, code highlighting)"
```

---

### Task 4: Create Project Directory Structure

**Files:**
- Create: Directory structure

**Step 1: Create directories**

```bash
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/components/organisms
mkdir -p src/components/layout
mkdir -p src/pages
mkdir -p src/context
mkdir -p src/data
mkdir -p src/utils
```

**Step 2: Verify structure**

```bash
tree src -L 2 -d
```

Expected: Directory tree matches plan

**Step 3: Commit**

```bash
git add src/
git commit -m "chore: create project directory structure"
```

---

## Phase 2: Atomic Components

### Task 5: Create Button Component

**Files:**
- Create: `src/components/atoms/Button.jsx`

**Step 1: Write Button component**

```jsx
import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded-custom font-medium transition-all duration-200 active:scale-95';

  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
    accent: 'bg-accent text-white hover:opacity-90',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? disabledClasses : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

**Step 2: Create barrel export**

Create `src/components/atoms/index.js`:

```javascript
export { default as Button } from './Button';
```

**Step 3: Test in App.jsx**

Edit `src/App.jsx`:

```jsx
import { Button } from './components/atoms';

function App() {
  return (
    <div className="min-h-screen bg-white p-8 space-y-4">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Component Testing
      </h1>
      <div className="space-x-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="accent">Accent Button</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </div>
  );
}

export default App;
```

**Step 4: Run dev server and verify**

```bash
npm run dev
```

Expected: See all button variants rendering correctly

**Step 5: Commit**

```bash
git add src/components/atoms/Button.jsx src/components/atoms/index.js src/App.jsx
git commit -m "feat: add Button atomic component with variants"
```

---

### Task 6: Create Input Component

**Files:**
- Create: `src/components/atoms/Input.jsx`
- Modify: `src/components/atoms/index.js`

**Step 1: Write Input component**

Create `src/components/atoms/Input.jsx`:

```jsx
import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 rounded-custom border-2 border-text-secondary focus:border-primary focus:outline-none transition-colors duration-200';

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${icon ? 'pl-12' : ''} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
```

**Step 2: Update barrel export**

Edit `src/components/atoms/index.js`:

```javascript
export { default as Button } from './Button';
export { default as Input } from './Input';
```

**Step 3: Test in App.jsx**

```jsx
import { Button, Input } from './components/atoms';
import { FiSearch } from 'react-icons/fi';

function App() {
  return (
    <div className="min-h-screen bg-white p-8 space-y-4">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Component Testing
      </h1>

      <div className="max-w-md space-y-4">
        <Input placeholder="Enter text..." />
        <Input placeholder="Search..." icon={<FiSearch size={20} />} />
      </div>

      <div className="space-x-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="accent">Accent Button</Button>
      </div>
    </div>
  );
}

export default App;
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: Input fields render with proper styling and focus states

**Step 5: Commit**

```bash
git add src/components/atoms/Input.jsx src/components/atoms/index.js src/App.jsx
git commit -m "feat: add Input atomic component with icon support"
```

---

### Task 7: Create Badge Component

**Files:**
- Create: `src/components/atoms/Badge.jsx`
- Modify: `src/components/atoms/index.js`

**Step 1: Write Badge component**

Create `src/components/atoms/Badge.jsx`:

```jsx
import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-block px-3 py-1 rounded-full text-sm font-medium';

  const variants = {
    default: 'bg-gray-100 text-text-dark',
    primary: 'bg-primary bg-opacity-10 text-primary',
    accent: 'bg-accent bg-opacity-10 text-accent',
    success: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
```

**Step 2: Update barrel export**

Edit `src/components/atoms/index.js`:

```javascript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
```

**Step 3: Test in App.jsx**

```jsx
import { Button, Input, Badge } from './components/atoms';
import { FiSearch } from 'react-icons/fi';

function App() {
  return (
    <div className="min-h-screen bg-white p-8 space-y-4">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Component Testing
      </h1>

      <div className="space-x-2">
        <Badge>Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
      </div>

      <div className="max-w-md space-y-4">
        <Input placeholder="Enter text..." />
        <Input placeholder="Search..." icon={<FiSearch size={20} />} />
      </div>

      <div className="space-x-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>
    </div>
  );
}

export default App;
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: Badges render with correct colors

**Step 5: Commit**

```bash
git add src/components/atoms/Badge.jsx src/components/atoms/index.js src/App.jsx
git commit -m "feat: add Badge atomic component"
```

---

### Task 8: Create Card Component

**Files:**
- Create: `src/components/atoms/Card.jsx`
- Modify: `src/components/atoms/index.js`

**Step 1: Write Card component**

Create `src/components/atoms/Card.jsx`:

```jsx
import React from 'react';

const Card = ({ children, className = '', hover = false, onClick }) => {
  const baseClasses = 'bg-white border-2 border-border-light rounded-custom p-6';
  const hoverClasses = hover ? 'hover:border-primary transition-colors duration-200 cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
```

**Step 2: Update barrel export**

Edit `src/components/atoms/index.js`:

```javascript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
export { default as Card } from './Card';
```

**Step 3: Test in App.jsx**

```jsx
import { Button, Input, Badge, Card } from './components/atoms';
import { FiSearch } from 'react-icons/fi';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Component Testing
      </h1>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <Card>
          <h3 className="font-bold mb-2">Regular Card</h3>
          <p className="text-text-secondary">This is a basic card</p>
        </Card>

        <Card hover>
          <h3 className="font-bold mb-2">Hover Card</h3>
          <p className="text-text-secondary">Hover to see border change</p>
        </Card>
      </div>
    </div>
  );
}

export default App;
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: Cards render, hover effect works on second card

**Step 5: Commit**

```bash
git add src/components/atoms/Card.jsx src/components/atoms/index.js src/App.jsx
git commit -m "feat: add Card atomic component with hover variant"
```

---

## Phase 3: Mock Data & Context

### Task 9: Create Mock APIs Data

**Files:**
- Create: `src/data/mockAPIs.js`

**Step 1: Write mock APIs data**

Create `src/data/mockAPIs.js`:

```javascript
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
```

**Step 2: Verify data structure**

Create temporary test file `src/test-data.js`:

```javascript
import { mockAPIs, getPopularAPIs, getAPIById } from './data/mockAPIs';

console.log('Total APIs:', mockAPIs.length);
console.log('Popular APIs:', getPopularAPIs().length);
console.log('GPT-4:', getAPIById('gpt-4')?.name);
```

**Step 3: Test with Node**

```bash
node src/test-data.js
```

Expected: Logs showing correct data

**Step 4: Remove test file**

```bash
rm src/test-data.js
```

**Step 5: Commit**

```bash
git add src/data/mockAPIs.js
git commit -m "feat: add mock API data with 6 sample models"
```

---

### Task 10: Create Mock User Data

**Files:**
- Create: `src/data/mockUser.js`

**Step 1: Write mock user data**

Create `src/data/mockUser.js`:

```javascript
// Generate mock usage history for the last 30 days
const generateUsageHistory = () => {
  const history = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    history.push({
      date: date.toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 1000) + 200,
      tokens: Math.floor(Math.random() * 100000) + 20000,
      cost: (Math.random() * 20 + 3).toFixed(2),
    });
  }

  return history;
};

// Generate recent API calls
const generateRecentCalls = () => {
  const models = ['gpt-4', 'claude-sonnet-4', 'gemini-pro', 'dall-e-3'];
  const statuses = [200, 200, 200, 200, 429, 500]; // Mostly success
  const calls = [];

  for (let i = 0; i < 20; i++) {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - i);

    calls.push({
      id: `call_${Date.now()}_${i}`,
      timestamp: timestamp.toISOString(),
      model: models[Math.floor(Math.random() * models.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      latency: Math.floor(Math.random() * 1000) + 100,
      tokens: Math.floor(Math.random() * 500) + 50,
      cost: (Math.random() * 0.5 + 0.01).toFixed(4),
    });
  }

  return calls;
};

export const mockUser = {
  id: 'user_123',
  email: 'demo@apimart.ai',
  name: 'Demo User',
  apiKey: 'sk-apimart-demo-abc123xyz789',
  plan: 'Pro',
  joined: '2025-12-15',
  usage: {
    currentMonth: {
      calls: 15420,
      tokens: 2300000,
      cost: 127.50,
      limit: 1000000000, // 1B tokens
    },
    history: generateUsageHistory(),
  },
  recentCalls: generateRecentCalls(),
};

export const getUsageByDateRange = (days = 30) => {
  return mockUser.usage.history.slice(-days);
};

export const getRecentCalls = (limit = 10) => {
  return mockUser.recentCalls.slice(0, limit);
};
```

**Step 2: Commit**

```bash
git add src/data/mockUser.js
git commit -m "feat: add mock user data with usage history and API calls"
```

---

### Task 11: Create API Context

**Files:**
- Create: `src/context/APIContext.jsx`

**Step 1: Write API Context**

Create `src/context/APIContext.jsx`:

```jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { mockAPIs, getAPIById, searchAPIs, getAPIsByCategory } from '../data/mockAPIs';

const APIContext = createContext();

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within APIProvider');
  }
  return context;
};

export const APIProvider = ({ children }) => {
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [providerFilter, setProviderFilter] = useState([]);
  const [sortBy, setSortBy] = useState('popular'); // popular, newest, price-low, price-high

  // Get filtered and sorted APIs
  const filteredAPIs = useMemo(() => {
    let apis = [...mockAPIs];

    // Apply search
    if (searchQuery) {
      apis = searchAPIs(searchQuery);
    }

    // Apply category filter
    if (categoryFilter.length > 0) {
      apis = apis.filter(api =>
        categoryFilter.some(cat => api.category.includes(cat))
      );
    }

    // Apply provider filter
    if (providerFilter.length > 0) {
      apis = apis.filter(api => providerFilter.includes(api.provider));
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        apis.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'newest':
        apis.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'price-low':
        apis.sort((a, b) => {
          const priceA = a.pricing.input || a.pricing.standard || a.pricing.rate || 0;
          const priceB = b.pricing.input || b.pricing.standard || b.pricing.rate || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        apis.sort((a, b) => {
          const priceA = a.pricing.input || a.pricing.standard || a.pricing.rate || 0;
          const priceB = b.pricing.input || b.pricing.standard || b.pricing.rate || 0;
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    return apis;
  }, [searchQuery, categoryFilter, providerFilter, sortBy]);

  const value = {
    apis: mockAPIs,
    filteredAPIs,
    selectedAPI,
    searchQuery,
    categoryFilter,
    providerFilter,
    sortBy,
    setSelectedAPI,
    setSearchQuery,
    setCategoryFilter,
    setProviderFilter,
    setSortBy,
    getAPIById: (id) => getAPIById(id),
    clearFilters: () => {
      setSearchQuery('');
      setCategoryFilter([]);
      setProviderFilter([]);
    },
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};
```

**Step 2: Commit**

```bash
git add src/context/APIContext.jsx
git commit -m "feat: add API Context with search and filter logic"
```

---

### Task 12: Create Auth Context

**Files:**
- Create: `src/context/AuthContext.jsx`

**Step 1: Write Auth Context**

Create `src/context/AuthContext.jsx`:

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockUser';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('apimart_auth');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      setUser(mockUser);
    }
  }, []);

  const login = (email, password) => {
    // Mock login - accept any credentials
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem('apimart_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('apimart_auth');
  };

  const generateNewAPIKey = () => {
    const newKey = `sk-apimart-${Math.random().toString(36).substring(2, 15)}`;
    setUser({ ...user, apiKey: newKey });
    return newKey;
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    generateNewAPIKey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Step 2: Create context barrel export**

Create `src/context/index.js`:

```javascript
export { APIProvider, useAPI } from './APIContext';
export { AuthProvider, useAuth } from './AuthContext';
```

**Step 3: Commit**

```bash
git add src/context/AuthContext.jsx src/context/index.js
git commit -m "feat: add Auth Context with mock login/logout"
```

---

## Phase 4: Molecular Components

### Task 13: Create APICard Component

**Files:**
- Create: `src/components/molecules/APICard.jsx`

**Step 1: Write APICard component**

Create `src/components/molecules/APICard.jsx`:

```jsx
import React from 'react';
import { Card, Badge } from '../atoms';
import { useNavigate } from 'react-router-dom';

const APICard = ({ api }) => {
  const navigate = useNavigate();

  const getPriceDisplay = () => {
    const { pricing } = api;
    if (pricing.input) {
      return `$${pricing.input}/${pricing.unit}`;
    }
    if (pricing.standard) {
      return `$${pricing.standard}/${pricing.unit}`;
    }
    if (pricing.rate) {
      return `$${pricing.rate}/${pricing.unit}`;
    }
    return 'Contact us';
  };

  return (
    <Card hover onClick={() => navigate(`/api/${api.id}`)} className="h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-text-dark">{api.name}</h3>
        <div className="flex gap-2">
          {api.popular && <Badge variant="accent">Popular</Badge>}
          {api.new && <Badge variant="primary">New</Badge>}
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-2">{api.provider}</p>

      <p className="text-sm text-text-dark mb-4 line-clamp-2">
        {api.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {api.category.map((cat, idx) => (
          <Badge key={idx} variant="default">{cat}</Badge>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border-light">
        <span className="text-sm text-text-secondary">Starting at</span>
        <span className="text-lg font-bold text-primary">{getPriceDisplay()}</span>
      </div>
    </Card>
  );
};

export default APICard;
```

**Step 2: Create barrel export**

Create `src/components/molecules/index.js`:

```javascript
export { default as APICard } from './APICard';
```

**Step 3: Temporarily test in App.jsx**

Edit `src/App.jsx`:

```jsx
import { APIProvider } from './context';
import { APICard } from './components/molecules';
import { mockAPIs } from './data/mockAPIs';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <APIProvider>
        <div className="min-h-screen bg-gray-50 p-8">
          <h1 className="text-4xl font-bold text-primary mb-8">
            API Cards Test
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAPIs.slice(0, 3).map(api => (
              <APICard key={api.id} api={api} />
            ))}
          </div>
        </div>
      </APIProvider>
    </BrowserRouter>
  );
}

export default App;
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: See 3 API cards with proper styling (note: navigation won't work yet)

**Step 5: Commit**

```bash
git add src/components/molecules/APICard.jsx src/components/molecules/index.js src/App.jsx
git commit -m "feat: add APICard molecular component"
```

---

### Task 14: Create CodeSnippet Component

**Files:**
- Create: `src/components/molecules/CodeSnippet.jsx`
- Modify: `src/components/molecules/index.js`

**Step 1: Write CodeSnippet component**

Create `src/components/molecules/CodeSnippet.jsx`:

```jsx
import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import copy from 'copy-to-clipboard';

const CodeSnippet = ({ code, language = 'javascript', showLineNumbers = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.javascript,
    language
  );

  return (
    <div className="relative group">
      <div className="bg-gray-900 rounded-custom overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
          <span className="text-sm text-gray-400 font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-700"
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
          </button>
        </div>
        <pre className={`p-4 overflow-x-auto ${showLineNumbers ? 'line-numbers' : ''}`}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
```

**Step 2: Update barrel export**

Edit `src/components/molecules/index.js`:

```javascript
export { default as APICard } from './APICard';
export { default as CodeSnippet } from './CodeSnippet';
```

**Step 3: Test in App.jsx**

```jsx
import { CodeSnippet } from './components/molecules';

function App() {
  const sampleCode = `const greet = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greet('World'));`;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Code Snippet Test
      </h1>
      <div className="max-w-2xl">
        <CodeSnippet code={sampleCode} language="javascript" />
      </div>
    </div>
  );
}

export default App;
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: Code snippet with syntax highlighting and copy button

**Step 5: Commit**

```bash
git add src/components/molecules/CodeSnippet.jsx src/components/molecules/index.js src/App.jsx
git commit -m "feat: add CodeSnippet component with syntax highlighting"
```

---

### Task 15: Create SearchBar Component

**Files:**
- Create: `src/components/molecules/SearchBar.jsx`
- Modify: `src/components/molecules/index.js`

**Step 1: Write SearchBar component**

Create `src/components/molecules/SearchBar.jsx`:

```jsx
import React from 'react';
import { Input } from '../atoms';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search APIs...', className = '' }) => {
  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<FiSearch size={20} />}
        className="text-lg"
      />
    </div>
  );
};

export default SearchBar;
```

**Step 2: Update barrel export**

Edit `src/components/molecules/index.js`:

```javascript
export { default as APICard } from './APICard';
export { default as CodeSnippet } from './CodeSnippet';
export { default as SearchBar } from './SearchBar';
```

**Step 3: Commit**

```bash
git add src/components/molecules/SearchBar.jsx src/components/molecules/index.js
git commit -m "feat: add SearchBar molecule component"
```

---

## Phase 5: Layout & Routing

### Task 16: Create Layout Components

**Files:**
- Create: `src/components/layout/Header.jsx`
- Create: `src/components/layout/Footer.jsx`
- Create: `src/components/layout/Layout.jsx`

**Step 1: Write Header component**

Create `src/components/layout/Header.jsx`:

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../atoms';
import { useAuth } from '../../context';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Docs', path: '/docs' },
  ];

  return (
    <header className="bg-white border-b-2 border-border-light sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold text-text-dark">APIMart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-text-dark hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  <FiUser className="inline mr-2" />
                  {user?.name}
                </Button>
                <Button variant="primary" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-light">
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-text-dark hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border-light">
                {isLoggedIn ? (
                  <>
                    <Button variant="secondary" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                      Dashboard
                    </Button>
                    <Button variant="primary" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                      Login
                    </Button>
                    <Button variant="primary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

**Step 2: Write Footer component**

Create `src/components/layout/Footer.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-border-light mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="text-xl font-bold text-text-dark">APIMart</span>
            </div>
            <p className="text-text-secondary text-sm">
              One API for 500+ AI models. Simple, fast, and reliable.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-text-dark mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-text-secondary hover:text-primary text-sm">API Marketplace</Link></li>
              <li><Link to="/pricing" className="text-text-secondary hover:text-primary text-sm">Pricing</Link></li>
              <li><Link to="/docs" className="text-text-secondary hover:text-primary text-sm">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-text-dark mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-primary text-sm">About</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary text-sm">Blog</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary text-sm">Careers</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-text-dark mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-primary">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border-light mt-8 pt-8 text-center">
          <p className="text-text-secondary text-sm">
            © {currentYear} APIMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

**Step 3: Write Layout component**

Create `src/components/layout/Layout.jsx`:

```jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
```

**Step 4: Create barrel export**

Create `src/components/layout/index.js`:

```javascript
export { default as Layout } from './Layout';
export { default as Header } from './Header';
export { default as Footer } from './Footer';
```

**Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Layout, Header, and Footer components"
```

---

### Task 17: Create Page Components (Placeholders)

**Files:**
- Create: `src/pages/Home.jsx`
- Create: `src/pages/Marketplace.jsx`
- Create: `src/pages/APIDetail.jsx`
- Create: `src/pages/Pricing.jsx`
- Create: `src/pages/Documentation.jsx`
- Create: `src/pages/Dashboard.jsx`
- Create: `src/pages/Auth.jsx`

**Step 1: Create placeholder pages**

Create `src/pages/Home.jsx`:

```jsx
import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Home Page</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Home;
```

Create `src/pages/Marketplace.jsx`:

```jsx
import React from 'react';

const Marketplace = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">API Marketplace</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Marketplace;
```

Create `src/pages/APIDetail.jsx`:

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const APIDetail = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">API Detail: {id}</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default APIDetail;
```

Create `src/pages/Pricing.jsx`:

```jsx
import React from 'react';

const Pricing = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Pricing</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Pricing;
```

Create `src/pages/Documentation.jsx`:

```jsx
import React from 'react';

const Documentation = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Documentation</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Documentation;
```

Create `src/pages/Dashboard.jsx`:

```jsx
import React from 'react';
import { useAuth } from '../context';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Dashboard;
```

Create `src/pages/Auth.jsx`:

```jsx
import React from 'react';

const Auth = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Login / Sign Up</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Auth;
```

**Step 2: Create barrel export**

Create `src/pages/index.js`:

```javascript
export { default as Home } from './Home';
export { default as Marketplace } from './Marketplace';
export { default as APIDetail } from './APIDetail';
export { default as Pricing } from './Pricing';
export { default as Documentation } from './Documentation';
export { default as Dashboard } from './Dashboard';
export { default as Auth } from './Auth';
```

**Step 3: Commit**

```bash
git add src/pages/
git commit -m "feat: add placeholder page components"
```

---

### Task 18: Set Up Routing in App.jsx

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

**Step 1: Update main.jsx with providers**

Edit `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { APIProvider, AuthProvider } from './context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <APIProvider>
          <App />
        </APIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**Step 2: Update App.jsx with routes**

Edit `src/App.jsx`:

```jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home, Marketplace, APIDetail, Pricing, Documentation, Dashboard, Auth } from './pages';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/api/:id" element={<APIDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

**Step 3: Test routing**

```bash
npm run dev
```

Expected: Navigate between pages using header links, see placeholder content

**Step 4: Commit**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: set up routing and context providers"
```

---

## Phase 6: Implement Pages (Continued in next tasks...)

*Note: Due to length, the remaining tasks for implementing each page fully, organism components, charts, and final polish would continue in the same granular format. Each task would be 2-5 minutes with specific file paths, complete code, test commands, and commits.*

---

## Summary

This implementation plan provides:
- ✅ Granular, 2-5 minute tasks
- ✅ Complete code in each step
- ✅ Exact file paths
- ✅ Test/verification commands
- ✅ Frequent commits
- ✅ Component-driven architecture
- ✅ Mock data with context management
- ✅ Routing and layout structure

**Next Steps:** Continue implementing remaining pages (Home hero, Marketplace grid, API Detail tabs, Pricing cards, Docs, Dashboard charts, Auth form) following the same granular pattern.
