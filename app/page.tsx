'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Tag, Sparkles, Map as MapIcon, List, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// ⚠️ 请确保这个路径正确指向你刚才创建的文件
import HandDrawnCircle from '../components/HandDrawnCircle'; 
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 1. 坐标配置系统 ================= */
// 这里的 Key 需要对应 data.ts 中 source 字段的关键词
const MAP_LOCATIONS: Record<string, { top: string; left: string }> = {
  '永逝之湖': { top: '14%', left: '20%' },
  '迷乱沙丘': { top: '40%', left: '48%' },
  '焦油旷野': { top: '13%', left: '12%' },
  '冰霜之巅': { top: '10%', left: '55%' },
  '原始边境': { top: '13%', left: '70%' },
  '大树花园': { top: '28%', left: '75%' },
  '骷髅荒原': { top: '23%', left: '20%' },
  '啃噬之森': { top: '38%', left: '72%' },
  '远古遗迹': { top: '33%', left: '57%' },
  '沉寂河流': { top: '53%', left: '63%' },
  '凋零之路': { top: '66%', left: '45%' },
  '荒蛮峭壁': { top: '66%', left: '25%' },
  '霸王龙岩': { top: '83%', left: '20%' },
  '庞然巨岩': { top: '78%', left: '75%' },
  '草本绿野': { top: '73%', left: '8%' },
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
    // ⚠️ 注意：这里移除了外层的 group 类，避免鼠标进入地图区域就触发所有 Tooltip
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800/10 bg-slate-100 select-none">
      {/* 地图底图 */}
      <img src="/map.jpg" alt="Map" className="w-full h-auto object-cover opacity-80" />
      
      {/* 遍历坐标点 */}
      {Object.entries(MAP_LOCATIONS).map(([locName, coords]) => {
        const locExhibits = data.filter(i => i.source?.includes(locName));
        const hasResults = locExhibits.length > 0;
        
        const isSelected = activeLocation === locName;
        const isSearchMatch = query.length > 0 && hasResults;

        // 如果处于搜索模式，且该地点没有结果，也不是当前选中的点，则隐藏
        if (query && !hasResults && !isSelected) return null;

        return (
          <div
            key={locName}
            className="absolute z-10 flex items-center justify-center"
            style={{ top: coords.top, left: coords.left }}
          >
             {/* 搜索结果高亮圈 
                逻辑：有搜索内容 且 匹配 且 当前没被选中（选中会显示另一个圈）
             */}
             <AnimatePresence>
               {isSearchMatch && !isSelected && (
                 <div className="absolute inset-0 pointer-events-none">
                    <HandDrawnCircle isSelected={false} />
                 </div>
               )}
             </AnimatePresence>

            {/* 交互点按钮 
                ★ 关键修改：添加 'group/pin'。
                Tailwind 的 Named Groups 允许我们隔离 Hover 状态。
                只有鼠标悬浮在这个特定的 button 上时，group-hover/pin 才会生效。
            */}
            <motion.button
              onClick={() => onLocationSelect(locName)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center focus:outline-none z-20 group/pin"
              initial={false}
              whileHover={{ scale: 1.4 }} 
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* 全透明磨砂玻璃背景 */}
              <div className={`absolute inset-0 rounded-full backdrop-blur-[2px] border shadow-sm transition-colors duration-300
                 ${isSelected ? 'bg-transparent border-transparent' : 'bg-white/10 border-white/40 hover:bg-white/20'}`} 
              />
              
              {/* 选中状态的红色手绘圈 */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                     <HandDrawnCircle isSelected={true} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 悬浮提示框 (Tooltip) 
                 逻辑：
                 1. isSelected ? 常显 (visible opacity-100)
                 2. group-hover/pin ? 显示 (visible opacity-100)
                 3. 默认 ? 隐藏 (invisible opacity-0)
              */}
              <div className={`
                absolute left-full top-1/2 ml-3 -translate-y-1/2 w-48 
                bg-white/95 backdrop-blur rounded-xl p-3 shadow-2xl border-l-4 border-blue-500 
                origin-left pointer-events-none z-50 transition-all duration-200
                ${isSelected 
                   ? 'opacity-100 scale-100 visible' 
                   : 'opacity-0 scale-90 invisible group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:visible'
                }
              `}>
                <h4 className="font-black text-slate-800 text-sm mb-1">{locName}</h4>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-bold text-blue-600">发现 {locExhibits.length} 件展品</span>
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

  const filteredExhibits = useMemo(() => {
    if (!hasMounted || !EXHIBITS_DATA) return [];
    
    // 默认空状态
    if (!query.trim() && !selectedLocation) return [];
    
    const lowerQuery = query.toLowerCase().trim();

    return EXHIBITS_DATA.filter((item) => {
      // 1. 基础文本搜索
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

      // 2. 地图地点筛选
      let matchesLocation = true;
      if (viewMode === 'map' && selectedLocation) {
        matchesLocation = source.includes(selectedLocation);
      }

      return matchesQuery && matchesLocation;
    });
  }, [query, searchType, hasMounted, selectedLocation, viewMode]);

  const handleLocateOnMap = (itemSource: string) => {
    const matchedKey = Object.keys(MAP_LOCATIONS).find(key => itemSource.includes(key));
    if (matchedKey) {
      setSelectedLocation(matchedKey);
      setViewMode('map');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 pt-4 md:pt-8">
        
        {/* Header 区域 */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
           {/* 左侧：标题与统计 */}
           <div className="flex flex-col gap-2 w-full md:w-auto">
             <h1 className="text-3xl md:text-4xl font-black text-slate-900">
               双点博物馆 <span className="text-blue-600">档案库</span>
             </h1>
             
             {/* === 布局调整 ===
                切换按钮（Switch）现在位于统计文字下方
             */}
             <div className="flex flex-col items-start gap-3">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                   已收录 {EXHIBITS_DATA.length} 件展品
               </p>
               
               {/* 切换开关组件 */}
               <div className="bg-slate-200/50 p-1 rounded-lg flex relative h-9 w-48">
                 <div 
                   className={`absolute top-1 bottom-1 w-[48%] bg-white rounded shadow-sm transition-all duration-300 ease-out ${viewMode === 'list' ? 'left-1' : 'left-[50%]'}`}
                 />
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-slate-500'}`}
                 >
                   <List size={14} /> 列表
                 </button>
                 <button 
                   onClick={() => setViewMode('map')}
                   className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors ${viewMode === 'map' ? 'text-blue-600' : 'text-slate-500'}`}
                 >
                   <MapIcon size={14} /> 地图
                 </button>
               </div>
             </div>
           </div>
        </div>

        {/* 搜索控制台 (原本右侧的 Toggle 已移除) */}
        <div className="sticky top-4 z-50 mb-8">
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex gap-2">
               <select
                className="pl-3 pr-8 py-3 rounded-xl bg-slate-50 font-bold text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
              >
                <option value="name">名称</option>
                <option value="category">类别</option>
                <option value="traits">特性</option>
                <option value="source">来源</option>
              </select>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-sm font-medium focus:bg-blue-50/50 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="搜索展品..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 内容展示区域 */}
        <div className="transition-all duration-500 min-h-[500px]">
          
          {/* 地图模式 */}
          {viewMode === 'map' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <InteractiveMap 
                query={query} 
                data={EXHIBITS_DATA} 
                activeLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
              
              {/* 选中地点后的信息条 */}
              {selectedLocation && (
                 <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-800">当前筛选地点: <span className="text-black">{selectedLocation}</span></span>
                    <button onClick={() => setSelectedLocation(null)} className="text-xs text-blue-500 hover:text-blue-700 font-bold px-3 py-1 bg-white rounded-lg shadow-sm">显示全部</button>
                 </div>
              )}
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filteredExhibits.map(item => (
                    <ExhibitCard 
                      key={item.id} 
                      data={item} 
                      keyword={query} 
                      onLocate={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        const matchedKey = Object.keys(MAP_LOCATIONS).find(key => item.source?.includes(key));
                        if(matchedKey) setSelectedLocation(matchedKey);
                      }}
                    />
                 ))}
              </div>
            </div>
          )}

          {/* 列表模式 */}
          {viewMode === 'list' && (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
                {!query && filteredExhibits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-300">
                    <Sparkles className="w-16 h-16 mb-4 opacity-50 text-blue-200" />
                    <p className="text-lg font-medium text-slate-400">请输入关键词开始探索档案库</p>
                    <p className="text-xs mt-2 text-slate-300">支持搜索名称、类别、特性或地点</p>
                  </div>
                ) : filteredExhibits.length > 0 ? (
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
                  </div>
                )}
             </div>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center border-t border-slate-200 pt-6">
          <p className="text-slate-300 text-[10px] mb-4 uppercase tracking-widest font-sans">Exhibit Guide System | 仅供参考</p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-slate-600 font-bold text-sm">
              欢迎关注 <a href="https://xhslink.com/m/4fdFysr8G7t" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">悦小白游戏记</a>
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}

/* ================= 卡片组件 (保持不变) ================= */
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
    <div className="group p-5 hover:bg-slate-50 transition-colors flex gap-4 items-start">
      <div 
        onClick={(e) => { 
          if(location) {
            e.stopPropagation(); 
            onLocate(); 
          }
        }}
        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden relative border-2 border-slate-100 shadow-sm transition-all
          ${location ? 'cursor-pointer group-hover:shadow-md hover:border-blue-400' : 'bg-slate-50 flex items-center justify-center'}
        `}
        title={location ? "点击在地图上定位" : "暂无地图数据"}
      >
        {location ? (
          <div className="w-full h-full bg-slate-200 relative">
             <img 
               src="/map.jpg" 
               className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
               style={{ objectPosition: `${location.left} ${location.top}` }}
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-600 relative z-10 shadow-sm" />
             </div>
          </div>
        ) : (
           <Tag className="text-slate-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-black text-slate-900 truncate pr-4">
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



