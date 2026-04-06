import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiSend,
  FiPaperclip,
  FiPlus,
  FiMessageSquare,
  FiChevronDown,
  FiMenu,
  FiX,
  FiFileText,
  FiCode,
  FiLayout,
  FiSearch,
  FiStar,
  FiCpu,
} from 'react-icons/fi';

const MODELS = [
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI' },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', provider: 'Google' },
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek' },
  { id: 'grok-4', name: 'Grok-4', provider: 'xAI' },
];

const QUICK_ACTIONS = [
  { label: 'Summary', prompt: 'Summarize the French Revolution', icon: FiFileText },
  { label: 'Code', prompt: 'Help me write a function to reverse a string', icon: FiCode },
  { label: 'Design', prompt: 'Design a landing page for a SaaS product', icon: FiLayout },
  { label: 'Research', prompt: 'Research the latest trends in AI', icon: FiSearch },
  { label: 'Get Inspired', prompt: 'Give me creative ideas for a blog post', icon: FiStar },
  { label: 'Think Deeply', prompt: 'Analyze the ethics of artificial intelligence', icon: FiCpu },
];

const MOCK_HISTORY = [
  { id: 1, title: 'How to build a REST API', timestamp: 'Today' },
  { id: 2, title: 'Python vs JavaScript comparison', timestamp: 'Today' },
  { id: 3, title: 'Explain microservices architecture', timestamp: 'Yesterday' },
  { id: 4, title: 'Best practices for React hooks', timestamp: 'Yesterday' },
  { id: 5, title: 'Write a SQL query for analytics', timestamp: 'Last week' },
];

const ModelSelector = ({ selectedModel, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[10px] border border-border-light bg-surface hover:border-primary transition-colors"
      >
        <span className="w-5 h-5 bg-primary/15 rounded flex items-center justify-center text-[10px] font-bold text-primary">
          {current.name.charAt(0)}
        </span>
        <span className="text-white">{current.name}</span>
        <span className="text-text-muted text-xs hidden sm:inline">
          {current.provider}
        </span>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-surface rounded-[10px] border border-border-light shadow-dropdown py-2 z-50">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onSelect(model.id);
                setOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                model.id === selectedModel
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-surface-light'
              }`}
            >
              <span className="w-6 h-6 bg-primary/15 rounded flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                {model.name.charAt(0)}
              </span>
              <div className="text-left">
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-text-muted">{model.provider}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TypingIndicator = ({ modelName }) => (
  <div className="flex items-start gap-3 max-w-3xl">
    <div className="w-7 h-7 bg-primary/15 rounded-[10px] flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
      {modelName.charAt(0)}
    </div>
    <div className="chat-bubble-ai px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const model = MODELS.find((m) => m.id === message.modelId);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-start gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : ''}`}
      >
        {!isUser && (
          <div className="w-7 h-7 bg-primary/15 rounded-[10px] flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
            {model?.name.charAt(0) || 'A'}
          </div>
        )}
        <div>
          {!isUser && (
            <span className="text-xs text-text-muted font-medium mb-1 block">
              {model?.name || 'AI'}
            </span>
          )}
          <div
            className={`px-4 py-3 text-sm leading-relaxed ${
              isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, onNewChat, history, activeChat, onSelectChat }) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />
    )}

    <aside
      className={`fixed top-16 left-0 bottom-0 w-[280px] bg-surface border-r border-border-light z-50 flex flex-col transition-transform duration-200
        lg:relative lg:top-0 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="p-4 border-b border-border-light">
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-[10px] border border-border-light text-text-secondary hover:border-primary hover:text-primary transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {history.map((chat, index) => {
          const showGroup = index === 0 || history[index - 1].timestamp !== chat.timestamp;
          return (
            <React.Fragment key={chat.id}>
              {showGroup && (
                <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider px-3 pt-3 pb-1">
                  {chat.timestamp}
                </div>
              )}
              <button
                onClick={() => onSelectChat(chat.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-[10px] transition-colors text-left ${
                  activeChat === chat.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-light'
                }`}
              >
                <FiMessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  </>
);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-5');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const hasMessages = messages.length > 0;
  const currentModel = MODELS.find((m) => m.id === selectedModel);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: trimmed,
        modelId: selectedModel,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `This is a simulated response from ${currentModel.name}. In a real implementation, this would call the supremind.ai API.`,
          modelId: selectedModel,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    },
    [isTyping, selectedModel, currentModel]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
    setActiveChat(null);
    setSidebarOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div
      className="flex"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        history={MOCK_HISTORY}
        activeChat={activeChat}
        onSelectChat={(id) => {
          setActiveChat(id);
          setSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col bg-body min-w-0">
        <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border-light shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-text-secondary hover:bg-surface-light rounded-lg lg:hidden"
            >
              {sidebarOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
            <ModelSelector
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
              <div className="max-w-2xl w-full text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  What&apos;s on your mind?
                </h1>
                <p className="text-text-secondary mb-10">
                  Choose a prompt below or type your own message
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex flex-col items-center gap-2 p-4 bg-surface border border-border-light rounded-[10px] text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator modelName={currentModel.name} />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border-light bg-surface px-4 py-3">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2.5 text-text-muted hover:text-white hover:bg-surface-light rounded-[10px] transition-colors shrink-0"
              title="Attach file"
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask supremind.ai..."
              className="flex-1 px-4 py-2.5 text-sm bg-surface-light border border-border-light rounded-[10px] outline-none focus:border-primary transition-colors text-white placeholder:text-text-muted"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-primary text-white rounded-[10px] hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
