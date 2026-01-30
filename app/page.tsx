'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Tag, Sparkles } from 'lucide-react';
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
  if (!text || !keyword.trim()) return text || '';
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
  const [searchType, setSearchType] = setSearchType = useState<'name' | 'category' | 'source' | 'traits'>('name');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredExhibits = useMemo(() => {
    if (!hasMounted || !query.trim() || !EXHIBITS_DATA) return [];
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
  }, [query, searchType, hasMounted]);

  if (!hasMounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="py-4 md:py-8 flex flex-col min-h-screen max-w-4xl mx-auto px-4 antialiased">
      {/* 顶部 Banner */}
      <div className="flex justify-center mb-6">
        <a href="/" className="block w-[70%] md:w-[40%] aspect-[3/1] relative overflow-hidden rounded-xl shadow-sm border border-slate-100 bg-white hover:shadow-md transition-all">
          <img src="/banner.png" alt="双点博物馆展品库" className="w-full h-full object-contain" />
        </a>
      </div>

      {/* 标题 */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          双点博物馆 <span className="text-blue-600">展品库</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          已收录 • {EXHIBITS_DATA?.length || 0} • 件展品
        </p>
      </div>

      {/* 搜索框区域 - 深度优化字号 */}
      <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 mb-6 sticky top-2 z-10 flex gap-1.5 w-full">
        <select
          className="pl-3 pr-7 py-2 rounded-lg border-none bg-slate-50 text-slate-600 font-bold text-[11px] focus:ring-1 focus:ring-blue-500 cursor-pointer"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as any)}
        >
          <option value="name">展品名</option>
          <option value="category">类别</option>
          <option value="traits">特性</option>
          <option value="source">来源</option>
        </select>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-3.5 h-3.5" />
          <input
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border-none text-[13px] md:text-sm placeholder:text-slate-400 placeholder:font-normal focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="搜索展品信息（如：左脚印化石...）"
            style={{ fontSize: '16px', transform: 'scale(0.8125)', transformOrigin: 'left center', width: '123%' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* 上面的 transform 技巧：物理大小是 16px 防止 iOS 缩放，视觉大小通过 scale 缩小到约 13px */}
        </div>
      </div>

      {/* 结果显示 */}
      <div className="flex-1">
        {!query ? (
          <div className="flex flex-col items-center text-slate-300 mt-10">
            <Sparkles className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">输入关键词开启检索</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredExhibits.length > 0 ? (
              <div className="divide-y-2 divide-dashed divide-slate-100 px-4">
                {filteredExhibits.map((item) => (
                  <ExhibitCard key={item.id} data={item} keyword={query} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-sm">没有找到相关的展品记录</div>
            )}
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="mt-12 pb-8 text-center border-t border-slate-200 pt-6">
        <p className="text-slate-300 text-[10px] mb-4 uppercase tracking-widest font-sans">Exhibit Guide System | 仅供参考</p>
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
          <span className="text-slate-600 font-bold text-sm">
            欢迎关注 <a href="https://xhslink.com/m/4fdFysr8G7t" target="_blank" rel="noopener noreferrer" className="text-red-500">悦小白游戏记</a>
          </span>
          <span className="hidden sm:block text-slate-200">|</span>
          <span className="text-slate-400 font-medium text-xs font-sans">小红书 @悦小白游戏记</span>
        </div>
      </footer>
    </div>
  );
}

function ExhibitCard({ data, keyword }: { data: Exhibit; keyword: string; }) {
  return (
    <div className="group py-5 transition-colors hover:bg-slate-50/50">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black text-slate-900">{highlightText(data.name, keyword)}</h3>
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border tracking-wider ${getCategoryColor(data.category)}`}>
              {data.category}
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-mono font-bold text-slate-300">#{data.id.toString().padStart(4, '0')}</span>
        </div>
        {data.subcategory && (
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Tag size={12} className="text-blue-400" />
            {data.subcategory}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-400 text-[9px] font-black uppercase">Source:</span>
          {highlightText(data.source || '未知来源', keyword)}
        </div>
        {data.traits && data.traits.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.traits.map((trait, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-500 group-hover:text-blue-500 transition-all">
                # {highlightText(trait, keyword)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
