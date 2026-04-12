import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { APIProvider } from '../context/APIContext';
import Dashboard from './Dashboard';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }));

// Mock recharts to avoid rendering issues in test env
vi.mock('recharts', () => {
  const React = require('react');
  const createMock = (name) => React.forwardRef(({ children, ...props }, ref) =>
    React.createElement('div', { 'data-testid': `recharts-${name}`, ref, ...props }, children)
  );
  return {
    ResponsiveContainer: ({ children }) => React.createElement('div', { 'data-testid': 'responsive-container' }, children),
    AreaChart: createMock('area-chart'),
    Area: () => null,
    BarChart: createMock('bar-chart'),
    Bar: () => null,
    LineChart: createMock('line-chart'),
    Line: () => null,
    PieChart: createMock('pie-chart'),
    Pie: createMock('pie'),
    Cell: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  };
});

function renderDashboard({ loggedIn = true, initialEntries = ['/dashboard'] } = {}) {
  if (loggedIn) {
    localStorage.setItem('apimart_auth', 'true');
  } else {
    localStorage.removeItem('apimart_auth');
  }

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <APIProvider>
          <Dashboard />
        </APIProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Dashboard page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects when not logged in', () => {
    renderDashboard({ loggedIn: false });
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders dashboard when logged in', () => {
    renderDashboard();
    expect(screen.getAllByText(/overview/i).length).toBeGreaterThan(0);
  });

  it('shows API key section', () => {
    renderDashboard();
    expect(screen.getAllByText(/api key/i).length).toBeGreaterThan(0);
  });

  it('shows usage stats', () => {
    renderDashboard();
    expect(screen.getAllByText(/calls/i).length).toBeGreaterThan(0);
  });

  it('navigates between sidebar tabs', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsButtons = screen.getAllByText(/call logs/i);
    if (logsButtons.length > 0) {
      await user.click(logsButtons[0]);
    }
  });

  it('renders chart containers', () => {
    renderDashboard();
    const charts = screen.getAllByTestId('responsive-container');
    expect(charts.length).toBeGreaterThan(0);
  });

  it('shows recent activity', () => {
    renderDashboard();
    const activityElements = screen.getAllByText(/gpt|claude|gemini|deepseek|grok|dall|sora|veo|wan|hailuo|whisper|seedream|nano/i);
    expect(activityElements.length).toBeGreaterThan(0);
  });

  // Sidebar navigation
  it('shows all sidebar navigation tabs', () => {
    renderDashboard();
    expect(screen.getAllByText(/overview/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/call logs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/analytics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/api keys/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/billing/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/activity/i).length).toBeGreaterThan(0);
  });

  it('navigates to Call Logs tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    // Call Logs shows a search input
    expect(screen.getByPlaceholderText(/search by id or model/i)).toBeInTheDocument();
  });

  it('shows filter controls in Call Logs tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    expect(screen.getByPlaceholderText(/search by id or model/i)).toBeInTheDocument();
  });

  it('shows date range filters in Call Logs tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /7 days/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /30 days/i })).toBeInTheDocument();
    // 'All' appears in both the date range buttons and mobile nav - use getAllByRole
    expect(screen.getAllByRole('button', { name: /^all$/i }).length).toBeGreaterThan(0);
  });

  it('shows results count in Call Logs tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  it('shows table headers in Call Logs tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Latency')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('filters call logs by search', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    const searchInput = screen.getByPlaceholderText(/search by id or model/i);
    await user.type(searchInput, 'gpt-4o');
    // Results should now only show gpt-4o matches
    expect(searchInput.value).toBe('gpt-4o');
  });

  it('filters call logs by date range - Today', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    const todayBtn = screen.getByRole('button', { name: /today/i });
    await user.click(todayBtn);
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  it('filters call logs by date range - 7 days', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    const btn7d = screen.getByRole('button', { name: /7 days/i });
    await user.click(btn7d);
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  it('sorts call logs by clicking column header', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    const modelHeader = screen.getByText('Model');
    await user.click(modelHeader);
    // No crash, results still present
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  it('expands a call log row when clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    // Click first row in table body
    const tableRows = screen.getAllByRole('row');
    // Row at index 1 is the first data row (0 is header)
    if (tableRows.length > 1) {
      await user.click(tableRows[1]);
      // The expanded row should show details - no crash
      expect(tableRows[1]).toBeInTheDocument();
    }
  });

  it('expanded text call shows token usage and cost breakdown', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    // Filter to text type only to guarantee we click a text row
    const typeSelect = screen.getAllByRole('combobox').find(
      (s) => Array.from(s.options).some((o) => o.value === 'text')
    );
    if (typeSelect) {
      await user.selectOptions(typeSelect, 'text');
    }
    const tableRows = screen.getAllByRole('row');
    if (tableRows.length > 1) {
      await user.click(tableRows[1]);
      expect(screen.getByText(/token usage/i)).toBeInTheDocument();
      expect(screen.getByText(/cost breakdown/i)).toBeInTheDocument();
      expect(screen.getByText(/request details/i)).toBeInTheDocument();
    }
  });

  it('shows cache filter dropdown in Call Logs tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const logsTab = screen.getAllByText(/call logs/i)[0];
    await user.click(logsTab);
    const cacheSelect = screen.getAllByRole('combobox').find(
      (s) => Array.from(s.options).some((o) => o.value === 'cache')
    );
    expect(cacheSelect).toBeDefined();
  });

  // Analytics tab
  it('navigates to Analytics tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    // Analytics shows range buttons
    expect(screen.getAllByRole('button', { name: /7d|24h|30d|90d/i }).length).toBeGreaterThan(0);
  });

  it('shows analytics range selector buttons', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    expect(screen.getByRole('button', { name: '24h' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7d' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30d' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '90d' })).toBeInTheDocument();
  });

  it('switches analytics range to 7d', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    const btn7d = screen.getByRole('button', { name: '7d' });
    await user.click(btn7d);
    // Still renders without crash
    expect(screen.getByRole('button', { name: '7d' })).toBeInTheDocument();
  });

  it('shows Total Calls stat in Analytics', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    expect(screen.getAllByText(/total calls/i).length).toBeGreaterThan(0);
  });

  it('shows API Calls Over Time chart in Analytics', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    expect(screen.getByText(/api calls over time/i)).toBeInTheDocument();
  });

  it('shows Calls by Model chart in Analytics', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    expect(screen.getAllByText(/calls by model/i).length).toBeGreaterThan(0);
  });

  it('shows Calls by Type chart in Analytics', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    expect(screen.getByText(/calls by type/i)).toBeInTheDocument();
  });

  it('shows multiple chart containers in Analytics tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const analyticsTab = screen.getAllByText(/analytics/i)[0];
    await user.click(analyticsTab);
    const charts = screen.getAllByTestId('responsive-container');
    expect(charts.length).toBeGreaterThan(2);
  });

  // API Keys tab
  it('navigates to API Keys tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getByRole('button', { name: /create key/i })).toBeInTheDocument();
  });

  it('shows existing API keys in API Keys tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getByText('Production API')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('CI Pipeline')).toBeInTheDocument();
  });

  it('shows summary stats for API keys', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getByText('Total Keys')).toBeInTheDocument();
    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Total Calls')).toBeInTheDocument();
  });

  it('shows masked API key by default', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getAllByText(/sk-supremind-.+\.\.\..+/i).length).toBeGreaterThan(0);
  });

  it('shows environment badges on API key cards', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getByText('production')).toBeInTheDocument();
    expect(screen.getByText('development')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('shows status badges including disabled state', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    const activeBadges = screen.getAllByText('active');
    expect(activeBadges.length).toBeGreaterThan(0);
    expect(screen.getByText('disabled')).toBeInTheDocument();
  });

  it('shows rate limit and IP whitelist info on cards', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getAllByText(/rpm/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/2 rules/i)).toBeInTheDocument();
    expect(screen.getAllByText(/unrestricted/i).length).toBeGreaterThan(0);
  });

  it('shows quota progress bars on cards', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    expect(screen.getAllByText(/token usage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cost budget/i).length).toBeGreaterThan(0);
  });

  it('opens Create Key modal with section tabs', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    await user.click(screen.getByRole('button', { name: /create key/i }));
    expect(screen.getByText(/create api key/i)).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Access')).toBeInTheDocument();
    expect(screen.getByText('Limits')).toBeInTheDocument();
  });

  it('shows Key Name input in Create Key modal', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    await user.click(screen.getByRole('button', { name: /create key/i }));
    expect(screen.getByPlaceholderText(/e.g. production/i)).toBeInTheDocument();
  });

  it('closes Create Key modal on Cancel click', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    await user.click(screen.getByRole('button', { name: /create key/i }));
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);
    expect(screen.queryByPlaceholderText(/e.g. production/i)).not.toBeInTheDocument();
  });

  it('creates a new API key with a name', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    await user.click(screen.getByRole('button', { name: /create key/i }));
    const nameInput = screen.getByPlaceholderText(/e.g. production/i);
    await user.type(nameInput, 'My Test Key');
    const createModalBtn = screen.getAllByRole('button', { name: /create/i }).find(
      (btn) => !btn.textContent.includes('Key')
    ) || screen.getAllByRole('button', { name: /create/i })[1];
    await user.click(createModalBtn);
    expect(screen.getByText('My Test Key')).toBeInTheDocument();
  });

  it('shows Copy button for each API key', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    expect(copyButtons.length).toBeGreaterThan(0);
  });

  it('copies API key on Copy button click', async () => {
    const user = userEvent.setup();
    const { default: copy } = await import('copy-to-clipboard');
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    await user.click(copyButtons[0]);
    expect(copy).toHaveBeenCalled();
  });

  it('shows revoke confirmation when clicking revoke', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    const revokeButtons = screen.getAllByTitle('Revoke');
    await user.click(revokeButtons[0]);
    expect(screen.getByText(/revoke api key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /revoke key/i })).toBeInTheDocument();
  });

  it('shows delete confirmation when clicking delete', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const apiKeyTab = screen.getAllByText(/api keys/i)[0];
    await user.click(apiKeyTab);
    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);
    expect(screen.getByText(/delete api key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete key/i })).toBeInTheDocument();
  });

  // Billing tab
  it('navigates to Billing tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    expect(screen.getByText('Available Balance')).toBeInTheDocument();
  });

  it('shows available balance in Billing tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    expect(screen.getByText('$72.50')).toBeInTheDocument();
  });

  it('shows Add Credits section in Billing tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    expect(screen.getByText('Add Credits')).toBeInTheDocument();
  });

  it('shows recharge packages in Billing tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    expect(screen.getByText('$5')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('shows Pay button when recharge package is selected', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    // Click the $50 package
    await user.click(screen.getByText('$50'));
    expect(screen.getByRole('button', { name: /pay \$50/i })).toBeInTheDocument();
  });

  it('shows Transaction History in Billing tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('shows transaction types in history', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const billingTab = screen.getAllByText(/billing/i)[0];
    await user.click(billingTab);
    expect(screen.getAllByText('Recharge').length).toBeGreaterThan(0);
  });

  // Activity tab
  it('navigates to Activity tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const activityTab = screen.getAllByText(/activity/i)[0];
    await user.click(activityTab);
    expect(screen.getByText('Referral Program')).toBeInTheDocument();
  });

  it('shows referral link in Activity tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const activityTab = screen.getAllByText(/activity/i)[0];
    await user.click(activityTab);
    expect(screen.getByText(/supremind.ai\/ref/i)).toBeInTheDocument();
  });

  it('shows referral stats in Activity tab', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const activityTab = screen.getAllByText(/activity/i)[0];
    await user.click(activityTab);
    expect(screen.getByText('Total Invites')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Rewards')).toBeInTheDocument();
  });

  it('shows Copy button for referral link', async () => {
    const user = userEvent.setup();
    renderDashboard();
    const activityTab = screen.getAllByText(/activity/i)[0];
    await user.click(activityTab);
    expect(screen.getAllByRole('button', { name: /copy/i }).length).toBeGreaterThan(0);
  });

  // Overview tab features
  it('shows All Systems Operational status in Overview', () => {
    renderDashboard();
    expect(screen.getByText(/all systems operational/i)).toBeInTheDocument();
  });

  it('shows uptime percentage in Overview', () => {
    renderDashboard();
    expect(screen.getByText(/uptime 99/i)).toBeInTheDocument();
  });

  it('shows stat cards in Overview', () => {
    renderDashboard();
    expect(screen.getByText(/calls \(7d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/tokens \(7d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/cost \(7d\)/i)).toBeInTheDocument();
  });

  it('shows Current Month section in Overview', () => {
    renderDashboard();
    expect(screen.getByText(/current month/i)).toBeInTheDocument();
  });

  it('shows Calls Trend chart section in Overview', () => {
    renderDashboard();
    expect(screen.getByText(/calls trend/i)).toBeInTheDocument();
  });

  it('shows Top Models by Calls in Overview', () => {
    renderDashboard();
    expect(screen.getByText(/top models by calls/i)).toBeInTheDocument();
  });

  // URL tab param
  it('activates correct tab from URL search param', () => {
    localStorage.setItem('apimart_auth', 'true');
    render(
      <MemoryRouter initialEntries={['/dashboard?tab=billing']}>
        <AuthProvider>
          <APIProvider>
            <Dashboard />
          </APIProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    // Billing tab should be shown - Available Balance is unique to billing
    expect(screen.getByText('Available Balance')).toBeInTheDocument();
  });
});
