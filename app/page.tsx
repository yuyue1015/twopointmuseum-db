'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Flame,
  Tag,
  Layers,
  Sparkles
} from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 工具函数 ================= */

// 类别颜色
const getCategoryColor = (category: string) => {
  const cat = category?.trim();
  if (cat === '史前') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (cat === '自然' || cat === '野生动物') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (cat === '超自然') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (cat === '太空') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (cat === '奇幻') return 'bg-pink-100 text-pink-800 border-pink-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

// 关键词高亮
function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text;

  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-yellow-200 text-slate-900 px-0.5 rounded"
      >
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
  const [searchType, setSearchType] =
    useState<'name' | 'category' | 'source' | 'traits'>('name');

  const filteredExhibits = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();

    return EXHIBITS_DATA.filter((item) => {
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
          return item.traits?.some(t =>
            t.toLowerCase().includes(lowerQuery)
          );
        default:
          return false;
      }
    });
  }, [query, searchType]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* 标题 */}
        <div className="text-center mb-10 pt-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500">
            已收录 {EXHIBITS_DATA.length} 件展品
          </p>
        </div>

        {/* 搜索框 */}
        <div className="bg-white p-4 rounded-2xl shadow border border-slate-200 mb-8 sticky top-4 z-10 max-w-3xl mx-auto">
          <div className="flex gap-3">
            <select
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-lg"
                placeholder="输入关键词开始搜索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-w-5xl mx-auto">
          {!query ? (
            <div className="flex flex-col items-center text-slate-400 mt-20">
              <Sparkles className="w-20 h-20 mb-4" />
              <p>输入关键词开始探索展品</p>
            </div>
          ) : (
            <>
              {filteredExhibits.length > 0 && (
                <div className="mb-4 text-sm text-slate-500">
                  找到 <span className="font-semibold">{filteredExhibits.length}</span> 件相关展品
                </div>
              )}

              {filteredExhibits.length > 0 ? (
                filteredExhibits.map((item) => (
                  <ExhibitCard
                    key={item.id}
                    data={item}
                    keyword={query}
                  />
                ))
              ) : (
                <div className="text-center py-20 text-slate-400">
                  没有找到相关展品
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= 卡片组件 ================= */

function ExhibitCard({
  data,
  keyword
}: {
  data: Exhibit;
  keyword: string;
}) {
  return (
    <div className="bg-white border-b border-dashed border-slate-300 pb-8 mb-8 flex gap-6">
      {/* 左侧 */}
      <div className={`w-40 h-32 rounded-xl flex items-center justify-center ${getCategoryColor(data.category)}`}>
        <Layers className="opacity-30" size={48} />
      </div>

      {/* 右侧 */}
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">
          {highlightText(data.name, keyword)}
        </h3>

        {data.subcategory && (
          <div className="mb-2 text-xs text-slate-500">
            {data.subcategory}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <MapPin className="w-3 h-3" />
          {highlightText(data.source || '未知来源', keyword)}
        </div>

        <p className="text
