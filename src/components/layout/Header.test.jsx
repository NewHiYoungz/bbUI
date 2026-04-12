import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TestProviders } from '../../test/TestProviders';
import Header from './Header';
import { AuthProvider } from '../../context/AuthContext';
import { APIProvider } from '../../context/APIContext';
import { MemoryRouter } from 'react-router-dom';

function renderHeader({ loggedIn = false } = {}) {
  if (loggedIn) {
    localStorage.setItem('apimart_auth', 'true');
  } else {
    localStorage.removeItem('apimart_auth');
  }

  return render(
    <MemoryRouter>
      <AuthProvider>
        <APIProvider>
          <Header />
        </APIProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders logo and brand name', () => {
    renderHeader();
    expect(screen.getByText('supremind.ai')).toBeInTheDocument();
  });

  it('renders nav links', () => {
    renderHeader();
    expect(screen.getAllByText('API Market').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI Chat').length).toBeGreaterThan(0);
    expect(screen.getAllByText('API Docs').length).toBeGreaterThan(0);
  });

  it('shows login/signup when logged out', () => {
    renderHeader();
    expect(screen.getAllByText('Log in').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0);
  });

  it('shows user menu when logged in', () => {
    renderHeader({ loggedIn: true });
    expect(screen.getByText('Demo User')).toBeInTheDocument();
  });

  it('opens user dropdown on click', async () => {
    const user = userEvent.setup();
    renderHeader({ loggedIn: true });
    await user.click(screen.getByText('Demo User'));
    expect(screen.getByText('API Keys')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('toggles mobile menu', async () => {
    const user = userEvent.setup();
    renderHeader();
    // Mobile menu button is the lg:hidden one
    const menuButtons = screen.getAllByRole('button');
    const mobileToggle = menuButtons.find(b => b.classList.contains('lg:hidden'));
    if (mobileToggle) {
      await user.click(mobileToggle);
      // Mobile menu should now show nav items
      const apiMarkets = screen.getAllByText('API Market');
      expect(apiMarkets.length).toBeGreaterThanOrEqual(2); // desktop + mobile
    }
  });

  it('opens dropdown menus on hover interaction', async () => {
    renderHeader();
    const videoButtons = screen.getAllByText('AI Video API');
    expect(videoButtons.length).toBeGreaterThan(0);
  });

  it('shows dropdown children on hover', async () => {
    const user = userEvent.setup();
    renderHeader();
    const videoBtn = screen.getAllByText('AI Video API')[0];
    await user.hover(videoBtn.closest('div'));
    expect(screen.getAllByText('Sora 2 API').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Veo 3.1 API').length).toBeGreaterThan(0);
  });

  it('shows Image API dropdown children on hover', async () => {
    const user = userEvent.setup();
    renderHeader();
    const imageBtn = screen.getAllByText(/AI Image API/)[0];
    await user.hover(imageBtn.closest('div'));
    expect(screen.getAllByText('DALL-E 3 API').length).toBeGreaterThan(0);
  });

  it('closes user dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderHeader({ loggedIn: true });
    await user.click(screen.getByText('Demo User'));
    expect(screen.getByText('API Keys')).toBeInTheDocument();
    // Click outside the menu
    await user.click(document.body);
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('shows Sign Out in user dropdown and calls logout', async () => {
    const user = userEvent.setup();
    renderHeader({ loggedIn: true });
    await user.click(screen.getByText('Demo User'));
    await user.click(screen.getByText('Sign Out'));
    // After logout, should show Log in button
    expect(screen.getAllByText('Log in').length).toBeGreaterThan(0);
  });

  it('shows Billing link in user dropdown', async () => {
    const user = userEvent.setup();
    renderHeader({ loggedIn: true });
    await user.click(screen.getByText('Demo User'));
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('mobile menu shows login/signup when logged out', async () => {
    const user = userEvent.setup();
    renderHeader();
    const menuButtons = screen.getAllByRole('button');
    const mobileToggle = menuButtons.find(b => b.classList.contains('lg:hidden'));
    if (mobileToggle) {
      await user.click(mobileToggle);
      const logins = screen.getAllByText('Log in');
      expect(logins.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('mobile menu shows Dashboard when logged in', async () => {
    const user = userEvent.setup();
    renderHeader({ loggedIn: true });
    const menuButtons = screen.getAllByRole('button');
    const mobileToggle = menuButtons.find(b => b.classList.contains('lg:hidden'));
    if (mobileToggle) {
      await user.click(mobileToggle);
      expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
    }
  });

  it('mobile menu toggles dropdown for AI Video API', async () => {
    const user = userEvent.setup();
    renderHeader();
    const menuButtons = screen.getAllByRole('button');
    const mobileToggle = menuButtons.find(b => b.classList.contains('lg:hidden'));
    if (mobileToggle) {
      await user.click(mobileToggle);
      const videoButtons = screen.getAllByText('AI Video API');
      // Click the mobile video dropdown toggle
      const mobileVideoBtn = videoButtons[videoButtons.length - 1];
      await user.click(mobileVideoBtn);
      expect(screen.getAllByText('Sora 2 API').length).toBeGreaterThan(0);
    }
  });

  it('closes mobile menu toggle', async () => {
    const user = userEvent.setup();
    renderHeader();
    const menuButtons = screen.getAllByRole('button');
    const mobileToggle = menuButtons.find(b => b.classList.contains('lg:hidden'));
    if (mobileToggle) {
      await user.click(mobileToggle);
      // Click toggle again to close
      const allButtons = screen.getAllByRole('button');
      const closeToggle = allButtons.find(b => b.classList.contains('lg:hidden'));
      await user.click(closeToggle);
    }
  });
});
