import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { APIProvider, AuthProvider } from '../context';

export function TestProviders({ children, initialEntries = ['/'] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <APIProvider>
          {children}
        </APIProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
