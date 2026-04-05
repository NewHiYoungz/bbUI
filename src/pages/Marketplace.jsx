import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiGrid,
  FiList,
  FiChevronDown,
  FiZap,
  FiStar,
  FiArrowRight,
  FiX,
  FiType,
  FiImage,
  FiVideo,
  FiMusic,
} from 'react-icons/fi';
import { useAPI } from '../context';

const TYPE_TABS = [
  { key: 'all', label: 'All', icon: FiGrid },
  { key: 'text', label: 'Text', icon: FiType },
  { key: 'image', label: 'Image', icon: FiImage },
  { key: 'video', label: 'Video', icon: FiVideo },
  { key: 'audio', label: 'Audio', icon: FiMusic },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

function getPriceDisplay(pricing) {
  if (pricing.input) return `$${pricing.input}/${pricing.unit}`;
  if (pricing.standard) return `$${pricing.standard}/${pricing.unit}`;
  if (pricing.rate) return `$${pricing.rate}/${pricing.unit}`;
  return 'Contact us';
}

function getTypeBadgeStyle(type) {
  const styles = {
    text: 'bg-blue-50 text-blue-600',
    image: 'bg-emerald-50 text-emerald-600',
    video: 'bg-violet-50 text-violet-600',
    audio: 'bg-amber-50 text-amber-600',
  };
  return styles[type] || 'bg-gray-100 text-text-dark';
}

const Marketplace = () => {
  const navigate = useNavigate();
  const {
    filteredAPIs,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    clearFilters,
  } = useAPI();

  const [viewMode, setViewMode] = useState('card');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOpen, setSortOpen] = useState(false);

  // Apply local type filter on top of context-provided filteredAPIs
  const displayedAPIs = useMemo(() => {
    if (typeFilter === 'all') return filteredAPIs;
    return filteredAPIs.filter((api) => api.type === typeFilter);
  }, [filteredAPIs, typeFilter]);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sortBy) || SORT_OPTIONS[0];

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || sortBy !== 'default';

  function handleClearAll() {
    clearFilters();
    setTypeFilter('all');
    setSortBy('default');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="bg-bg-subtle border-b border-border-light">
        <div className="section-container py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            Explore AI Models
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Access 500+ AI models from top providers through a single, unified API.
            Find the perfect model for text, image, video, and audio generation.
          </p>

          {/* Hero search */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search models by name or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-border-light rounded-[10px] bg-white
                         text-text-dark placeholder:text-text-secondary
                         focus:outline-none focus:border-primary transition-colors duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-dark transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter / Sort Bar ── */}
      <section className="sticky top-0 z-20 bg-white border-b border-border-light">
        <div className="section-container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Type filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
              {TYPE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = typeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setTypeFilter(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium
                               whitespace-nowrap transition-all duration-200
                               ${
                                 isActive
                                   ? 'bg-primary text-white'
                                   : 'text-text-secondary hover:text-text-dark hover:bg-bg-subtle'
                               }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-border-light rounded-[10px]
                             text-sm font-medium text-text-dark hover:border-primary transition-colors duration-200"
                >
                  Sort: {activeSort.label}
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSortOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border-2 border-border-light rounded-[10px] shadow-dropdown z-20 py-1">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                     ${
                                       sortBy === option.value
                                         ? 'text-primary font-semibold bg-primary/5'
                                         : 'text-text-dark hover:bg-bg-subtle'
                                     }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center border-2 border-border-light rounded-[10px] overflow-hidden">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === 'card'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-dark'
                  }`}
                  title="Card view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-dark'
                  }`}
                  title="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Area ── */}
      <section className="section-container py-8">
        {/* Results count and clear */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-secondary">
            Showing{' '}
            <span className="font-semibold text-text-dark">{displayedAPIs.length}</span>{' '}
            {displayedAPIs.length === 1 ? 'model' : 'models'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* ── Empty State ── */}
        {displayedAPIs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-7 h-7 text-text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-2">No models found</h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              We couldn't find any models matching your current filters. Try adjusting
              your search or clearing filters.
            </p>
            <button onClick={handleClearAll} className="btn-primary">
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Card View ── */}
        {displayedAPIs.length > 0 && viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAPIs.map((api, index) => (
              <div
                key={api.id}
                onClick={() => navigate(`/api/${api.id}`)}
                className="card-hover flex flex-col animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-dark truncate">
                      {api.name}
                    </h3>
                    <p className="text-sm text-text-secondary">{api.provider}</p>
                  </div>
                  <span
                    className={`ml-3 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeStyle(api.type)}`}
                  >
                    {api.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-text-dark leading-relaxed mb-4 line-clamp-2 flex-1">
                  {api.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {api.popular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      <FiStar className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                  {api.new && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <FiZap className="w-3 h-3" />
                      New
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border-light mt-auto">
                  <div>
                    <p className="text-xs text-text-secondary">Starting at</p>
                    <p className="text-lg font-bold text-primary">
                      {getPriceDisplay(api.pricing)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all duration-200">
                    Try it
                    <FiArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {displayedAPIs.length > 0 && viewMode === 'list' && (
          <div className="border-2 border-border-light rounded-[10px] overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-bg-subtle border-b border-border-light text-xs font-semibold text-text-secondary uppercase tracking-wide">
              <div className="col-span-3">Model</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Tags</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1" />
            </div>

            {/* Rows */}
            {displayedAPIs.map((api, index) => (
              <div
                key={api.id}
                onClick={() => navigate(`/api/${api.id}`)}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 cursor-pointer
                           hover:bg-bg-subtle transition-colors duration-150
                           animate-fade-up
                           ${index < displayedAPIs.length - 1 ? 'border-b border-border-light' : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Model name + provider */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-text-dark truncate">
                      {api.name}
                    </h3>
                    <p className="text-xs text-text-secondary">{api.provider}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-4 flex items-center">
                  <p className="text-sm text-text-dark line-clamp-1">
                    {api.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="md:col-span-2 flex items-center flex-wrap gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeBadgeStyle(api.type)}`}
                  >
                    {api.type}
                  </span>
                  {api.popular && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      Popular
                    </span>
                  )}
                  {api.new && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      New
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="md:col-span-2 flex items-center">
                  <span className="text-sm font-bold text-primary">
                    {getPriceDisplay(api.pricing)}
                  </span>
                </div>

                {/* Action */}
                <div className="md:col-span-1 flex items-center justify-end">
                  <FiArrowRight className="w-4 h-4 text-text-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;
