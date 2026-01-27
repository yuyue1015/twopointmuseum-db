// app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Zap, BookOpen, Flame, Tag, Layers } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data'; 

const getCategoryColor = (category: string) => {
  const cat = category?.trim();
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

  const filteredExhibits = useMemo(() => {
    if (!query) return EXHIBITS_DATA;
    const lowerQuery = query.toLowerCase();
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
        default: return true;
      }
    });
  }, [query, searchType]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-lg">已收录 {EXHIBITS_DATA.length} 件珍稀展品数据</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 sticky top-4 z-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <select 
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 min-w-[120px]"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
            >
              <option value="name">搜展品名</option>
              <option value="category">搜类别</option>
              <option value="traits">搜特性</option>
              <option value="source">搜来源/地图</option>
            </select>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={`输入关键词查找...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredExhibits.length > 0 ? (
            filteredExhibits.map((item) => <ExhibitCard key={item.id} data={item} />)
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              <div className="mb-4 text-6xl">🦖</div>
              <p>未找到相关展品，换个词试试？</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExhibitCard({ data }: { data: Exhibit }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full">
      <div className={`h-24 md:h-32 relative overflow-hidden flex items-center justify-center ${getCategoryColor(data.category).split(' ')[0]} bg-opacity-30`}>
        <div className="text-slate-400 opacity-20 transform group-hover:scale-110 transition-transform duration-500"><Layers size={64} /></div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pr-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm bg-white ${getCategoryColor(data.category).split(' ')[1]}`}>{data.category}</span>
          {data.subcategory && <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/90 backdrop-blur text-slate-600 border border-slate-200 shadow-sm">{data.subcategory}</span>}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1" title={data.name}>{data.name}</h3>
        </div>
        <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3 bg-slate-50 p-1.5 rounded w-fit max-w-full">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1" title={data.source}>{data.source || '未知来源'}</span>
        </div>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow leading-relaxed">{data.description || '暂无详细介绍'}</p>
        <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-2 md:p-3 rounded-lg border border-slate-100">
          <StatItem icon={<Flame className="w-4 h-4 text-orange-500" />} label="基础热议" value={data.base_buzz || '-'} />
          <StatItem icon={<Zap className="w-4 h-4 text-yellow-500" />} label="最大热议" value={data.max_buzz || '-'} />
          <StatItem icon={<BookOpen className="w-4 h-4 text-blue-500" />} label="知识量" value={data.max_knowledge || '-'} />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-50">
          {data.traits?.map((trait, idx) => ((trait && trait !== "无" && trait !== "无,,") && <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-[10px] md:text-xs bg-slate-100 text-slate-600 border border-slate-200"><Tag className="w-3 h-3 mr-1 opacity-50" />{trait}</span>))}
        </div>
      </div>
    </div>
  );
}
function StatItem({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (<div className="flex flex-col items-center text-center"><div className="mb-1">{icon}</div><div className="text-[10px] text-slate-400 uppercase tracking-wider scale-90">{label}</div><div className="font-bold text-slate-700 text-sm md:text-base">{value}</div></div>);
}
