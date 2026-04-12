import React, { useState, useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context';
import {
  mockUser,
  getUsageByDateRange,
  getRecentCalls,
  getModelUsageBreakdown,
  getErrorBreakdown,
} from '../data/mockUser';
import { mockAPIs } from '../data/mockAPIs';
import copy from 'copy-to-clipboard';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FiHome, FiList, FiBarChart2, FiKey, FiDollarSign, FiUsers,
  FiPlus, FiCopy, FiCheck, FiEye, FiEyeOff, FiX,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp,
  FiSearch, FiActivity, FiAlertCircle,
  FiShield, FiGlobe, FiClock, FiSliders, FiTrash2, FiEdit2, FiServer,
} from 'react-icons/fi';

/* ═══════════════════════════════════════════
   Utility helpers
   ═══════════════════════════════════════════ */

const maskKey = (key) => key ? `${key.slice(0, 14)}...${key.slice(-4)}` : '';

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const fmtNum = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const statusBadge = (status) => {
  if (status >= 200 && status < 300) return <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-green-500/15 text-green-400">{status}</span>;
  if (status === 429) return <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-yellow-500/15 text-yellow-400">{status}</span>;
  return <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-red-500/15 text-red-400">{status}</span>;
};

const typeBadge = (type) => {
  const colors = {
    text: 'bg-blue-500/15 text-blue-400',
    image: 'bg-emerald-500/15 text-emerald-400',
    video: 'bg-violet-500/15 text-violet-400',
    audio: 'bg-amber-500/15 text-amber-400',
  };
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${colors[type] || colors.text}`}>{type}</span>;
};

const CHART_COLORS = ['#F47920', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
const PIE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

const chartTooltipStyle = {
  contentStyle: { background: '#111D32', border: '1px solid #243656', borderRadius: '10px', fontSize: '12px' },
  labelStyle: { color: '#8A9AB5' },
  itemStyle: { color: '#fff' },
};

/* ═══════════════════════════════════════════
   Shared components
   ═══════════════════════════════════════════ */

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { copy(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-1 text-sm transition-colors ${copied ? 'text-green-400' : 'text-text-muted hover:text-white'} ${className}`}>
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, trend }) => (
  <div className="bg-surface border border-border-light rounded-[10px] p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-text-muted text-xs font-medium uppercase tracking-wider">{label}</span>
      {Icon && <Icon size={16} className="text-text-muted" />}
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {(sub || trend !== undefined) && (
      <div className="flex items-center gap-2 mt-1">
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
        {sub && <span className="text-xs text-text-muted">{sub}</span>}
      </div>
    )}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{children}</h3>
);

/* ═══════════════════════════════════════════
   Tab 1: Overview
   ═══════════════════════════════════════════ */

