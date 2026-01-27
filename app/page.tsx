'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Zap, BookOpen, Flame, Tag, Layers, Sparkles } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

// 颜色映射工具
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

  // 核心搜索逻辑
  const filteredExhibits = useMemo(() => {
    // 如果输入框是空的，直接返回空数组
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase().trim();

    return EXHIBITS_DATA.filter((item) => {
      // 容错处理
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
        
        {/* 标题区 */}
        <div className="text-center mb-8 md:mb-12 pt-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-lg">
            {/* 【修正】这里修复了 id.length 的报错 */}
            已收录 {EXHIBITS_DATA.length} 件珍稀展品数据
          </p>
        </div>

        {/* 搜索控制台 */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 mb-8 sticky top-4 z-10 max-w-3xl mx-auto">
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                placeholder={`请输入关键词开始搜索...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 结果展示区 */}
        <div className="min-h-[400px]">
          {!query ? (
            // 初始欢迎界面
            <div className="flex flex-col items-center justify-center text-center mt-20 text-slate-400 opacity-60">
              <Sparkles className="w-24 h-24 mb-6 text-slate-300" />
              <h2 className="text-2xl font-semibold mb-2">准备好探索了吗？</h2>
              <p>在上方输入关键词，查找你感兴趣的展品</p>
            </div>
          ) : (
            // 搜索结果：【修正】改为单列 flex-col 布局
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
              {filteredExhibits.length > 0 ? (
                filteredExhibits.map((item) => (
                  <ExhibitCard key={item.id} data={item} />
                ))
              ) : (
                // 搜索无结果状态
                <div className="col-span-full text-center py-20 text-slate-400">
                  <div className="mb-4 text-6xl">🦖</div>
                  <p>未找到相关展品，换个词试试？</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 卡片组件：【修正】改为左图右文 + 底部虚线分割
function ExhibitCard({ data }: { data: Exhibit }) {
  return (
    <div className="group w-full bg-white border-b border-dashed border-slate-300 pb-10 mb-10 last:border-0 last:mb-0 last:pb-0 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8">
      
      {/* --- 修改区域 1：左侧 --- */}
      <div className={`h-40 md:h-auto md:w-56 shrink-0 relative overflow-hidden rounded-xl flex items-center justify-center ${getCategoryColor(data.category).split(' ')[0]} bg-opacity-30`}>
        <div className="text-slate-400 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
           <Layers size={80} />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pr-3">
          {/* 只保留主类别 */}
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm bg-white ${getCategoryColor(data.category).split(' ')[1]}`}>
            {data.category}
          </span>
          {/* 【已删除】原来的子类别代码移除了 */}
        </div>
      </div>

      {/* --- 修改区域 2：右侧 --- */}
      <div className="flex-1 flex flex-col py-1">
        
        {/* 标题和子类别区域 */}
        <div className="mb-3">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {data.name}
          </h3>
          
          {/* 【新增】子类别显示在这里 */}
          {data.subcategory && (
            <div className="mt-1.5">
               <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                 {data.subcategory}
               </span>
            </div>
          )}
        </div>

        {/* 来源 (Source) */}
        <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-1.5 rounded w-fit">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{data.source || '未知来源'}</span>
        </div>

        {/* 描述 */}
        <p className="text-base text-slate-600 mb-5 leading-relaxed">
          {data.description || '暂无详细介绍'}
        </p>

        {/* 统计数据 */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100 items-center">
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
        <div className="flex flex-wrap gap-2 mt-auto">
          {data.traits?.map((trait, idx) => (
            (trait && trait !== "无" && trait !== "无,,") && (
              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200">
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

// 统计子组件：【修正】改为横向排列 (flex-row)
function StatItem({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="shrink-0">{icon}</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="font-bold text-slate-700 text-sm">{value}</span>
      </div>
    </div>
  );
}
