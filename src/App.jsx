import { Button, Input, Badge, Card } from './components/atoms';
import { FiSearch } from 'react-icons/fi';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-4">
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
      <div className="space-x-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <Card>
          <h3 className="text-lg font-bold mb-2">Regular Card</h3>
          <p className="text-text-secondary">This is a standard card component.</p>
        </Card>
        <Card hover>
          <h3 className="text-lg font-bold mb-2">Hover Card</h3>
          <p className="text-text-secondary">This card has hover effects.</p>
        </Card>
      </div>
    </div>
  );
}

export default App
