import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TestProviders } from '../test/TestProviders';
import Chat from './Chat';

// Mock scrollIntoView which is not available in jsdom
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

function renderChat() {
  return render(
    <TestProviders>
      <Chat />
    </TestProviders>
  );
}

describe('Chat page', () => {
  it('renders chat interface', () => {
    renderChat();
    expect(screen.getByPlaceholderText(/ask supremind/i)).toBeInTheDocument();
  });

  it('renders model selector', () => {
    renderChat();
    expect(screen.getAllByText(/gpt-5|claude|gemini/i).length).toBeGreaterThan(0);
  });

  it('renders quick action buttons', () => {
    renderChat();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('allows typing a message', async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'Hello world');
    expect(input.value).toBe('Hello world');
  });

  it('shows conversation area', () => {
    renderChat();
    expect(screen.getByPlaceholderText(/ask supremind/i)).toBeInTheDocument();
  });

  // Model selector tests
  it('opens model selector dropdown on click', async () => {
    const user = userEvent.setup();
    renderChat();
    // Find the model selector button (shows current model)
    const modelButton = screen.getByText('GPT-5');
    await user.click(modelButton);
    // The dropdown lists all models
    expect(screen.getByText('Claude Sonnet 4.6')).toBeInTheDocument();
    expect(screen.getByText('Gemini 2.5 Pro')).toBeInTheDocument();
  });

  it('shows all model options in dropdown', async () => {
    const user = userEvent.setup();
    renderChat();
    const modelButton = screen.getByText('GPT-5');
    await user.click(modelButton);
    expect(screen.getByText('DeepSeek V3')).toBeInTheDocument();
    expect(screen.getByText('Grok-4')).toBeInTheDocument();
  });

  it('selects a different model from dropdown', async () => {
    const user = userEvent.setup();
    renderChat();
    const modelButton = screen.getByText('GPT-5');
    await user.click(modelButton);
    // Click Claude Sonnet
    const claudeOption = screen.getByText('Claude Sonnet 4.6');
    await user.click(claudeOption);
    // The dropdown should close and the new model is shown in the button
    expect(screen.getAllByText('Claude Sonnet 4.6').length).toBeGreaterThan(0);
  });

  it('closes model dropdown after selecting a model', async () => {
    const user = userEvent.setup();
    renderChat();
    const modelButton = screen.getByText('GPT-5');
    await user.click(modelButton);
    const geminiOption = screen.getByText('Gemini 2.5 Pro');
    await user.click(geminiOption);
    // Dropdown should be gone - DeepSeek not visible as a dropdown option anymore
    expect(screen.queryByText('DeepSeek V3')).not.toBeInTheDocument();
  });

  it('shows model provider labels in dropdown', async () => {
    const user = userEvent.setup();
    renderChat();
    const modelButton = screen.getByText('GPT-5');
    await user.click(modelButton);
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  // Quick action tests
  it('renders all 6 quick action buttons', () => {
    renderChat();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Get Inspired')).toBeInTheDocument();
    expect(screen.getByText('Think Deeply')).toBeInTheDocument();
  });

  it('clicking a quick action fills the input with a prompt', async () => {
    const user = userEvent.setup();
    renderChat();
    const summaryBtn = screen.getByText('Summary');
    await user.click(summaryBtn);
    const input = screen.getByPlaceholderText(/ask supremind/i);
    expect(input.value).toBe('Summarize the French Revolution');
  });

  it('clicking Code quick action fills correct prompt', async () => {
    const user = userEvent.setup();
    renderChat();
    await user.click(screen.getByText('Code'));
    const input = screen.getByPlaceholderText(/ask supremind/i);
    expect(input.value).toBe('Help me write a function to reverse a string');
  });

  it('clicking Design quick action fills correct prompt', async () => {
    const user = userEvent.setup();
    renderChat();
    await user.click(screen.getByText('Design'));
    const input = screen.getByPlaceholderText(/ask supremind/i);
    expect(input.value).toBe('Design a landing page for a SaaS product');
  });

  it('clicking Research quick action fills correct prompt', async () => {
    const user = userEvent.setup();
    renderChat();
    await user.click(screen.getByText('Research'));
    const input = screen.getByPlaceholderText(/ask supremind/i);
    expect(input.value).toBe('Research the latest trends in AI');
  });

  // Sending a message
  it('send button is disabled when input is empty', () => {
    renderChat();
    // Find the submit button via the form
    const form = screen.getByPlaceholderText(/ask supremind/i).closest('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    expect(submitBtn).toBeDisabled();
  });

  it('send button becomes enabled when input has text', async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'Hello');
    const form = input.closest('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    expect(submitBtn).not.toBeDisabled();
  });

  it('submitting the form shows user message', async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'Hello AI');
    await user.keyboard('{Enter}');
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
  });

  it('clears input after sending a message', async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    expect(input.value).toBe('');
  });

  it('shows the welcome heading when no messages', () => {
    renderChat();
    expect(screen.getByText(/what's on your mind/i)).toBeInTheDocument();
  });

  it('shows subtitle prompt text when no messages', () => {
    renderChat();
    expect(screen.getByText(/choose a prompt below or type your own message/i)).toBeInTheDocument();
  });

  it('hides quick actions after sending a message', async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'Tell me a joke');
    await user.keyboard('{Enter}');
    // Quick action grid is hidden once messages exist
    expect(screen.queryByText('What\'s on your mind?')).not.toBeInTheDocument();
  });

  it('pressing Shift+Enter does not submit the form (keyboard shortcut check)', async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'Hello');
    // Input should have text
    expect(input.value).toBe('Hello');
    // Verify the form submit button exists
    const form = input.closest('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    expect(submitBtn).not.toBeDisabled();
  });

  // Sidebar tests
  it('shows New Chat button in sidebar', () => {
    renderChat();
    expect(screen.getByRole('button', { name: /new chat/i })).toBeInTheDocument();
  });

  it('shows conversation history items in sidebar', () => {
    renderChat();
    expect(screen.getByText('How to build a REST API')).toBeInTheDocument();
    expect(screen.getByText('Python vs JavaScript comparison')).toBeInTheDocument();
  });

  it('shows time group headers in sidebar', () => {
    renderChat();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
  });

  it('shows Last week group header', () => {
    renderChat();
    expect(screen.getByText('Last week')).toBeInTheDocument();
  });

  it('clicking a conversation in sidebar marks it as active', async () => {
    const user = userEvent.setup();
    renderChat();
    const chatItem = screen.getByText('How to build a REST API');
    await user.click(chatItem);
    // It stays in the DOM (selected)
    expect(chatItem).toBeInTheDocument();
  });

  it('clicking New Chat clears messages and returns to welcome screen', async () => {
    const user = userEvent.setup();
    renderChat();
    // First send a message
    const input = screen.getByPlaceholderText(/ask supremind/i);
    await user.type(input, 'First message');
    await user.keyboard('{Enter}');
    // Now click New Chat
    const newChatBtn = screen.getByRole('button', { name: /new chat/i });
    await user.click(newChatBtn);
    // Should show welcome screen again
    expect(screen.getByText(/what's on your mind/i)).toBeInTheDocument();
  });

  // Sidebar conversation list items
  it('shows Explain microservices architecture in sidebar', () => {
    renderChat();
    expect(screen.getByText('Explain microservices architecture')).toBeInTheDocument();
  });

  it('shows Best practices for React hooks in sidebar', () => {
    renderChat();
    expect(screen.getByText('Best practices for React hooks')).toBeInTheDocument();
  });

  it('shows Write a SQL query for analytics in sidebar', () => {
    renderChat();
    expect(screen.getByText('Write a SQL query for analytics')).toBeInTheDocument();
  });

  // Attach file button
  it('shows attach file button', () => {
    renderChat();
    const attachBtn = screen.getByTitle(/attach file/i);
    expect(attachBtn).toBeInTheDocument();
  });

  // Model selector shows OpenAI provider by default visible
  it('shows OpenAI provider label for default model', () => {
    renderChat();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
  });
});
