'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Tag,
  Sparkles
} from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 工具函数 ================= */

const getCategoryColor = (category: string) => {
  const cat = category?.trim();
  if (cat === '史前') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (cat === '自然' || cat === '野生动物') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (cat === '超自然') return 'bg-purple-50 text-purple-800 border-purple-200';
  if (cat === '太空') return 'bg-blue-50 text-blue-800 border-blue-200';
  if (cat === '奇幻') return 'bg-pink-50 text-pink-800 border-pink-200';
  return 'bg-slate-50 text-slate-800 border-slate-200';
};

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-slate-900 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/* ================= 页面主组件 ================= */

export default function MuseumSearchApp() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'source' | 'traits'>('name');

  const filteredExhibits = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();

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
    <div className="py-8 md:py-12">
      {/* 标题 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          双点博物馆 <span className="text-blue-600">档案库</span>
        </h1>
        <p className="text-slate-500 font-medium">
          已收录 {EXHIBITS_DATA.length} 件展品资料
        </p>
      </div>

      {/* 搜索框 */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-12 sticky top-4 z-10 max-w-2xl mx-auto flex gap-2">
        <select
          className="pl-4 pr-8 py-3 rounded-xl border-none bg-slate-100 text-slate-700 font-bold text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border-none text-base focus:ring-2 focus:ring-blue-500"
            placeholder="搜索档案信息..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 结果列表 */}
      <div className="min-h-[400px]">
        {!query ? (
          <div className="flex flex-col items-center text-slate-300 mt-20">
            <Sparkles className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">输入关键词开始检索</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredExhibits.length > 0 ? (
              <div className="divide-y-2 divide-dashed divide-slate-100 px-6 md:px-10">
                {filteredExhibits.map((item) => (
                  <ExhibitCard key={item.id} data={item} keyword={query} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 italic">
                没有找到相关的档案记录
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部关注信息 */}
      <footer className="mt-20 pb-12 text-center border-t border-slate-200 pt-10">
        <p className="text-slate-400 text-xs mb-4 uppercase tracking-widest">Data Archive System | 仅供参考</p>
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
           <span className="text-slate-600 font-bold">欢迎关注 <span className="text-red-500">悦小白游戏记</span></span>
           <span className="hidden sm:block text-slate-300">|</span>
     
        </div>
      </footer>
    </div>
  );
}

/* ================= 展品卡片组件 ================= */

function ExhibitCard({ data, keyword }: { data: Exhibit; keyword: string; }) {
  return (
    <div className="group py-8 transition-colors hover:bg-slate-50/50 -mx-6 md:-mx-10 px-6 md:px-10">
      <div className="flex-1">
        {/* 第一行：标题 + ID */}
        <div className="flex items-start justify-between mb-3 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              {highlightText(data.name, keyword)}
            </h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border tracking-wider ${getCategoryColor(data.category)}`}>
              {data.category}
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-mono font-bold text-slate-300">
            #{data.id.toString().padStart(4, '0')}
          </span>
        </div>

        {/* 第二行：次级类别 */}
        {data.subcategory && (
          <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-400">
            <Tag size={14} className="text-blue-400" />
            {data.subcategory}
          </div>
        )}

        {/* 第三行：来源 */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-5 font-medium">
          <MapPin className="w-4 h-4 text-slate-300" />
          <span className="text-slate-400 text-[10px] font-black uppercase">Source:</span>
          {highlightText(data.source || '未知来源', keyword)}
        </div>

        {/* 第四行：特性 Tags */}
        {data.traits && data.traits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.traits.map((trait, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[11px] font-bold text-slate-500 group-hover:border-blue-100 group-hover:text-blue-500 transition-all">
                # {highlightText(trait, keyword)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

