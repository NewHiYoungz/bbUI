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

export default App
