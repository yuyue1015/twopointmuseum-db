'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Tag,
  Layers,
  Sparkles
} from 'lucide-react';
/* 请确保你的数据文件名正确，如果是 ./data 则保持不变 */
import { EXHIBITS_DATA, Exhibit } from './data'; 

/* ================= 工具函数 ================= */

// 类别颜色：保持你原有的逻辑
const getCategoryColor = (category: string) => {
  const cat = category?.trim();
  if (cat === '史前') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (cat === '自然' || cat === '野生动物') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (cat === '超自然') return 'bg-purple-50 text-purple-800 border-purple-200';
  if (cat === '太空') return 'bg-blue-50 text-blue-800 border-blue-200';
  if (cat === '奇幻') return 'bg-pink-50 text-pink-800 border-pink-200';
  return 'bg-slate-50 text-slate-800 border-slate-200';
};

// 关键词高亮
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* 标题部分 */}
        <div className="text-center mb-10 pt-10">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500 font-medium">
            已收录 {EXHIBITS_DATA.length} 件展品资料
          </p>
        </div>

        {/* 搜索区域 */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-12 sticky top-4 z-10 max-w-2xl mx-auto flex gap-2">
          <select
            className="pl-4 pr-8 py-3 rounded-xl border-none bg-slate-100 text-slate-700 font-bold text-sm focus:ring-2 focus:ring-blue-500"
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

        {/* 结果列表区 */}
        <div className="space-y-0"> {/* 这里改为 0，由卡片内部的 margin 处理 */}
          {!query ? (
            <div className="flex flex-col items-center text-slate-300 mt-20">
              <Sparkles className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">输入关键词开始检索</p>
            </div>
          ) : (
            <>
              {filteredExhibits.length > 0 ? (
                filteredExhibits.map((item) => (
                  <ExhibitCard key={item.id} data={item} keyword={query} />
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  没有找到匹配的档案记录
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= 展品卡片组件（重点修改部分） ================= */

function ExhibitCard({ data, keyword }: { data: Exhibit; keyword: string; }) {
  return (
    /* 这里的 gap-6 可以保留，或者改为 gap-4 */
    <div className="group relative flex flex-col md:flex-row gap-4 py-8 border-b-2 border-dashed border-slate-200 last:border-0">
      
      {/* 左侧图标已删除，右侧内容现在占据全部宽度 */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {highlightText(data.name, keyword)}
            </h3>
            {/* 既然去掉了左边的色块，建议在这里加一个彩色小标签，方便辨识类别 */}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getCategoryColor(data.category)}`}>
              {data.category}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded">
            ID: {data.id}
          </span>
        </div>

        {data.subcategory && (
          <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-500">
            <Tag size={14} className="text-blue-500" />
            {data.subcategory}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 font-medium">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">来源：</span>
          {highlightText(data.source || '未知来源', keyword)}
        </div>

        {/* 特性展示 */}
        {data.traits && data.traits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.traits.map((trait, i) => (
              <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500 shadow-sm">
                # {highlightText(trait, keyword)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

