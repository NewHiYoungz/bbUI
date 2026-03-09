import { APIProvider } from './context';
import { APICard } from './components/molecules';
import { mockAPIs } from './data/mockAPIs';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <APIProvider>
        <div className="min-h-screen bg-gray-50 p-8">
          <h1 className="text-4xl font-bold text-primary mb-8">
            API Cards Test
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAPIs.slice(0, 3).map(api => (
              <APICard key={api.id} api={api} />
            ))}
          </div>
        </div>
      </APIProvider>
    </BrowserRouter>
  );
}

export default App
