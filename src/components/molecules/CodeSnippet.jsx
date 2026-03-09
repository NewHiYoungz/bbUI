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
