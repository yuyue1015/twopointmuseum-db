'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Layers,
  Sparkles,
  Hash,
  Star,
  Info
} from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 工具函数 ================= */

const getCategoryStyles = (category: string) => {
  const cat = category?.trim();
  const base = "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm";
  if (cat === '史前') return `${base} bg-amber-50 text-amber-700 border-amber-200`;
  if (cat === '自然' || cat === '野生动物') return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
  if (cat === '超自然') return `${base} bg-purple-50 text-purple-700 border-purple-200`;
  if (cat === '太空') return `${base} bg-blue-50 text-blue-700 border-blue-200`;
  if (cat === '奇幻') return `${base} bg-pink-50 text-pink-700 border-pink-200`;
  return `${base} bg-slate-50 text-slate-600 border-slate-200`;
};

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-blue-100 text-blue-700 font-medium px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/* ================= 页面组件 ================= */

export default function MuseumSearchApp() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'source' | 'traits'>('name');

  const filteredExhibits = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    
    // 💡 修复显示问题：如果不输入内容，返回空数组
    if (!lowerQuery) return [];

    return EXHIBITS_DATA.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const category = item.category?.toLowerCase() || '';
      const subcategory = item.subcategory?.toLowerCase() || '';
      const source = item.source?.toLowerCase() || '';

      switch (searchType) {
        case 'name': return name.includes(lowerQuery);
        case 'category': return category.includes(lowerQuery) || subcategory.includes(lowerQuery);
        case 'source': return source.includes(lowerQuery);
        case 'traits': return item.traits?.some(t => t.toLowerCase().includes(lowerQuery));
        default: return false;
      }
    });
  }, [query, searchType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 标题 */}
        <header className="text-center py-16">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <Sparkles className="text-blue-600 ml-2" size={20} />
            <span className="px-3 font-bold text-slate-500 uppercase tracking-widest text-xs">Two Point Archive</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500">已收录 {EXHIBITS_DATA.length} 件奇珍异宝</p>
        </header>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
            <select
              className="px-4 py-3 rounded-xl bg-slate-50 font-bold text-slate-700 outline-none"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
            >
              <option value="name">展品名</option>
              <option value="category">类别</option>
              <option value="traits">特性</option>
              <option value="source">来源</option>
            </select>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                className="w-full pl-12 pr-4 py-3 rounded-xl text-lg outline-none"
                placeholder="输入关键词开始探索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 结果区域 */}
        <main className="max-w-6xl mx-auto">
          {!query.trim() ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
              <Info className="mx-auto mb-4 text-slate-300" size={48} />
              <p className="text-slate-400 font-medium">在上方搜索框输入，开启考古之旅</p>
            </div>
          ) : filteredExhibits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExhibits.map((item) => (
                <ExhibitCard key={item.id} data={item} keyword={query} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">没有找到匹配的展品，换个词试试？</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= 修复后的卡片组件 ================= */

function ExhibitCard({ data, keyword }: { data: Exhibit; keyword: string }) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className={getCategoryStyles(data.category)}>
          {data.category}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <MapPin size={10} />
          {data.source || '未知'}
        </div>
      </div>

      <h3 className="text-lg font-black text-slate-800 mb-1">
        {highlightText(data.name, keyword)}
      </h3>
      
      <div className="text-xs font-bold text-blue-500 mb-4 bg-blue-50 px-2 py-0.5 rounded self-start">
        {data.subcategory}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {data.traits?.map((trait, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">
            <Hash size={8} />
            {highlightText(trait, keyword)}
          </span>
        ))}
      </div>

      {/* 💡 这里是之前报错的修复点：使用了正确的 {} 包裹 className 表达式 */}
      <div className="mt-auto relative w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
         <Layers className="text-slate-200 group-hover:text-blue-200 transition-transform" size={40} />
         <Star className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100" size={14} fill="currentColor" />
      </div>
    </div>
  );
}
