'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Tag, Sparkles, Map as MapIcon, List, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// ⚠️ 确保路径正确：如果 HandDrawnCircle.tsx 在 components 文件夹中，则使用 '../components/HandDrawnCircle'
import HandDrawnCircle from '../components/HandDrawnCircle'; 
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 1. 坐标配置系统 (最新更新) ================= */
const MAP_LOCATIONS: Record<string, { top: string; left: string }> = {
  '永逝之湖': { top: '12%', left: '22%' },
  '迷乱沙丘': { top: '33%', left: '31%' }, // 已更新为最后一行修正的坐标
  '焦油旷野': { top: '15%', left: '12%' },
  '冰霜之巅': { top: '10%', left: '54%' },
  '原始边境': { top: '13%', left: '68%' },
  '大脚花园': { top: '23%', left: '77%' },
  '食人花丛林': { top: '9%', left: '85%' },
  '肋骨荒原': { top: '23%', left: '23%' },
  '啃噬之森': { top: '35%', left: '76%' },
  '远古遗迹': { top: '33%', left: '56%' },
  '沉寂河流': { top: '52%', left: '60%' },
  '凋零之路': { top: '60%', left: '44%' },
  '荒蛮峭壁': { top: '62%', left: '30%' },
  '霸王龙岩': { top: '83%', left: '20%' },
  '庞然巨岩': { top: '79%', left: '75%' },
  '草本绿野': { top: '73%', left: '8%' },
  '隐士山丘': { top: '42%', left: '3%' },
  '黑糖浆湖': { top: '28%', left: '3%' },
  '终焉之湖': { top: '51%', left: '14%' },
  '白费镇与徒劳镇的交界之地': { top: '71%', left: '61%' },
  '远古蛋黄穹顶': { top: '74%', left: '85%' },
};

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

