// app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Zap, BookOpen, Flame, Tag, Layers } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data'; 

// 颜色映射工具
const getCategoryColor = (category: string) => {
  const cat = category?.trim(); // 防止空格导致的匹配失败
  if (cat === '史前') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (cat === '自然' || cat === '野生动物') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (cat === '超自然') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (cat === '太空') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (cat === '奇幻') return 'bg-pink-100 text-pink-800 border-pink-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function MuseumSearchApp() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'source' | 'traits'>('name');

  // 核心搜索逻辑
  const filteredExhibits = useMemo(() => {
    if (!query) return EXHIBITS_DATA;
    
    const lowerQuery = query.toLowerCase();

    return EXHIBITS_DATA.filter((item) => {
      // 容错处理：防止数据中有 undefined 导致报错
      const name = item.name?.toLowerCase() || '';
      const category = item.category?.toLowerCase() || '';
      const subcategory = item.subcategory?.toLowerCase() || '';
      const source = item.source?.toLowerCase() || '';
      
      switch (searchType) {
        case 'name':
          return name.includes(lowerQuery);
        case 'category':
          return category.includes(lowerQuery) || subcategory.includes(lowerQuery);
        case 'source':
          return source.includes(lowerQuery);
        case 'traits':
          return item.traits?.some(t => t.toLowerCase().includes(lowerQuery));
        default:
          return true;
      }
    });
  }, [query, searchType]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 标题区 */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text
