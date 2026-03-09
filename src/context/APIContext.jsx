import React, { createContext, useContext, useState, useMemo } from 'react';
import { mockAPIs, getAPIById, searchAPIs } from '../data/mockAPIs';

const APIContext = createContext();

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within APIProvider');
  }
  return context;
};

export const APIProvider = ({ children }) => {
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [providerFilter, setProviderFilter] = useState([]);
  const [sortBy, setSortBy] = useState('popular'); // popular, newest, price-low, price-high

  // Get filtered and sorted APIs
  const filteredAPIs = useMemo(() => {
    let apis = [...mockAPIs];

    // Apply search
    if (searchQuery) {
      apis = searchAPIs(searchQuery);
    }

    // Apply category filter
    if (categoryFilter.length > 0) {
      apis = apis.filter(api =>
        categoryFilter.some(cat => api.category.includes(cat))
      );
    }

    // Apply provider filter
    if (providerFilter.length > 0) {
      apis = apis.filter(api => providerFilter.includes(api.provider));
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        apis.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'newest':
        apis.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'price-low':
        apis.sort((a, b) => {
          const priceA = a.pricing.input || a.pricing.standard || a.pricing.rate || 0;
          const priceB = b.pricing.input || b.pricing.standard || b.pricing.rate || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        apis.sort((a, b) => {
          const priceA = a.pricing.input || a.pricing.standard || a.pricing.rate || 0;
          const priceB = b.pricing.input || b.pricing.standard || b.pricing.rate || 0;
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    return apis;
  }, [searchQuery, categoryFilter, providerFilter, sortBy]);

  const value = {
    apis: mockAPIs,
    filteredAPIs,
    selectedAPI,
    searchQuery,
    categoryFilter,
    providerFilter,
    sortBy,
    setSelectedAPI,
    setSearchQuery,
    setCategoryFilter,
    setProviderFilter,
    setSortBy,
    getAPIById: (id) => getAPIById(id),
    clearFilters: () => {
      setSearchQuery('');
      setCategoryFilter([]);
      setProviderFilter([]);
    },
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};