/* ================= 2. 交互式地图组件 ================= */
function InteractiveMap({ 
  query, 
  data, 
  activeLocation, 
  onLocationSelect 
}: { 
  query: string; 
  data: Exhibit[]; 
  activeLocation: string | null;
  onLocationSelect: (loc: string) => void;
}) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800/10 bg-slate-100 select-none">
      <img src="/map.jpg" alt="Map" className="w-full h-auto object-cover opacity-80" />
      
      {Object.entries(MAP_LOCATIONS).map(([locName, coords]) => {
        // ... (省略前面的数据处理代码，保持不变)
        const locExhibits = data.filter(i => i.source?.includes(locName));
        const hasResults = locExhibits.length > 0;
        const isSelected = activeLocation === locName;
        const isSearchMatch = query.length > 0 && hasResults;
        
        if (query && !hasResults && !isSelected) return null;

        return (
          <div
            key={locName}
            className="absolute z-10 flex items-center justify-center"
            style={{ top: coords.top, left: coords.left }}
          >
             {/* ... (省略手绘圈代码，保持不变) */}
             <AnimatePresence>
               {isSearchMatch && !isSelected && (
                 <div className="absolute inset-0 pointer-events-none">
                    <HandDrawnCircle isSelected={false} />
                 </div>
               )}
             </AnimatePresence>

            <motion.button
              onClick={() => onLocationSelect(locName)}
              className="relative w-5 h-5 md:w-10 md:h-10 rounded-full flex items-center justify-center focus:outline-none z-20 group/pin"
              initial={false}
              whileHover={{ scale: 1.4 }} 
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* ★★★ 修改重点在此处 ★★★ 
                  1. backdrop-blur-[2px] -> backdrop-blur-[1px] (模糊度降低)
                  2. bg-white/10 -> bg-white/5 (背景透明度从10%降到5%)
                  3. border-white/40 -> border-white/10 (边框透明度从40%降到10%)
                  4. hover:bg-white/20 -> hover:bg-white/10 (悬停效果也相应变淡)
              */}
              <div className={`absolute inset-0 rounded-full backdrop-blur-[1px] border shadow-sm transition-colors duration-300
                 ${isSelected ? 'bg-transparent border-transparent' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} 
              />
              
              {/* ... (省略选中状态红圈和Tooltip代码，保持不变) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     <HandDrawnCircle isSelected={true} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`... (省略 Tooltip className) ...`}>
                {/* ... (省略 Tooltip 内容) ... */}
                <h4 className="font-black text-slate-800 text-xs md:text-sm mb-1 truncate">{locName}</h4>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-bold text-blue-600">发现 {locExhibits.length} 件</span>
                </div>
              </div>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

/* ================= 页面主组件 ================= */
export default function MuseumSearchApp() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'source' | 'traits'>('name');
  const [hasMounted, setHasMounted] = useState(false);
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 处理模式切换：隐藏搜索栏、重置结果显示所有
  const handleSwitchMode = (mode: 'list' | 'map') => {
    setViewMode(mode);
    setQuery(''); // 重置搜索词
    setSelectedLocation(null); // 重置选中的地点
  };

  const filteredExhibits = useMemo(() => {
    if (!hasMounted || !EXHIBITS_DATA) return [];
    const lowerQuery = query.toLowerCase().trim();

    return EXHIBITS_DATA.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const category = item.category?.toLowerCase() || '';
      const source = item.source?.toLowerCase() || '';
      const traits = item.traits || [];

      let matchesQuery = true;
      if (lowerQuery) {
        switch (searchType) {
          case 'name': matchesQuery = name.includes(lowerQuery); break;
          case 'category': matchesQuery = category.includes(lowerQuery); break;
          case 'source': matchesQuery = source.includes(lowerQuery); break;
          case 'traits': matchesQuery = traits.some(t => t.toLowerCase().includes(lowerQuery)); break;
          default: matchesQuery = false;
        }
      }

      let matchesLocation = true;
      if (selectedLocation) {
        matchesLocation = source.includes(selectedLocation);
      }

      return matchesQuery && matchesLocation;
    });
  }, [query, searchType, hasMounted, selectedLocation]);

  const handleLocateOnMap = (itemSource: string) => {
    const matchedKey = Object.keys(MAP_LOCATIONS).find(key => itemSource.includes(key));
    if (matchedKey) {
      setSelectedLocation(matchedKey);
      setViewMode('map');
      setQuery(''); 
    }
  };

  if (!hasMounted) return <div className="h-screen bg-slate-50" />;

  return (
    <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
      
      {/* 顶部固定区域 (Header) */}
      <div className="flex-none pt-4 md:pt-6 px-4 pb-2 z-10 bg-slate-50">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
           <div className="w-full max-w-sm md:max-w-md mx-auto">
              <img src="/banner.png" alt="双点博物馆" className="w-full h-auto object-contain rounded-xl shadow-sm" />
           </div>

           <div className="flex flex-col items-center gap-1">
             <h1 className="text-2xl md:text-3xl font-black text-slate-900">
               双点博物馆 <span className="text-blue-600">档案库</span>
             </h1>
             <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                 已收录 {EXHIBITS_DATA.length} 件展品
             </p>
           </div>
             
           <div className="bg-slate-200/50 p-1 rounded-lg flex relative h-9 w-48 shadow-inner">
             <div 
               className={`absolute top-1 bottom-1 w-[48%] bg-white rounded shadow-sm transition-all duration-300 ease-out ${viewMode === 'list' ? 'left-1' : 'left-[50%]'}`}
             />
             <button 
               onClick={() => handleSwitchMode('list')}
               className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-slate-500'}`}
             >
               <List size={14} /> 列表
             </button>
             <button 
               onClick={() => handleSwitchMode('map')}
               className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors ${viewMode === 'map' ? 'text-blue-600' : 'text-slate-500'}`}
             >
               <MapIcon size={14} /> 地图
             </button>
           </div>
        </div>

        {/* 仅在列表模式下显示搜索栏 */}
        {viewMode === 'list' && (
          <div className="mt-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <select
                  className="pl-3 pr-8 py-2 md:py-3 rounded-xl bg-slate-50 font-bold text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                >
                  <option value="name">名称</option>
                  <option value="category">类别</option>
                  <option value="traits">特性</option>
                  <option value="source">来源</option>
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3 md:top-3.5 text-slate-400 w-4 h-4" />
                  <input
                  className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl bg-slate-50 text-base md:text-sm font-medium focus:bg-blue-50/50 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                   placeholder="搜索展品（如：化石）"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                 />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 中间内容可滚动区域 */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="max-w-5xl mx-auto min-h-full">
          {viewMode === 'map' && (
            <div className="animate-in fade-in zoom-in duration-300 pb-8">
              <InteractiveMap 
                query={query} 
                data={EXHIBITS_DATA} 
                activeLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
              {selectedLocation && (
                 <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-800">当前筛选地点: <span className="text-black">{selectedLocation}</span></span>
                    <button onClick={() => setSelectedLocation(null)} className="text-xs text-blue-500 hover:text-blue-700 font-bold px-3 py-1 bg-white rounded-lg shadow-sm flex items-center gap-1">
                      <XCircle size={14}/> 清除筛选
                    </button>
                 </div>
              )}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filteredExhibits.map(item => (
                    <ExhibitCard 
                      key={item.id} 
                      data={item} 
                      keyword={query} 
                      onLocate={() => {
                        const matchedKey = Object.keys(MAP_LOCATIONS).find(key => item.source?.includes(key));
                        if(matchedKey) setSelectedLocation(matchedKey);
                      }}
                    />
                 ))}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {selectedLocation && (
                  <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center justify-between">
                     <span className="text-xs font-bold text-blue-700 flex items-center gap-2">
                       <MapIcon size={14} />
                       仅显示: {selectedLocation}
                     </span>
                     <button 
                       onClick={() => setSelectedLocation(null)}
                       className="text-xs bg-white text-slate-600 px-2 py-1 rounded border hover:bg-slate-50"
                     >
                       显示全部
                     </button>
                  </div>
                )}
                {filteredExhibits.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredExhibits.map((item) => (
                      <ExhibitCard 
                        key={item.id} 
                        data={item} 
                        keyword={query}
                        onLocate={() => handleLocateOnMap(item.source || '')} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                    <Info className="w-12 h-12 mb-4 text-slate-200" />
                    <p>在该筛选条件下未找到藏品</p>
                    {selectedLocation && <button onClick={() => setSelectedLocation(null)} className="text-blue-500 text-sm mt-2 underline">清除地点筛选</button>}
                  </div>
                )}
             </div>
          )}
        </div>
      </div>

      {/* 底部固定区域 (Footer) */}
      <footer className="flex-none py-3 text-center border-t border-slate-200 bg-white/80 backdrop-blur z-20">
        <div className="flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-slate-600 font-bold text-xs">
              欢迎关注 <a href="https://xhslink.com/m/4fdFysr8G7t" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">悦小白游戏记</a>
            </span>
          </div>
          <p className="text-slate-300 text-[10px] uppercase tracking-widest scale-90">Exhibit Guide System | 仅供参考</p>
        </div>
      </footer>
    </div>
  );
}

/* ================= 卡片组件 ================= */
function ExhibitCard({ 
  data, 
  keyword,
  onLocate 
}: { 
  data: Exhibit; 
  keyword: string; 
  onLocate: () => void;
}) {
  const mapKey = Object.keys(MAP_LOCATIONS).find(key => data.source?.includes(key));
  const location = mapKey ? MAP_LOCATIONS[mapKey] : null;

  return (
    <div className="group p-4 hover:bg-slate-50 transition-colors flex gap-3 md:gap-4 items-start">
      <div 
        onClick={(e) => { 
          if(location) {
            e.stopPropagation(); 
            onLocate(); 
          }
        }}
        className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden relative border-2 border-slate-100 shadow-sm transition-all
          ${location ? 'cursor-pointer group-hover:shadow-md hover:border-blue-400' : 'bg-slate-50 flex items-center justify-center'}
        `}
      >
        {location ? (
          <div className="w-full h-full bg-slate-200 relative">
             <img 
               src="/map.jpg" 
               className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
               style={{ objectPosition: `${location.left} ${location.top}` }}
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-600 relative z-10 shadow-sm" />
             </div>
          </div>
        ) : (
           <Tag className="text-slate-200 w-6 h-6" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base md:text-lg font-black text-slate-900 truncate pr-4">
            {highlightText(data.name, keyword)}
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryColor(data.category)}`}>
            {data.category}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
           <MapPin size={12} className={location ? "text-blue-500" : "text-slate-300"} />
           {highlightText(data.source || '未知来源', keyword)}
        </div>
        {data.traits && (
          <div className="flex flex-wrap gap-1">
            {data.traits.map((t, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium border border-slate-100">
                #{highlightText(t, keyword)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



