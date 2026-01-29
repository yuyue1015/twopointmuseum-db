'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Layers,
  Sparkles,
  Info,
  Hash,
  Star
} from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 增强型工具函数 ================= */

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
    ) : part
  );
}

/* ================= 页面组件 ================= */

export default function MuseumSearchApp() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'source' | 'traits'>('name');

  const filteredExhibits = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return EXHIBITS_DATA; // 默认显示全部，体验更好

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* 装饰性背景 */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 标题区 */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
            <span className="px-4 font-bold text-slate-600 uppercase tracking-widest text-sm">Two Point Archive</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
            管理、分类并探索来自世界各地的 <span className="text-slate-900 font-semibold">{EXHIBITS_DATA.length}</span> 件珍稀（或纯粹古怪的）展品。
          </p>
        </header>

        {/* 搜索控制台 */}
        <div className="max-w-2xl mx-auto mb-16 space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-xl border border-slate-200">
              <select
                className="px-4 py-3 rounded-xl border-none bg-slate-50 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
              >
                <option value="name">🔍 名字</option>
                <option value="category">📁 类别</option>
                <option value="traits">✨ 特性</option>
                <option value="source">📍 来源</option>
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-none text-lg placeholder:text-slate-300 focus:ring-0 outline-none"
                  placeholder="搜索展品..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 结果展示 */}
        {filteredExhibits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExhibits.map((item) => (
              <ExhibitCard key={item.id} data={item} keyword={query} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="text-slate-300 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">找不到该展品</h3>
            <p className="text-slate-400 mt-1">也许它被探险家弄丢了，或者它根本不存在？</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= 优化后的卡片组件 ================= */

function ExhibitCard({ data, keyword }: { data: Exhibit; keyword: string }) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* 顶部：分类与来源 */}
      <div className="flex justify-between items-start mb-4">
        <span className={getCategoryStyles(data.category)}>
          {data.category}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <MapPin size={12} className="text-slate-300" />
          {highlightText(data.source || '未知', keyword)}
        </div>
      </div>

      {/* 展品名称 */}
      <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
        {highlightText(data.name, keyword)}
      </h3>
      <div className="text-sm font-bold text-blue-400/80 mb-4 px-2 py-0.5 bg-blue-50 inline-block self-start rounded">
        {data.subcategory}
      </div>

      {/* 展品特性 Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {data.traits?.map((trait, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500 border border-slate-200/50">
            <Hash size={10} />
            {highlightText(trait, keyword)}
          </span>
        ))}
      </div>

      {/* 底部装饰：展品插图占位 */}
      <div className="mt-auto relative w-full h-32 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
         <Layers className="text-slate-200 group-hover:text-blue-200 transition-transform group-hover:scale-110" size={48} />
         <Star className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} fill="currentColor" />
      </div>
    </div>
  );
}
