import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context';
import { useSearchParams, Navigate } from 'react-router-dom';
import { mockUser, getUsageByDateRange, getRecentCalls } from '../data/mockUser';
import copy from 'copy-to-clipboard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  FiKey,
  FiActivity,
  FiDollarSign,
  FiUsers,
  FiPlus,
  FiCopy,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiX,
} from 'react-icons/fi';

const TABS = [
  { id: 'apikey', label: 'API Key', icon: FiKey },
  { id: 'usage', label: 'Usage Logs', icon: FiActivity },
  { id: 'billing', label: 'Billing', icon: FiDollarSign },
  { id: 'activity', label: 'Activity', icon: FiUsers },
];

const maskKey = (key) => {
  if (!key || key.length < 12) return key;
  return key.slice(0, 7) + '••••••••••••' + key.slice(-4);
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const statusBadge = (status) => {
  if (status >= 200 && status < 300)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
        {status}
      </span>
    );
  if (status === 429)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">
        {status}
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
      {status}
    </span>
  );
};

function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center p-1.5 rounded-md hover:bg-surface-light transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <FiCheck className="w-4 h-4 text-green-400" />
      ) : (
        <FiCopy className="w-4 h-4 text-text-muted" />
      )}
    </button>
  );
}

function CreateKeyModal({ onClose, onCreate }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface rounded-[10px] shadow-dropdown border border-border-light p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Create API Key
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-light transition-colors"
          >
            <FiX className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-white mb-1.5">
            Key Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production, Development"
            className="w-full px-4 py-2.5 border border-border-light rounded-[10px] text-sm text-white bg-surface-light placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-[10px] hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function APIKeyTab({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [keys, setKeys] = useState(() => [
    {
      id: 'key_1',
      name: 'Default Key',
      key: user?.apiKey || 'sk-supremind-demo-abc123xyz789',
      created: '2025-12-15T10:30:00Z',
      status: 'active',
    },
    {
      id: 'key_2',
      name: 'Development',
      key: 'sk-supremind-dev-m4n5o6p7q8r9',
      created: '2026-01-08T14:20:00Z',
      status: 'active',
    },
  ]);

  const toggleReveal = (id) =>
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCreate = (name) => {
    const newKey = {
      id: `key_${Date.now()}`,
      name,
      key: `sk-supremind-${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      status: 'active',
    };
    setKeys((prev) => [...prev, newKey]);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">API Key</h2>
          <p className="text-text-secondary mt-1">
            The key to the magic world of AI
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-[10px] hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      <div className="bg-surface rounded-[10px] border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-subtle">
                <th className="text-left px-6 py-3 font-medium text-text-muted">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">
                  Key
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">
                  Created
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-border-light last:border-b-0 hover:bg-surface-light/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {k.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-text-secondary bg-body px-2 py-1 rounded">
                        {revealedKeys[k.id] ? k.key : maskKey(k.key)}
                      </code>
                      <button
                        onClick={() => toggleReveal(k.id)}
                        className="p-1 rounded-md hover:bg-surface-light transition-colors"
                        title={revealedKeys[k.id] ? 'Hide key' : 'Reveal key'}
                      >
                        {revealedKeys[k.id] ? (
                          <FiEyeOff className="w-3.5 h-3.5 text-text-muted" />
                        ) : (
                          <FiEye className="w-3.5 h-3.5 text-text-muted" />
                        )}
                      </button>
                      <CopyButton text={k.key} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {formatDate(k.created)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
                      {k.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CreateKeyModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function UsageLogsTab() {
  const usageData = useMemo(() => getUsageByDateRange(30), []);
  const recentCalls = useMemo(() => getRecentCalls(10), []);

  const totals = useMemo(() => {
    const t = usageData.reduce(
      (acc, d) => ({
        calls: acc.calls + d.calls,
        tokens: acc.tokens + d.tokens,
        cost: acc.cost + parseFloat(d.cost),
      }),
      { calls: 0, tokens: 0, cost: 0 }
    );
    return t;
  }, [usageData]);

  const chartData = useMemo(
    () =>
      usageData.map((d) => ({
        date: d.date.slice(5),
        calls: d.calls,
      })),
    [usageData]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Usage Logs</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Calls', value: totals.calls.toLocaleString() },
          { label: 'Total Tokens', value: totals.tokens.toLocaleString() },
          { label: 'Total Cost', value: `$${totals.cost.toFixed(2)}` },
          { label: 'Current Month', value: `${mockUser.usage.currentMonth.calls.toLocaleString()} calls` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border-light rounded-[10px] p-5"
          >
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-white mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border-light rounded-[10px] p-6 mb-8">
        <h3 className="text-sm font-medium text-white mb-4">
          Daily API Calls (Last 30 Days)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F47920" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F47920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#243656" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#5A6E8A' }}
                tickLine={false}
                axisLine={{ stroke: '#243656' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#5A6E8A' }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #243656',
                  backgroundColor: '#111D32',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  fontSize: '13px',
                  color: '#FFFFFF',
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#F47920"
                strokeWidth={2}
                fill="url(#callsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface border border-border-light rounded-[10px] overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light">
          <h3 className="text-sm font-medium text-white">
            Recent API Calls
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-subtle">
                <th className="text-left px-6 py-3 font-medium text-text-muted">Time</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Model</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Status</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Latency</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Tokens</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Cost</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-border-light last:border-b-0 hover:bg-surface-light/50 transition-colors"
                >
                  <td className="px-6 py-3 text-text-secondary">{formatTime(call.timestamp)}</td>
                  <td className="px-6 py-3">
                    <code className="text-xs font-mono text-text-secondary">{call.model}</code>
                  </td>
                  <td className="px-6 py-3">{statusBadge(call.status)}</td>
                  <td className="px-6 py-3 text-text-secondary">{call.latency}ms</td>
                  <td className="px-6 py-3 text-text-secondary">{call.tokens}</td>
                  <td className="px-6 py-3 text-white font-medium">${call.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const RECHARGE_PACKAGES = [
  { amount: 5, bonus: 0.25 },
  { amount: 20, bonus: 2 },
  { amount: 50, bonus: 7.5 },
  { amount: 100, bonus: 20 },
];

const MOCK_TRANSACTIONS = [
  { id: 'txn_1', date: '2026-03-01T09:15:00Z', type: 'Recharge', amount: 50.0, bonus: 7.5, method: 'Visa ****4242' },
  { id: 'txn_2', date: '2026-02-14T17:42:00Z', type: 'Recharge', amount: 20.0, bonus: 2.0, method: 'Visa ****4242' },
  { id: 'txn_3', date: '2026-01-28T11:30:00Z', type: 'Referral Reward', amount: 5.0, bonus: 0, method: '--' },
];

function BillingTab() {
  const [selectedPkg, setSelectedPkg] = useState(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Billing</h2>

      <div className="bg-surface border border-border-light rounded-[10px] p-8 mb-8 text-center">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wide mb-2">Current Balance</p>
        <p className="text-5xl font-bold text-white">$72.50</p>
        <p className="text-sm text-text-secondary mt-2">Available credits</p>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Recharge Packages</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {RECHARGE_PACKAGES.map((pkg) => (
          <button
            key={pkg.amount}
            onClick={() => setSelectedPkg(pkg.amount)}
            className={`relative bg-surface border rounded-[10px] p-5 text-left transition-all hover:shadow-card-hover ${
              selectedPkg === pkg.amount
                ? 'border-primary ring-1 ring-primary'
                : 'border-border-light'
            }`}
          >
            <p className="text-2xl font-bold text-white">${pkg.amount}</p>
            <p className="text-sm text-text-secondary mt-1">+${pkg.bonus.toFixed(2)} bonus</p>
            {pkg.bonus > 0 && (
              <span className="absolute top-3 right-3 text-xs font-medium text-primary">
                +{Math.round((pkg.bonus / pkg.amount) * 100)}%
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedPkg && (
        <div className="mb-8">
          <button className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-[10px] hover:bg-primary-dark transition-colors">
            Pay ${selectedPkg}
          </button>
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
      <div className="bg-surface border border-border-light rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-subtle">
                <th className="text-left px-6 py-3 font-medium text-text-muted">Date</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Type</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Amount</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Bonus</th>
                <th className="text-left px-6 py-3 font-medium text-text-muted">Method</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-border-light last:border-b-0 hover:bg-surface-light/50 transition-colors"
                >
                  <td className="px-6 py-3 text-text-secondary">{formatDate(txn.date)}</td>
                  <td className="px-6 py-3 text-white">{txn.type}</td>
                  <td className="px-6 py-3 text-white font-medium">+${txn.amount.toFixed(2)}</td>
                  <td className="px-6 py-3 text-primary font-medium">
                    {txn.bonus > 0 ? `+$${txn.bonus.toFixed(2)}` : '--'}
                  </td>
                  <td className="px-6 py-3 text-text-secondary">{txn.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActivityTab() {
  const referralLink = 'https://supremind.ai/ref/demo-user-123';

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Activity</h2>

      <div className="bg-surface border border-border-light rounded-[10px] p-8 mb-8">
        <h3 className="text-lg font-semibold text-white mb-2">Referral Program</h3>
        <p className="text-text-secondary text-sm mb-6 max-w-xl">
          Invite your friends to supremind.ai and earn credits. You will receive{' '}
          <span className="font-medium text-primary">$5.00</span> for every
          friend who signs up and makes their first recharge.
        </p>

        <div className="mb-8">
          <label className="block text-sm font-medium text-white mb-1.5">Your Referral Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2.5 bg-body border border-border-light rounded-[10px] text-sm font-mono text-text-secondary truncate">
              {referralLink}
            </div>
            <CopyButton text={referralLink} className="border border-border-light px-3 py-2.5 rounded-[10px]" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Invites', value: '12' },
            { label: 'Completed', value: '7' },
            { label: 'Rewards', value: '$35.00' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-body rounded-[10px] p-5 text-center"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = () => {
    const param = searchParams.get('tab');
    const match = TABS.find((t) => t.id === param);
    return match ? match.id : 'apikey';
  };

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeTab === 'apikey') {
      params.delete('tab');
    } else {
      params.set('tab', activeTab);
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'apikey':
        return <APIKeyTab user={user} />;
      case 'usage':
        return <UsageLogsTab />;
      case 'billing':
        return <BillingTab />;
      case 'activity':
        return <ActivityTab />;
      default:
        return <APIKeyTab user={user} />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-body">
      <aside className="w-[240px] shrink-0 bg-surface border-r border-border-light">
        <nav className="py-6">
          <ul className="space-y-1 px-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-text-secondary hover:bg-surface-light hover:text-white'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
