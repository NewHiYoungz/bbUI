import { Button } from './components/atoms';

function App() {
  return (
    <div className="min-h-screen bg-white p-8 space-y-4">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Component Testing
      </h1>
      <div className="space-x-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="accent">Accent Button</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </div>
  );
}

export default App
