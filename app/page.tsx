// app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Zap, BookOpen, Flame, Tag, Layers } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data'; // 引入上面的数据

// 颜色映射工具，给不同的类别不同的颜色
const getCategoryColor = (category: string) => {
  switch (category) {
    case '史前': return 'bg-amber-100 text-amber-800 border-amber-200';
    case '自然': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case '超自然': return 'bg-purple-100 text-purple-800 border-purple-200';
    case '太空': return 'bg-blue-100 text-blue-800 border-blue-200';
    case '奇幻': return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function MuseumSearchApp() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'source' | 'traits'>('name');

  // 核心搜索逻辑
  const filteredExhibits = useMemo(() => {
    if (!query) return EXHIBITS_DATA;
    
    const lowerQuery = query.toLowerCase();

    return EXHIBITS_DATA.filter((item) => {
      switch (searchType) {
        case 'name':
          // 名称模糊搜索
          return item.name.toLowerCase().includes(lowerQuery);
        case 'category':
          // 搜类别 (包含主类别和子类别)
          return item.category.toLowerCase().includes(lowerQuery) || 
                 item.subcategory.toLowerCase().includes(lowerQuery);
        case 'source':
          // 搜事件/来源/地图
          return item.source.toLowerCase().includes(lowerQuery);
        case 'traits':
          // 搜特性 (只要有一个特性匹配即可)
          return item.traits.some(t => t.toLowerCase().includes(lowerQuery));
        default:
          return true;
      }
    });
  }, [query, searchType]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 标题区 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500 text-lg">
            收录 {EXHIBITS_DATA.length} 件珍稀展品数据
          </p>
        </div>

        {/* 搜索控制台 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 sticky top-4 z-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索类型选择 */}
            <select 
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 min-w-[140px]"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
            >
              <option value="name">搜展品名</option>
              <option value="category">搜类别</option>
              <option value="traits">搜特性</option>
              <option value="source">搜来源/地图</option>
            </select>

            {/* 输入框 */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={`输入${searchType === 'name' ? '展品名称（如：霸王龙）' : '关键词'}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 结果展示网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibits.length > 0 ? (
            filteredExhibits.map((item) => (
              <ExhibitCard key={item.id} data={item} />
            ))
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

// 独立的卡片组件
function ExhibitCard({ data }: { data: Exhibit }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
      {/* 头部：图片占位符 + 类别 */}
      <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {/* 如果你有真实图片链接，这里用 <img /> */}
        <div className="text-slate-300">
          <Layers className="w-12 h-12 opacity-50" />
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getCategoryColor(data.category)}`}>
            {data.category}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/80 backdrop-blur text-slate-600 border border-slate-200">
            {data.subcategory}
          </span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {data.name}
          </h3>
        </div>

        {/* 来源 */}
        <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-4">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1" title={data.source}>{data.source || '未知来源'}</span>
        </div>

        {/* 介绍 */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
          {data.description || '暂无详细介绍'}
        </p>

        {/* 核心数据统计 */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <StatItem 
            icon={<Flame className="w-4 h-4 text-orange-500" />} 
            label="基础热议" 
            value={data.base_buzz || '-'} 
          />
          <StatItem 
            icon={<Zap className="w-4 h-4 text-yellow-500" />} 
            label="最大热议" 
            value={data.max_buzz || '-'} 
          />
          <StatItem 
            icon={<BookOpen className="w-4 h-4 text-blue-500" />} 
            label="知识量" 
            value={data.max_knowledge || '-'} 
          />
        </div>

        {/* 特性标签 */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {data.traits.map((trait, idx) => (
            trait !== "无" && (
              <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200">
                <Tag className="w-3 h-3 mr-1 opacity-50" />
                {trait}
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// 小的数据组件
function StatItem({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-1">{icon}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider scale-90">{label}</div>
      <div className="font-bold text-slate-700">{value}</div>
    </div>
  );
}