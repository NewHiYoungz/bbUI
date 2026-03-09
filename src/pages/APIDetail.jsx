import React from 'react';
import { useParams } from 'react-router-dom';

const APIDetail = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">API Detail: {id}</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default APIDetail;
