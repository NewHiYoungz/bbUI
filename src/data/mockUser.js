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
