import React from 'react';
import { Card, Badge } from '../atoms';
import { useNavigate } from 'react-router-dom';

const APICard = ({ api }) => {
  const navigate = useNavigate();

  const getPriceDisplay = () => {
    const { pricing } = api;
    if (pricing.input) {
      return `$${pricing.input}/${pricing.unit}`;
    }
    if (pricing.standard) {
      return `$${pricing.standard}/${pricing.unit}`;
    }
    if (pricing.rate) {
      return `$${pricing.rate}/${pricing.unit}`;
    }
    return 'Contact us';
  };

  return (
    <Card hover onClick={() => navigate(`/api/${api.id}`)} className="h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-text-dark">{api.name}</h3>
        <div className="flex gap-2">
          {api.popular && <Badge variant="accent">Popular</Badge>}
          {api.new && <Badge variant="primary">New</Badge>}
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-2">{api.provider}</p>

      <p className="text-sm text-text-dark mb-4 line-clamp-2">
        {api.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {api.category.map((cat, idx) => (
          <Badge key={idx} variant="default">{cat}</Badge>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border-light">
        <span className="text-sm text-text-secondary">Starting at</span>
        <span className="text-lg font-bold text-primary">{getPriceDisplay()}</span>
      </div>
    </Card>
  );
};

export default APICard;
