import { Button, Input } from './components/atoms';
import { FiSearch } from 'react-icons/fi';

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
      <div className="space-y-4 max-w-md">
        <Input placeholder="Enter text..." />
        <Input placeholder="Search..." icon={<FiSearch />} />
      </div>
    </div>
  );
}

export default App