const OverviewTab = () => {
  const last7 = getUsageByDateRange(7);
  const prev7 = getUsageByDateRange(14).slice(0, 7);
  const calls7 = last7.reduce((s, d) => s + d.calls, 0);
  const prevCalls7 = prev7.reduce((s, d) => s + d.calls, 0);
  const callsTrend = prevCalls7 > 0 ? Math.round(((calls7 - prevCalls7) / prevCalls7) * 100) : 0;
  const tokens7 = last7.reduce((s, d) => s + d.tokens, 0);
  const prevTokens7 = prev7.reduce((s, d) => s + d.tokens, 0);
  const tokensTrend = prevTokens7 > 0 ? Math.round(((tokens7 - prevTokens7) / prevTokens7) * 100) : 0;
  const cost7 = last7.reduce((s, d) => s + d.cost, 0);
  const prevCost7 = prev7.reduce((s, d) => s + d.cost, 0);
  const costTrend = prevCost7 > 0 ? Math.round(((cost7 - prevCost7) / prevCost7) * 100) : 0;
  const avgLat7 = last7.length > 0 ? Math.round(last7.reduce((s, d) => s + d.avgLatency, 0) / last7.length) : 0;
  const prevLat7 = prev7.length > 0 ? Math.round(prev7.reduce((s, d) => s + d.avgLatency, 0) / prev7.length) : 0;
  const latTrend = prevLat7 > 0 ? Math.round(((avgLat7 - prevLat7) / prevLat7) * 100) : 0;

  const modelBreakdown = getModelUsageBreakdown().slice(0, 5);
  const recentErrors = getRecentCalls().filter((c) => c.status !== 200).slice(0, 5);
  const { currentMonth } = mockUser.usage;

  return (
    <div className="space-y-8">
      {/* Status */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-[10px] px-5 py-3 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-medium text-green-400">All Systems Operational</span>
        <span className="text-xs text-text-muted ml-auto">Uptime 99.97% (30d)</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Calls (7d)" value={fmtNum(calls7)} trend={callsTrend} sub="vs prev 7d" icon={FiActivity} />
        <StatCard label="Tokens (7d)" value={fmtNum(tokens7)} trend={tokensTrend} sub="vs prev 7d" icon={FiBarChart2} />
        <StatCard label="Cost (7d)" value={`$${cost7.toFixed(2)}`} trend={costTrend} sub="vs prev 7d" icon={FiDollarSign} />
        <StatCard label="Avg Latency (7d)" value={`${avgLat7}ms`} trend={-latTrend} sub="lower is better" icon={FiAlertCircle} />
      </div>

      {/* Month progress */}
      <div>
        <SectionTitle>Current Month</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'API Calls', value: fmtNum(currentMonth.calls), max: '1M', pct: (currentMonth.calls / 1_000_000) * 100 },
            { label: 'Tokens', value: fmtNum(currentMonth.tokens), max: '1B', pct: (currentMonth.tokens / currentMonth.limit) * 100 },
            { label: 'Cost', value: `$${currentMonth.cost.toFixed(2)}`, max: '$500', pct: (currentMonth.cost / 500) * 100 },
          ].map((item) => (
            <div key={item.label} className="bg-surface border border-border-light rounded-[10px] p-4">
              <div className="flex justify-between text-xs text-text-muted mb-2">
                <span>{item.label}</span>
                <span>{item.value} / {item.max}</span>
              </div>
              <div className="h-2 bg-body rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(item.pct, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top models + Sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionTitle>Calls Trend (7 days)</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs><linearGradient id="ogFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F47920" stopOpacity={0.3} /><stop offset="95%" stopColor="#F47920" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6E8A' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#5A6E8A' }} width={40} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="calls" stroke="#F47920" fill="url(#ogFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <SectionTitle>Top Models by Calls</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#5A6E8A' }} />
                <YAxis type="category" dataKey="model" tick={{ fontSize: 10, fill: '#8A9AB5' }} width={110} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="calls" fill="#F47920" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent errors */}
      {recentErrors.length > 0 && (
        <div>
          <SectionTitle>Recent Errors</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border-light text-text-muted text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Time</th>
                <th className="text-left px-4 py-2.5 font-medium">Model</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">Latency</th>
              </tr></thead>
              <tbody>
                {recentErrors.map((c) => (
                  <tr key={c.id} className="border-b border-border-light last:border-0 hover:bg-surface-light transition-colors">
                    <td className="px-4 py-2.5 text-text-secondary">{formatTime(c.timestamp)}</td>
                    <td className="px-4 py-2.5 text-white font-medium">{c.model}</td>
                    <td className="px-4 py-2.5">{statusBadge(c.status)}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{c.latency}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab 2: Call Logs
   ═══════════════════════════════════════════ */

const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: 'All', value: 'all' },
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Success', value: 'success' },
  { label: 'Rate Limited', value: '429' },
  { label: 'Error', value: 'error' },
];

const TYPE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
];

const CACHE_FILTERS = [
  { label: 'All Cache', value: 'all' },
  { label: 'Cache Hit', value: 'cache' },
  { label: 'No Cache', value: 'nocache' },
];

const MODELS_FILTER = [
  'All',
  'gpt-4o', 'gpt-5', 'claude-sonnet-4-6', 'gemini-2-5-pro', 'deepseek-v3', 'grok-4',
  'dall-e-3', 'gpt-4o-image', 'seedream-5-lite', 'seedream-4-5', 'nano-banana-2',
  'sora-2', 'sora-2-pro', 'veo-3-1', 'wan-2-6', 'hailuo-02',
  'whisper-1',
];

const PER_PAGE = 20;

const CallExpandedRow = ({ call }) => {
  if (call.type === 'text') {
    // Token segments for the stacked bar
    const segments = [
      { key: 'input', label: 'Input', count: call.inputTokens, color: 'bg-blue-500', dot: 'bg-blue-400' },
      { key: 'cacheWrite', label: 'Cache Write', count: call.cacheWriteTokens || 0, color: 'bg-yellow-500', dot: 'bg-yellow-400' },
      { key: 'cacheRead', label: 'Cache Read', count: call.cacheReadTokens || 0, color: 'bg-green-500', dot: 'bg-green-400' },
      { key: 'output', label: 'Output', count: call.outputTokens, color: 'bg-primary', dot: 'bg-primary' },
      { key: 'reasoning', label: 'Reasoning', count: call.reasoningTokens || 0, color: 'bg-violet-500', dot: 'bg-violet-400' },
    ].filter(s => s.count > 0);
    const totalBar = segments.reduce((s, seg) => s + seg.count, 0);

    // Cost breakdown lines
    const pricing = mockAPIs.find(a => a.id === call.model)?.pricing || {};
    const costLines = [];
    const bd = call.costBreakdown || {};
    if (bd.input !== undefined) costLines.push({ label: 'Input', tokens: call.inputTokens, rate: pricing.input, cost: bd.input });
    if (bd.cacheWrite !== undefined) costLines.push({ label: 'Cache Write', tokens: call.cacheWriteTokens, rate: pricing.cacheWrite ?? pricing.input, cost: bd.cacheWrite });
    if (bd.cacheRead !== undefined) costLines.push({ label: 'Cache Read', tokens: call.cacheReadTokens, rate: pricing.cacheRead ?? pricing.cachedInput ?? pricing.input, cost: bd.cacheRead });
    if (bd.output !== undefined) costLines.push({ label: 'Output', tokens: call.outputTokens, rate: pricing.output, cost: bd.output });
    if (bd.reasoning !== undefined) costLines.push({ label: 'Reasoning', tokens: call.reasoningTokens, rate: pricing.reasoning ?? pricing.output, cost: bd.reasoning });

    const details = [
      { label: 'Streaming', value: call.streaming ? 'Yes' : 'No' },
      { label: 'Temperature', value: call.temperature },
      { label: 'Max Tokens', value: fmtNum(call.maxTokens) },
      { label: 'Finish Reason', value: call.finishReason || '—' },
      { label: 'Fingerprint', value: call.systemFingerprint || '—' },
      { label: 'Endpoint', value: call.endpoint },
    ];

    return (
      <tr><td colSpan={8} className="px-4 py-4 bg-body">
        <div className="space-y-4">
          {/* Token Usage Bar */}
          <div>
            <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Token Usage</span>
            <div className="flex h-2.5 rounded-full overflow-hidden mt-1.5 gap-px">
              {segments.map(s => (
                <div key={s.key} className={`${s.color} transition-all`} style={{ width: `${(s.count / totalBar) * 100}%` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
              {segments.map(s => (
                <span key={s.key} className="inline-flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-text-muted">{s.label}</span>
                  <span className="text-white font-medium">{fmtNum(s.count)}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          {costLines.length > 0 && (
            <div>
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Cost Breakdown</span>
              <div className="mt-1.5 space-y-1">
                {costLines.map(l => (
                  <div key={l.label} className="flex items-baseline text-xs">
                    <span className="w-24 text-text-secondary shrink-0">{l.label}</span>
                    <span className="text-text-muted flex-1">{fmtNum(l.tokens)} tokens &times; ${l.rate}/{pricing.unit?.includes('1M') ? 'M' : 'K'}</span>
                    <span className="text-white font-medium">${l.cost.toFixed(6)}</span>
                  </div>
                ))}
                <div className="border-t border-border-light pt-1 flex items-baseline text-xs">
                  <span className="w-24 text-text-secondary font-medium shrink-0">Total</span>
                  <span className="flex-1" />
                  <span className="text-white font-bold">${call.cost.toFixed(6)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Request Details */}
          <div>
            <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Request Details</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-1.5">
              {details.map(d => (
                <div key={d.label}>
                  <span className="text-[11px] text-text-muted uppercase">{d.label}</span>
                  <p className="text-sm text-white font-medium">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </td></tr>
    );
  }

  // Image / Video / Audio expanded rows
  const details = [];
  if (call.type === 'image') {
    details.push(
      { label: 'Size', value: call.size },
      { label: 'Aspect Ratio', value: call.aspectRatio },
      { label: 'Style', value: call.style },
      { label: 'Quality', value: call.quality === 'hd' ? 'HD' : 'Standard' },
      { label: 'Image Count', value: call.imageCount },
      { label: 'Seed', value: call.seed ?? '—' },
      { label: 'Endpoint', value: call.endpoint },
    );
  } else if (call.type === 'video') {
    details.push(
      { label: 'Duration', value: `${call.duration}s` },
      { label: 'Resolution', value: call.resolution },
      { label: 'Aspect Ratio', value: call.aspectRatio },
      { label: 'FPS', value: call.fps },
      { label: 'Mode', value: call.mode },
      { label: 'Audio', value: call.hasAudio ? 'Yes' : 'No' },
      { label: 'Endpoint', value: call.endpoint },
    );
  } else if (call.type === 'audio') {
    details.push(
      { label: 'Audio Duration', value: `${call.audioDuration}s` },
      { label: 'Language', value: call.language?.toUpperCase() },
      { label: 'Format', value: call.format },
      { label: 'Timestamps', value: call.timestamps ? 'Yes' : 'No' },
      { label: 'Segments', value: call.segments },
      { label: 'Endpoint', value: call.endpoint },
    );
  }

  return (
    <tr><td colSpan={8} className="px-4 py-3 bg-body">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {details.map((d) => (
          <div key={d.label}>
            <span className="text-[11px] text-text-muted uppercase">{d.label}</span>
            <p className="text-sm text-white font-medium">{d.value}</p>
          </div>
        ))}
      </div>
    </td></tr>
  );
};

const CallLogsTab = () => {
  const allCalls = useMemo(() => getRecentCalls(200), []);
  const [dateRange, setDateRange] = useState('all');
  const [modelFilter, setModelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cacheFilter, setCacheFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [sortCol, setSortCol] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let data = allCalls;

    if (dateRange === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      data = data.filter((c) => c.timestamp.slice(0, 10) === today);
    } else if (dateRange === '7d') {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
      data = data.filter((c) => new Date(c.timestamp) >= cutoff);
    } else if (dateRange === '30d') {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
      data = data.filter((c) => new Date(c.timestamp) >= cutoff);
    }

    if (modelFilter !== 'All') data = data.filter((c) => c.model === modelFilter);

    if (statusFilter === 'success') data = data.filter((c) => c.status >= 200 && c.status < 300);
    else if (statusFilter === '429') data = data.filter((c) => c.status === 429);
    else if (statusFilter === 'error') data = data.filter((c) => c.status >= 400);

    if (typeFilter !== 'all') data = data.filter((c) => c.type === typeFilter);

    if (cacheFilter === 'cache') data = data.filter((c) => (c.cacheReadTokens || 0) > 0 || (c.cacheWriteTokens || 0) > 0);
    else if (cacheFilter === 'nocache') data = data.filter((c) => (c.cacheReadTokens || 0) === 0 && (c.cacheWriteTokens || 0) === 0);

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((c) => c.id.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
    }

    data = [...data].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? (va || 0) - (vb || 0) : (vb || 0) - (va || 0);
    });

    return data;
  }, [allCalls, dateRange, modelFilter, statusFilter, typeFilter, cacheFilter, search, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <FiChevronDown size={12} className="text-text-muted opacity-0 group-hover:opacity-100" />;
    return sortDir === 'asc' ? <FiChevronUp size={12} className="text-primary" /> : <FiChevronDown size={12} className="text-primary" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by ID or model..."
            className="pl-9 pr-3 py-2 text-sm bg-surface-light border border-border-light rounded-lg text-white placeholder:text-text-muted focus:border-primary outline-none w-52" />
        </div>
        <div className="flex gap-1">
          {DATE_RANGES.map((r) => (
            <button key={r.value} onClick={() => { setDateRange(r.value); setPage(0); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dateRange === r.value ? 'bg-primary/15 text-primary' : 'text-text-muted hover:text-white hover:bg-surface-light'}`}>
              {r.label}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-surface-light border border-border-light rounded-lg text-white outline-none focus:border-primary">
          {TYPE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-surface-light border border-border-light rounded-lg text-white outline-none focus:border-primary">
          {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select value={modelFilter} onChange={(e) => { setModelFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-surface-light border border-border-light rounded-lg text-white outline-none focus:border-primary max-w-[160px]">
          {MODELS_FILTER.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={cacheFilter} onChange={(e) => { setCacheFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-surface-light border border-border-light rounded-lg text-white outline-none focus:border-primary">
          {CACHE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <span className="text-xs text-text-muted ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border-light rounded-[10px] overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead><tr className="border-b border-border-light text-text-muted text-xs">
            {[
              { key: 'timestamp', label: 'Time' },
              { key: 'model', label: 'Model' },
              { key: 'type', label: 'Type' },
              { key: 'status', label: 'Status' },
              { key: 'latency', label: 'Latency' },
              { key: 'totalTokens', label: 'Details' },
              { key: 'cost', label: 'Cost' },
              { key: 'apiKey', label: 'Key' },
            ].map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}
                className="text-left px-4 py-2.5 font-medium cursor-pointer select-none group hover:text-white transition-colors">
                <span className="inline-flex items-center gap-1">{col.label}<SortIcon col={col.key} /></span>
              </th>
            ))}
          </tr></thead>
          <tbody>
            {pageData.map((call) => (
              <React.Fragment key={call.id}>
                <tr onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
                  className="border-b border-border-light last:border-0 hover:bg-surface-light transition-colors cursor-pointer">
                  <td className="px-4 py-2.5 text-text-secondary whitespace-nowrap">{formatTime(call.timestamp)}</td>
                  <td className="px-4 py-2.5 text-white font-medium">{call.model}</td>
                  <td className="px-4 py-2.5">{typeBadge(call.type)}</td>
                  <td className="px-4 py-2.5">{statusBadge(call.status)}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{call.latency}ms</td>
                  <td className="px-4 py-2.5 text-text-secondary">
                    {call.type === 'text' ? (
                      <span className="inline-flex items-center gap-1.5">
                        {fmtNum(call.inputTokens)} in &rarr; {fmtNum(call.outputTokens)} out
                        {((call.cacheReadTokens || 0) > 0 || (call.cacheWriteTokens || 0) > 0) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" title="Cache activity" />
                        )}
                        {(call.reasoningTokens || 0) > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" title="Reasoning tokens" />
                        )}
                      </span>
                    ) : call.type === 'image' ? (
                      <span className="inline-flex items-center gap-1.5">
                        {call.imageCount} img @ {call.size}
                        {call.quality === 'hd' && <span className="text-[10px] font-bold text-amber-400">HD</span>}
                      </span>
                    ) : call.type === 'video' ? `${call.duration}s @ ${call.resolution}` :
                     `${call.audioDuration}s ${call.language?.toUpperCase()}`}
                  </td>
                  <td className="px-4 py-2.5 text-white font-medium">${typeof call.cost === 'number' ? call.cost.toFixed(4) : call.cost}</td>
                  <td className="px-4 py-2.5 text-text-muted text-xs font-mono">{call.apiKey}</td>
                </tr>
                {expandedId === call.id && <CallExpandedRow call={call} />}
              </React.Fragment>
            ))}
            {pageData.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-text-muted">No calls match your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="p-2 rounded-lg text-text-secondary hover:bg-surface-light disabled:opacity-30 transition-colors"><FiChevronLeft size={16} /></button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="p-2 rounded-lg text-text-secondary hover:bg-surface-light disabled:opacity-30 transition-colors"><FiChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab 3: Analytics
   ═══════════════════════════════════════════ */

const ANALYTICS_RANGES = [
  { label: '24h', value: 1 },
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

const AnalyticsTab = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const data = useMemo(() => getUsageByDateRange(rangeDays), [rangeDays]);
  const prevData = useMemo(() => getUsageByDateRange(rangeDays * 2).slice(0, rangeDays), [rangeDays]);

  const sum = (arr, key) => arr.reduce((s, d) => s + (typeof d[key] === 'string' ? parseFloat(d[key]) : d[key]), 0);
  const avg = (arr, key) => arr.length > 0 ? Math.round(sum(arr, key) / arr.length) : 0;

  const totalCalls = sum(data, 'calls');
  const prevCalls = sum(prevData, 'calls');
  const totalTokens = sum(data, 'tokens');
  const prevTokens = sum(prevData, 'tokens');
  const totalCost = sum(data, 'cost');
  const prevCost = sum(prevData, 'cost');
  const avgLatency = avg(data, 'avgLatency');
  const prevLatency = avg(prevData, 'avgLatency');

  const pctChange = (cur, prev) => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 0;

  const typeData = useMemo(() => {
    const totals = { text: 0, image: 0, video: 0, audio: 0 };
    data.forEach((d) => { if (d.callsByType) { Object.keys(totals).forEach((k) => { totals[k] += d.callsByType[k] || 0; }); } });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [data]);

  const modelData = useMemo(() => getModelUsageBreakdown(), []);
  const errorData = useMemo(() => data.map((d) => ({ date: d.date, errors: d.errorCount, rate: d.calls > 0 ? parseFloat(((d.errorCount / d.calls) * 100).toFixed(1)) : 0 })), [data]);
  const errorBreakdown = useMemo(() => getErrorBreakdown(), []);

  return (
    <div className="space-y-8">
      {/* Range selector */}
      <div className="flex gap-1">
        {ANALYTICS_RANGES.map((r) => (
          <button key={r.value} onClick={() => setRangeDays(r.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${rangeDays === r.value ? 'bg-primary/15 text-primary' : 'text-text-muted hover:text-white hover:bg-surface-light'}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Calls" value={fmtNum(totalCalls)} trend={pctChange(totalCalls, prevCalls)} sub="vs prev period" />
        <StatCard label="Total Tokens" value={fmtNum(totalTokens)} trend={pctChange(totalTokens, prevTokens)} sub="vs prev period" />
        <StatCard label="Total Cost" value={`$${totalCost.toFixed(2)}`} trend={pctChange(totalCost, prevCost)} sub="vs prev period" />
        <StatCard label="Avg Latency" value={`${avgLatency}ms`} trend={-pctChange(avgLatency, prevLatency)} sub="lower is better" />
      </div>

      {/* Calls + Cost over time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionTitle>API Calls Over Time</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="aCallsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F47920" stopOpacity={0.3} /><stop offset="95%" stopColor="#F47920" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243656" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6E8A' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#5A6E8A' }} width={45} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="calls" stroke="#F47920" fill="url(#aCallsFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <SectionTitle>Cost Over Time</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="aCostFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243656" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6E8A' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#5A6E8A' }} width={45} tickFormatter={(v) => `$${v}`} />
                <Tooltip {...chartTooltipStyle} formatter={(v) => [`$${typeof v === 'number' ? v.toFixed(2) : v}`, 'Cost']} />
                <Area type="monotone" dataKey="cost" stroke="#10B981" fill="url(#aCostFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model breakdown + Type distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionTitle>Calls by Model</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#5A6E8A' }} />
                <YAxis type="category" dataKey="model" tick={{ fontSize: 10, fill: '#8A9AB5' }} width={120} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="calls" radius={[0, 4, 4, 0]} barSize={14}>
                  {modelData.slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <SectionTitle>Calls by Type</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip {...chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latency + Error rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionTitle>Average Latency Over Time</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243656" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6E8A' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#5A6E8A' }} width={45} tickFormatter={(v) => `${v}ms`} />
                <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}ms`, 'Avg Latency']} />
                <Line type="monotone" dataKey="avgLatency" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <SectionTitle>Error Rate Over Time</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={errorData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="aErrFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243656" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6E8A' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#5A6E8A' }} width={45} tickFormatter={(v) => `${v}%`} />
                <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}%`, 'Error Rate']} />
                <Area type="monotone" dataKey="rate" stroke="#EF4444" fill="url(#aErrFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionTitle>Top Models</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border-light text-text-muted text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Model</th>
                <th className="text-right px-4 py-2.5 font-medium">Calls</th>
                <th className="text-right px-4 py-2.5 font-medium">Tokens</th>
                <th className="text-right px-4 py-2.5 font-medium">Cost</th>
                <th className="text-right px-4 py-2.5 font-medium">Latency</th>
              </tr></thead>
              <tbody>
                {modelData.slice(0, 8).map((m) => (
                  <tr key={m.model} className="border-b border-border-light last:border-0">
                    <td className="px-4 py-2.5 text-white font-medium">{m.model}</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">{m.calls}</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">{fmtNum(m.tokens)}</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">${m.cost.toFixed(4)}</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">{m.avgLatency}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <SectionTitle>Error Breakdown</SectionTitle>
          <div className="bg-surface border border-border-light rounded-[10px] overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border-light text-text-muted text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-right px-4 py-2.5 font-medium">Count</th>
                <th className="text-right px-4 py-2.5 font-medium">%</th>
                <th className="text-right px-4 py-2.5 font-medium">Last Seen</th>
              </tr></thead>
              <tbody>
                {errorBreakdown.length > 0 ? errorBreakdown.map((e) => (
                  <tr key={e.status} className="border-b border-border-light last:border-0">
                    <td className="px-4 py-2.5">{statusBadge(e.status)}</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">{e.count}</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">{e.percentage}%</td>
                    <td className="px-4 py-2.5 text-right text-text-secondary">{formatTime(e.lastOccurred)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-text-muted">No errors</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab 4: API Keys
   ═══════════════════════════════════════════ */

const ENV_OPTIONS = ['production', 'development', 'staging', 'testing'];
const ENV_COLORS = {
  production: 'bg-red-500/15 text-red-400',
  development: 'bg-blue-500/15 text-blue-400',
  staging: 'bg-yellow-500/15 text-yellow-400',
  testing: 'bg-purple-500/15 text-purple-400',
};
const STATUS_COLORS = {
  active: 'bg-green-500/15 text-green-400',
  disabled: 'bg-yellow-500/15 text-yellow-400',
  revoked: 'bg-red-500/15 text-red-400',
  expired: 'bg-text-muted/15 text-text-muted',
};

const INITIAL_KEYS = [
  {
    id: 'key_1', name: 'Production API', key: 'sk-supremind-prod-abc123xyz789',
    created: '2025-12-15T10:30:00Z', lastUsed: '2026-04-11T14:22:00Z',
    status: 'active', environment: 'production',
    expiresAt: '2027-01-01T00:00:00Z',
    allowedIPs: ['203.0.113.0/24', '198.51.100.42'],
    allowedModels: ['gpt-4o', 'gpt-5', 'claude-sonnet-4-6'],
    rateLimit: { rpm: 120, rpd: 50000 },
    monthlyBudget: { maxTokens: 50000000, maxCost: 500, usedTokens: 12800000, usedCost: 128.40 },
    usage: { totalCalls: 34210, totalTokens: 98000000, totalCost: 980.00 },
  },
  {
    id: 'key_2', name: 'Development', key: 'sk-supremind-dev-xyz987abc321',
    created: '2026-01-20T14:00:00Z', lastUsed: '2026-04-10T09:15:00Z',
    status: 'active', environment: 'development',
    expiresAt: null,
    allowedIPs: [],
    allowedModels: [],
    rateLimit: { rpm: 30, rpd: 5000 },
    monthlyBudget: { maxTokens: 10000000, maxCost: 50, usedTokens: 3200000, usedCost: 18.50 },
    usage: { totalCalls: 8540, totalTokens: 25000000, totalCost: 145.00 },
  },
  {
    id: 'key_3', name: 'CI Pipeline', key: 'sk-supremind-ci-test999def456',
    created: '2026-03-05T08:00:00Z', lastUsed: '2026-04-09T22:00:00Z',
    status: 'disabled', environment: 'testing',
    expiresAt: '2026-06-01T00:00:00Z',
    allowedIPs: ['10.0.0.0/8'],
    allowedModels: ['deepseek-v3'],
    rateLimit: { rpm: 10, rpd: 1000 },
    monthlyBudget: { maxTokens: 2000000, maxCost: 10, usedTokens: 450000, usedCost: 1.20 },
    usage: { totalCalls: 1200, totalTokens: 3600000, totalCost: 9.80 },
  },
];

const DEFAULT_KEY_FORM = {
  name: '', environment: 'development', expiresAt: '',
  allowedIPs: [], allowedModels: [], ipInput: '',
  rateLimit: { rpm: 60, rpd: 10000 },
  monthlyBudget: { maxTokens: 10000000, maxCost: 100 },
};

// ── Tag Input ──
const TagInput = ({ tags, onAdd, onRemove, placeholder, inputValue, onInputChange }) => (
  <div>
    <div className="flex gap-2 mb-2">
      <input
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && inputValue.trim()) { e.preventDefault(); onAdd(inputValue.trim()); onInputChange(''); } }}
        placeholder={placeholder}
        className="flex-1 border-2 border-border-light rounded-[10px] px-3 py-2 text-sm bg-surface-light text-white placeholder:text-text-muted focus:border-primary outline-none"
      />
      <button type="button" onClick={() => { if (inputValue.trim()) { onAdd(inputValue.trim()); onInputChange(''); } }}
        className="btn-secondary text-xs py-2 px-3">Add</button>
    </div>
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-light text-xs text-text-secondary border border-border-light">
            {tag}
            <button type="button" onClick={() => onRemove(i)} className="text-text-muted hover:text-red-400"><FiX size={10} /></button>
          </span>
        ))}
      </div>
    )}
  </div>
);

// ── Confirm Modal ──
const ConfirmModal = ({ title, message, confirmLabel, confirmClass, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-surface border border-border-light rounded-[10px] p-6 w-full max-w-sm">
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-text-secondary mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary text-sm py-2 px-4">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className={`text-sm py-2 px-4 font-semibold rounded-[10px] ${confirmClass || 'btn-primary'}`}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ── Progress Bar ──
const QuotaBar = ({ label, used, max, unit }) => {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-primary';
  const fmt = (v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString();
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-muted">{label}</span>
        <span className="text-text-secondary">{unit === '$' ? `$${used.toFixed(2)}` : fmt(used)} / {unit === '$' ? `$${max.toFixed(2)}` : fmt(max)}</span>
      </div>
      <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ── Key Form Modal (Create / Edit) ──
const KeyFormModal = ({ initialData, onSave, onClose, isEdit }) => {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name,
        environment: initialData.environment,
        expiresAt: initialData.expiresAt ? initialData.expiresAt.slice(0, 10) : '',
        allowedIPs: [...initialData.allowedIPs],
        allowedModels: [...initialData.allowedModels],
        ipInput: '',
        rateLimit: { ...initialData.rateLimit },
        monthlyBudget: { maxTokens: initialData.monthlyBudget.maxTokens, maxCost: initialData.monthlyBudget.maxCost },
      };
    }
    return { ...DEFAULT_KEY_FORM, allowedIPs: [], allowedModels: [], rateLimit: { ...DEFAULT_KEY_FORM.rateLimit }, monthlyBudget: { ...DEFAULT_KEY_FORM.monthlyBudget } };
  });
  const [section, setSection] = useState('basic');

  const sections = [
    { id: 'basic', label: 'Basic', icon: FiKey },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'access', label: 'Access', icon: FiServer },
    { id: 'limits', label: 'Limits', icon: FiSliders },
  ];

  const toggleModel = (id) => {
    setForm(f => ({
      ...f,
      allowedModels: f.allowedModels.includes(id)
        ? f.allowedModels.filter(m => m !== id)
        : [...f.allowedModels, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      environment: form.environment,
      expiresAt: form.expiresAt ? new Date(form.expiresAt + 'T00:00:00Z').toISOString() : null,
      allowedIPs: form.allowedIPs,
      allowedModels: form.allowedModels,
      rateLimit: { rpm: Number(form.rateLimit.rpm) || 60, rpd: Number(form.rateLimit.rpd) || 10000 },
      monthlyBudget: { maxTokens: Number(form.monthlyBudget.maxTokens) || 10000000, maxCost: Number(form.monthlyBudget.maxCost) || 100 },
    });
    onClose();
  };

  const inputCls = 'w-full border-2 border-border-light rounded-[10px] px-3 py-2 text-sm bg-surface-light text-white placeholder:text-text-muted focus:border-primary outline-none';
  const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-surface border border-border-light rounded-[10px] w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border-light">
          <h3 className="text-lg font-bold text-white">{isEdit ? 'Edit API Key' : 'Create API Key'}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white"><FiX size={20} /></button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-border-light px-5">
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${section === s.id ? 'text-primary border-primary' : 'text-text-muted border-transparent hover:text-white'}`}>
              <s.icon size={12} />{s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {section === 'basic' && (
            <>
              <div>
                <label className={labelCls}>Key Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Production, Mobile App" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Environment</label>
                <select value={form.environment} onChange={e => setForm({ ...form, environment: e.target.value })}
                  className={inputCls}>
                  {ENV_OPTIONS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                </select>
              </div>
            </>
          )}

          {section === 'security' && (
            <>
              <div>
                <label className={labelCls}>Expiration Date</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className={inputCls} />
                <p className="text-xs text-text-muted mt-1">Leave empty for no expiration.</p>
              </div>
              <div>
                <label className={labelCls}>IP Whitelist</label>
                <TagInput
                  tags={form.allowedIPs}
                  onAdd={ip => setForm({ ...form, allowedIPs: [...form.allowedIPs, ip] })}
                  onRemove={i => setForm({ ...form, allowedIPs: form.allowedIPs.filter((_, idx) => idx !== i) })}
                  placeholder="e.g. 192.168.1.0/24"
                  inputValue={form.ipInput}
                  onInputChange={v => setForm({ ...form, ipInput: v })}
                />
                <p className="text-xs text-text-muted mt-1">Leave empty to allow all IPs.</p>
              </div>
            </>
          )}

          {section === 'access' && (
            <div>
              <label className={labelCls}>Allowed Models</label>
              <p className="text-xs text-text-muted mb-3">Leave all unchecked to allow access to every model.</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {mockAPIs.map(api => (
                  <label key={api.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-light cursor-pointer transition-colors">
                    <input type="checkbox" checked={form.allowedModels.includes(api.id)} onChange={() => toggleModel(api.id)}
                      className="accent-primary w-3.5 h-3.5" />
                    <span className="text-xs text-text-secondary truncate">{api.name}</span>
                  </label>
                ))}
              </div>
              {form.allowedModels.length > 0 && (
                <p className="text-xs text-primary mt-2">{form.allowedModels.length} model{form.allowedModels.length > 1 ? 's' : ''} selected</p>
              )}
            </div>
          )}

          {section === 'limits' && (
            <>
              <div>
                <label className={labelCls}>Rate Limits</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Requests / Minute</label>
                    <input type="number" value={form.rateLimit.rpm} onChange={e => setForm({ ...form, rateLimit: { ...form.rateLimit, rpm: e.target.value } })}
                      className={inputCls} min="1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Requests / Day</label>
                    <input type="number" value={form.rateLimit.rpd} onChange={e => setForm({ ...form, rateLimit: { ...form.rateLimit, rpd: e.target.value } })}
                      className={inputCls} min="1" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Monthly Budget</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Max Tokens</label>
                    <input type="number" value={form.monthlyBudget.maxTokens} onChange={e => setForm({ ...form, monthlyBudget: { ...form.monthlyBudget, maxTokens: e.target.value } })}
                      className={inputCls} min="0" />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-muted mb-1 block">Max Cost ($)</label>
                    <input type="number" value={form.monthlyBudget.maxCost} onChange={e => setForm({ ...form, monthlyBudget: { ...form.monthlyBudget, maxCost: e.target.value } })}
                      className={inputCls} min="0" step="0.01" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-border-light">
          <button onClick={onClose} className="btn-secondary text-sm py-2 px-4">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm py-2 px-4">{isEdit ? 'Save Changes' : 'Create Key'}</button>
        </div>
      </div>
    </div>
  );
};

// ── API Key Card ──
const APIKeyCard = ({ k, revealed, onToggleReveal, onEdit, onToggleStatus, onRevoke, onDelete }) => {
  const isExpired = k.expiresAt && new Date(k.expiresAt) < new Date();
  const displayStatus = isExpired && k.status === 'active' ? 'expired' : k.status;
  const canToggle = displayStatus === 'active' || displayStatus === 'disabled';
  const canRevoke = displayStatus !== 'revoked';

  return (
    <div className="bg-surface border border-border-light rounded-[10px] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-white">{k.name}</h3>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${ENV_COLORS[k.environment] || ENV_COLORS.development}`}>{k.environment}</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md capitalize ${STATUS_COLORS[displayStatus]}`}>{displayStatus}</span>
        </div>
        <div className="flex items-center gap-1">
          {displayStatus !== 'revoked' && (
            <button onClick={onEdit} className="p-1.5 text-text-muted hover:text-white transition-colors" title="Edit"><FiEdit2 size={14} /></button>
          )}
          {canToggle && (
            <button onClick={onToggleStatus} className="p-1.5 text-text-muted hover:text-yellow-400 transition-colors" title={displayStatus === 'active' ? 'Disable' : 'Enable'}>
              {displayStatus === 'active' ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            </button>
          )}
          {canRevoke && (
            <button onClick={onRevoke} className="p-1.5 text-text-muted hover:text-red-400 transition-colors" title="Revoke"><FiShield size={14} /></button>
          )}
          <button onClick={onDelete} className="p-1.5 text-text-muted hover:text-red-400 transition-colors" title="Delete"><FiTrash2 size={14} /></button>
        </div>
      </div>

      {/* Key */}
      <div className="flex items-center gap-2 mb-4 bg-body rounded-lg px-3 py-2">
        <code className="flex-1 text-xs font-mono text-text-secondary truncate">{revealed ? k.key : maskKey(k.key)}</code>
        <button onClick={onToggleReveal} className="p-1 text-text-muted hover:text-white transition-colors">
          {revealed ? <FiEyeOff size={13} /> : <FiEye size={13} />}
        </button>
        <CopyButton text={k.key} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-4 text-xs">
        <div>
          <span className="text-text-muted block">Created</span>
          <span className="text-text-secondary">{formatDate(k.created)}</span>
        </div>
        <div>
          <span className="text-text-muted block">Last Used</span>
          <span className="text-text-secondary">{k.lastUsed ? formatDate(k.lastUsed) : 'Never'}</span>
        </div>
        <div>
          <span className="text-text-muted block">Expires</span>
          <span className={`${isExpired ? 'text-red-400' : 'text-text-secondary'}`}>{k.expiresAt ? formatDate(k.expiresAt) : 'Never'}</span>
        </div>
        <div>
          <span className="text-text-muted block">Rate Limit</span>
          <span className="text-text-secondary">{k.rateLimit.rpm} RPM / {k.rateLimit.rpd.toLocaleString()} RPD</span>
        </div>
        <div>
          <span className="text-text-muted block">IP Whitelist</span>
          <span className="text-text-secondary">{k.allowedIPs.length > 0 ? `${k.allowedIPs.length} rule${k.allowedIPs.length > 1 ? 's' : ''}` : 'Unrestricted'}</span>
        </div>
        <div>
          <span className="text-text-muted block">Model Access</span>
          <span className="text-text-secondary">{k.allowedModels.length > 0 ? `${k.allowedModels.length} model${k.allowedModels.length > 1 ? 's' : ''}` : 'All models'}</span>
        </div>
      </div>

      {/* Quota Bars */}
      <div className="space-y-2">
        <QuotaBar label="Token Usage" used={k.monthlyBudget.usedTokens} max={k.monthlyBudget.maxTokens} unit="tokens" />
        <QuotaBar label="Cost Budget" used={k.monthlyBudget.usedCost} max={k.monthlyBudget.maxCost} unit="$" />
      </div>

      {/* Usage Footer */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-border-light text-xs text-text-muted">
        <span>{k.usage.totalCalls.toLocaleString()} total calls</span>
        <span>${k.usage.totalCost.toFixed(2)} lifetime spend</span>
      </div>
    </div>
  );
};

const APIKeyTab = ({ user }) => {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [confirm, setConfirm] = useState(null);

  const activeKeys = keys.filter(k => k.status === 'active');
  const monthlySpend = keys.reduce((sum, k) => sum + k.monthlyBudget.usedCost, 0);
  const totalCalls = keys.reduce((sum, k) => sum + k.usage.totalCalls, 0);

  const handleCreate = (data) => {
    const newKey = {
      id: `key_${Date.now()}`,
      key: `sk-supremind-${Math.random().toString(36).slice(2, 14)}`,
      created: new Date().toISOString(),
      lastUsed: null,
      status: 'active',
      ...data,
      monthlyBudget: { ...data.monthlyBudget, usedTokens: 0, usedCost: 0 },
      usage: { totalCalls: 0, totalTokens: 0, totalCost: 0 },
    };
    setKeys([newKey, ...keys]);
  };

  const handleEdit = (data) => {
    setKeys(keys.map(k => k.id === editingKey.id ? {
      ...k, ...data,
      monthlyBudget: { ...k.monthlyBudget, maxTokens: data.monthlyBudget.maxTokens, maxCost: data.monthlyBudget.maxCost },
    } : k));
    setEditingKey(null);
  };

  const toggleStatus = (id) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'disabled' : 'active' } : k));
  };

  const revokeKey = (id) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  const deleteKey = (id) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">API Keys</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"><FiPlus size={14} />Create Key</button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Keys', value: keys.length, icon: FiKey },
          { label: 'Active', value: activeKeys.length, icon: FiCheck },
          { label: 'Monthly Spend', value: `$${monthlySpend.toFixed(2)}`, icon: FiDollarSign },
          { label: 'Total Calls', value: totalCalls.toLocaleString(), icon: FiActivity },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border-light rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className="text-text-muted" />
              <span className="text-xs text-text-muted">{s.label}</span>
            </div>
            <span className="text-lg font-bold text-white">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Key Cards */}
      <div className="space-y-4">
        {keys.map(k => (
          <APIKeyCard
            key={k.id}
            k={k}
            revealed={revealed[k.id]}
            onToggleReveal={() => setRevealed({ ...revealed, [k.id]: !revealed[k.id] })}
            onEdit={() => { setEditingKey(k); setShowForm(true); }}
            onToggleStatus={() => toggleStatus(k.id)}
            onRevoke={() => setConfirm({ type: 'revoke', id: k.id, name: k.name })}
            onDelete={() => setConfirm({ type: 'delete', id: k.id, name: k.name })}
          />
        ))}
      </div>

      {/* Modals */}
      {showForm && (
        <KeyFormModal
          initialData={editingKey}
          isEdit={!!editingKey}
          onSave={editingKey ? handleEdit : handleCreate}
          onClose={() => { setShowForm(false); setEditingKey(null); }}
        />
      )}
      {confirm?.type === 'revoke' && (
        <ConfirmModal
          title="Revoke API Key"
          message={`Are you sure you want to revoke "${confirm.name}"? This is permanent and cannot be undone. Any applications using this key will immediately lose access.`}
          confirmLabel="Revoke Key"
          confirmClass="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={() => revokeKey(confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'delete' && (
        <ConfirmModal
          title="Delete API Key"
          message={`Are you sure you want to delete "${confirm.name}"? This will permanently remove the key and all its usage history.`}
          confirmLabel="Delete Key"
          confirmClass="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={() => deleteKey(confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab 5: Billing
   ═══════════════════════════════════════════ */

const RECHARGE_PACKAGES = [
  { amount: 5, bonus: 0.25 },
  { amount: 20, bonus: 2 },
  { amount: 50, bonus: 7.5 },
  { amount: 100, bonus: 20 },
];

const MOCK_TRANSACTIONS = [
  { id: 'txn_1', date: '2026-03-01T09:15:00Z', type: 'Recharge', amount: 50.00, bonus: 7.50, method: 'Visa ****4242' },
  { id: 'txn_2', date: '2026-02-15T11:30:00Z', type: 'Recharge', amount: 20.00, bonus: 2.00, method: 'Visa ****4242' },
  { id: 'txn_3', date: '2026-01-28T08:00:00Z', type: 'Referral Reward', amount: 5.00, bonus: 0, method: 'Credit' },
];

const BillingTab = () => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="space-y-8">
      <div><h2 className="text-xl font-bold text-white mb-2">Billing</h2></div>
      <div className="bg-surface border border-border-light rounded-[10px] p-6">
        <p className="text-text-muted text-sm mb-1">Available Balance</p>
        <p className="text-3xl font-bold text-white">$72.50</p>
      </div>
      <div>
        <SectionTitle>Add Credits</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RECHARGE_PACKAGES.map((pkg) => (
            <button key={pkg.amount} onClick={() => setSelected(pkg.amount)}
              className={`relative bg-surface border-2 rounded-[10px] p-5 text-center transition-colors ${selected === pkg.amount ? 'border-primary ring-2 ring-primary/20' : 'border-border-light hover:border-border-hover'}`}>
              <span className="absolute top-2 right-2 text-[10px] font-bold text-primary">+{Math.round((pkg.bonus / pkg.amount) * 100)}%</span>
              <p className="text-2xl font-bold text-white">${pkg.amount}</p>
              <p className="text-xs text-text-muted mt-1">+${pkg.bonus} bonus</p>
            </button>
          ))}
        </div>
        {selected && <button className="btn-primary mt-4 text-sm py-2.5 px-6">Pay ${selected}</button>}
      </div>
      <div>
        <SectionTitle>Transaction History</SectionTitle>
        <div className="bg-surface border border-border-light rounded-[10px] overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-light text-text-muted text-xs">
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Type</th>
              <th className="text-right px-4 py-2.5 font-medium">Amount</th>
              <th className="text-right px-4 py-2.5 font-medium">Bonus</th>
              <th className="text-right px-4 py-2.5 font-medium">Method</th>
            </tr></thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t) => (
                <tr key={t.id} className="border-b border-border-light last:border-0">
                  <td className="px-4 py-2.5 text-text-secondary">{formatDate(t.date)}</td>
                  <td className="px-4 py-2.5 text-white">{t.type}</td>
                  <td className="px-4 py-2.5 text-right text-green-400 font-medium">+${t.amount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-text-secondary">{t.bonus > 0 ? `+$${t.bonus.toFixed(2)}` : '—'}</td>
                  <td className="px-4 py-2.5 text-right text-text-muted">{t.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab 6: Activity
   ═══════════════════════════════════════════ */

const ActivityTab = () => (
  <div className="space-y-8">
    <div><h2 className="text-xl font-bold text-white mb-2">Referral Program</h2></div>
    <div className="bg-surface border border-border-light rounded-[10px] p-6">
      <p className="text-text-muted text-sm mb-2">Your Referral Link</p>
      <div className="flex items-center gap-3">
        <code className="flex-1 text-sm font-mono text-white bg-body px-4 py-2.5 rounded-lg border border-border-light truncate">
          https://supremind.ai/ref/demo-user-123
        </code>
        <CopyButton text="https://supremind.ai/ref/demo-user-123" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[{ label: 'Total Invites', value: '12' }, { label: 'Completed', value: '7' }, { label: 'Rewards', value: '$35.00' }].map((s) => (
        <div key={s.label} className="bg-surface border border-border-light rounded-[10px] p-5 text-center">
          <p className="text-2xl font-bold text-white">{s.value}</p>
          <p className="text-xs text-text-muted mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════ */

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiHome },
  { id: 'logs', label: 'Call Logs', icon: FiList },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { id: 'apikey', label: 'API Keys', icon: FiKey },
  { id: 'billing', label: 'Billing', icon: FiDollarSign },
  { id: 'activity', label: 'Activity', icon: FiUsers },
];

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(TABS.find((t) => t.id === initialTab) ? initialTab : 'overview');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-body">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border-light bg-surface min-h-[calc(100vh-64px)] sticky top-16">
          <div className="p-4 border-b border-border-light">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-light hover:text-white'
                  }`}>
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border-light flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  activeTab === tab.id ? 'text-primary' : 'text-text-muted'
                }`}>
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'logs' && <CallLogsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'apikey' && <APIKeyTab user={user} />}
            {activeTab === 'billing' && <BillingTab />}
            {activeTab === 'activity' && <ActivityTab />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
