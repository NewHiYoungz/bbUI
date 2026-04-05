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

/* ───────────── helpers ───────────── */

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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        {status}
      </span>
    );
  if (status === 429)
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        {status}
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
      {status}
    </span>
  );
};

/* ───────────── Copy Button ───────────── */

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
      className={`inline-flex items-center justify-center p-1.5 rounded-md hover:bg-bg-subtle transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <FiCheck className="w-4 h-4 text-green-500" />
      ) : (
        <FiCopy className="w-4 h-4 text-text-secondary" />
      )}
    </button>
  );
}

/* ───────────── Create Key Modal ───────────── */

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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[10px] shadow-dropdown p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">
            Create API Key
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-bg-subtle transition-colors"
          >
            <FiX className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Key Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production, Development"
            className="w-full px-4 py-2.5 border border-border-light rounded-[10px] text-sm text-text-dark placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-dark transition-colors"
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

/* ═══════════════════ TAB CONTENT ═══════════════════ */

/* ───────────── API Key Tab ───────────── */

function APIKeyTab({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [keys, setKeys] = useState(() => [
    {
      id: 'key_1',
      name: 'Default Key',
      key: user?.apiKey || 'sk-apimart-demo-abc123xyz789',
      created: '2025-12-15T10:30:00Z',
      status: 'active',
    },
    {
      id: 'key_2',
      name: 'Development',
      key: 'sk-apimart-dev-m4n5o6p7q8r9',
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
      key: `sk-apimart-${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      status: 'active',
    };
    setKeys((prev) => [...prev, newKey]);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">API Key</h2>
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

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-bg-subtle">
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Key
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Created
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-border-light last:border-b-0 hover:bg-bg-subtle/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-text-dark">
                    {k.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-text-dark bg-bg-subtle px-2 py-1 rounded">
                        {revealedKeys[k.id] ? k.key : maskKey(k.key)}
                      </code>
                      <button
                        onClick={() => toggleReveal(k.id)}
                        className="p-1 rounded-md hover:bg-bg-subtle transition-colors"
                        title={revealedKeys[k.id] ? 'Hide key' : 'Reveal key'}
                      >
                        {revealedKeys[k.id] ? (
                          <FiEyeOff className="w-3.5 h-3.5 text-text-secondary" />
                        ) : (
                          <FiEye className="w-3.5 h-3.5 text-text-secondary" />
                        )}
                      </button>
                      <CopyButton text={k.key} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {formatDate(k.created)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
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

/* ───────────── Usage Logs Tab ───────────── */

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
        date: d.date.slice(5), // MM-DD
        calls: d.calls,
      })),
    [usageData]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-dark mb-6">Usage Logs</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Calls',
            value: totals.calls.toLocaleString(),
          },
          {
            label: 'Total Tokens',
            value: totals.tokens.toLocaleString(),
          },
          {
            label: 'Total Cost',
            value: `$${totals.cost.toFixed(2)}`,
          },
          {
            label: 'Current Month',
            value: `${mockUser.usage.currentMonth.calls.toLocaleString()} calls`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border-light rounded-[10px] p-5"
          >
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-text-dark mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-border-light rounded-[10px] p-6 mb-8">
        <h3 className="text-sm font-medium text-text-dark mb-4">
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
                  <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFE6E9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#B2BEC3' }}
                tickLine={false}
                axisLine={{ stroke: '#DFE6E9' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#B2BEC3' }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #DFE6E9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#6C5CE7"
                strokeWidth={2}
                fill="url(#callsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="bg-white border border-border-light rounded-[10px] overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light">
          <h3 className="text-sm font-medium text-text-dark">
            Recent API Calls
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-bg-subtle">
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Time
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Model
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Latency
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Tokens
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-border-light last:border-b-0 hover:bg-bg-subtle/50 transition-colors"
                >
                  <td className="px-6 py-3 text-text-secondary">
                    {formatTime(call.timestamp)}
                  </td>
                  <td className="px-6 py-3">
                    <code className="text-xs font-mono text-text-dark">
                      {call.model}
                    </code>
                  </td>
                  <td className="px-6 py-3">{statusBadge(call.status)}</td>
                  <td className="px-6 py-3 text-text-secondary">
                    {call.latency}ms
                  </td>
                  <td className="px-6 py-3 text-text-secondary">
                    {call.tokens}
                  </td>
                  <td className="px-6 py-3 text-text-dark font-medium">
                    ${call.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Billing Tab ───────────── */

const RECHARGE_PACKAGES = [
  { amount: 5, bonus: 0.25 },
  { amount: 20, bonus: 2 },
  { amount: 50, bonus: 7.5 },
  { amount: 100, bonus: 20 },
];

const MOCK_TRANSACTIONS = [
  {
    id: 'txn_1',
    date: '2026-03-01T09:15:00Z',
    type: 'Recharge',
    amount: 50.0,
    bonus: 7.5,
    method: 'Visa ****4242',
  },
  {
    id: 'txn_2',
    date: '2026-02-14T17:42:00Z',
    type: 'Recharge',
    amount: 20.0,
    bonus: 2.0,
    method: 'Visa ****4242',
  },
  {
    id: 'txn_3',
    date: '2026-01-28T11:30:00Z',
    type: 'Referral Reward',
    amount: 5.0,
    bonus: 0,
    method: '--',
  },
];

function BillingTab() {
  const [selectedPkg, setSelectedPkg] = useState(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-dark mb-6">Billing</h2>

      {/* Balance */}
      <div className="bg-white border border-border-light rounded-[10px] p-8 mb-8 text-center">
        <p className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-2">
          Current Balance
        </p>
        <p className="text-5xl font-bold text-text-dark">
          $72.50
        </p>
        <p className="text-sm text-text-secondary mt-2">Available credits</p>
      </div>

      {/* Recharge Packages */}
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        Recharge Packages
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {RECHARGE_PACKAGES.map((pkg) => (
          <button
            key={pkg.amount}
            onClick={() => setSelectedPkg(pkg.amount)}
            className={`relative bg-white border rounded-[10px] p-5 text-left transition-all hover:shadow-card-hover ${
              selectedPkg === pkg.amount
                ? 'border-primary ring-1 ring-primary'
                : 'border-border-light'
            }`}
          >
            <p className="text-2xl font-bold text-text-dark">${pkg.amount}</p>
            <p className="text-sm text-text-secondary mt-1">
              +${pkg.bonus.toFixed(2)} bonus
            </p>
            {pkg.bonus > 0 && (
              <span className="absolute top-3 right-3 text-xs font-medium text-accent">
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

      {/* Transaction History */}
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        Transaction History
      </h3>
      <div className="bg-white border border-border-light rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-bg-subtle">
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Date
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Type
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Amount
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Bonus
                </th>
                <th className="text-left px-6 py-3 font-medium text-text-secondary">
                  Method
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-border-light last:border-b-0 hover:bg-bg-subtle/50 transition-colors"
                >
                  <td className="px-6 py-3 text-text-secondary">
                    {formatDate(txn.date)}
                  </td>
                  <td className="px-6 py-3 text-text-dark">{txn.type}</td>
                  <td className="px-6 py-3 text-text-dark font-medium">
                    +${txn.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-accent font-medium">
                    {txn.bonus > 0 ? `+$${txn.bonus.toFixed(2)}` : '--'}
                  </td>
                  <td className="px-6 py-3 text-text-secondary">
                    {txn.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Activity Tab ───────────── */

function ActivityTab() {
  const referralLink = 'https://apimart.ai/ref/demo-user-123';

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-dark mb-6">Activity</h2>

      {/* Referral Program */}
      <div className="bg-white border border-border-light rounded-[10px] p-8 mb-8">
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Referral Program
        </h3>
        <p className="text-text-secondary text-sm mb-6 max-w-xl">
          Invite your friends to APIMart and earn credits. You will receive{' '}
          <span className="font-medium text-primary">$5.00</span> for every
          friend who signs up and makes their first recharge.
        </p>

        {/* Referral Link */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Your Referral Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2.5 bg-bg-subtle border border-border-light rounded-[10px] text-sm font-mono text-text-dark truncate">
              {referralLink}
            </div>
            <CopyButton text={referralLink} className="border border-border-light px-3 py-2.5 rounded-[10px]" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Invites', value: '12' },
            { label: 'Completed', value: '7' },
            { label: 'Rewards', value: '$35.00' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-bg-subtle rounded-[10px] p-5 text-center"
            >
              <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
              <p className="text-xs font-medium text-text-secondary mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN DASHBOARD ═══════════════════ */

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = () => {
    const param = searchParams.get('tab');
    const match = TABS.find((t) => t.id === param);
    return match ? match.id : 'apikey';
  };

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab to URL
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
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-subtle">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 bg-white border-r border-border-light">
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
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-bg-subtle hover:text-text-dark'
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

      {/* Content */}
      <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
