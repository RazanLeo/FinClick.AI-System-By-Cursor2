'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  Maximize2,
  X
} from 'lucide-react';
import { AnalysisResult, AnalysisCategory } from '@/lib/types';
import AnalysisCard from './AnalysisCard';
import DetailedAnalysis from './DetailedAnalysis';
import { ANALYSIS_CATEGORIES } from '@/lib/utils/constants';

interface AnalysisGridProps {
  results: AnalysisResult[];
  selectedCategory: string;
}

export default function AnalysisGrid({ results, selectedCategory }: AnalysisGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'category'>('category');
  const [filterRating, setFilterRating] = useState<string>('all');

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let filtered = results;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === filterRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'rating':
          const ratingOrder = { excellent: 5, veryGood: 4, good: 3, acceptable: 2, weak: 1 };
          return (ratingOrder[b.rating] || 0) - (ratingOrder[a.rating] || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, selectedCategory, searchTerm, filterRating, sortBy]);

  // Group by category
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: AnalysisResult[] } = {};
    
    filteredResults.forEach(result => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });

    return groups;
  }, [filteredResults]);

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-finclick-gold/60" />
              <input
                type="text"
                placeholder="البحث في التحليلات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control pr-10"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-4">
            <div className="select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="form-control"
              >
                <option value="category">ترتيب حسب الفئة</option>
                <option value="name">ترتيب حسب الاسم</option>
                <option value="rating">ترتيب حسب التقييم</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="select-wrapper">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="form-control"
              >
                <option value="all">جميع التقييمات</option>
                <option value="excellent">ممتاز</option>
                <option value="veryGood">جيد جداً</option>
                <option value="good">جيد</option>
                <option value="acceptable">مقبول</option>
                <option value="weak">ضعيف</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-finclick-gold/60">
            عرض {filteredResults.length} من أصل {results.length} تحليل
          </p>
          
          {selectedCategory !== 'all' && (
            <button
              onClick={() => window.location.href = '#all'}
              className="text-finclick-gold hover:text-finclick-gold-light"
            >
              إظهار الكل
            </button>
          )}
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="space-y-8">
        {Object.entries(groupedResults).map(([category, categoryResults]) => (
          <CategorySection
            key={category}
            category={category}
            results={categoryResults}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
            setSelectedAnalysis={setSelectedAnalysis}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-finclick-gold/60 text-lg">
            لم يتم العثور على نتائج للبحث
          </p>
        </div>
      )}

      {/* Detailed Analysis Modal */}
      <AnimatePresence>
        {selectedAnalysis && (
          <DetailedAnalysis
            analysis={selectedAnalysis}
            onClose={() => setSelectedAnalysis(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Category Section Component
function CategorySection({
  category,
  results,
  expandedCard,
  setExpandedCard,
  setSelectedAnalysis
}: {
  category: string;
  results: AnalysisResult[];
  expandedCard: string | null;
  setExpandedCard: (id: string | null) => void;
  setSelectedAnalysis: (analysis: AnalysisResult) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const categoryInfo = ANALYSIS_CATEGORIES[category as keyof typeof ANALYSIS_CATEGORIES];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Category Header */}
      <div 
        className="flex items-center justify-between p-4 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryInfo?.icon || '📊'}</span>
          <div>
            <h3 className="text-xl font-bold text-finclick-gold">
              {categoryInfo?.ar || category}
            </h3>
            <p className="text-sm text-finclick-gold/60">
              {results.length} تحليل
            </p>
          </div>
        </div>
        
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-finclick-gold" />
        ) : (
          <ChevronUp className="w-5 h-5 text-finclick-gold" />
        )}
      </div>

      {/* Analysis Cards */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {results.map(result => (
              <motion.div
                key={result.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={expandedCard === result.id ? 'col-span-full' : ''}
              >
                <AnalysisCard
                  result={result}
                  isExpanded={expandedCard === result.id}
                  onExpand={() => setExpandedCard(
                    expandedCard === result.id ? null : result.id
                  )}
                  onViewDetails={() => setSelectedAnalysis(result)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
