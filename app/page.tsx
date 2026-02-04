'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Tag, Sparkles, Map as MapIcon, List } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 1. 坐标配置系统 (关键) ================= */
// ⚠️ 请根据你的地图图片实际情况，调整这里的 top/left 百分比
const MAP_LOCATIONS: Record<string, { top: string; left: string }> = {
  '永逝之湖': { top: '12%', left: '32%' },
  '迷乱沙丘': { top: '45%', left: '48%' },
  '焦油矿野': { top: '18%', left: '15%' },
  '冰霜之巅': { top: '10%', left: '60%' },
  '原始边境': { top: '15%', left: '75%' },
  '大树花园': { top: '30%', left: '85%' },
  '骷髅荒原': { top: '25%', left: '25%' },
  '藤蔓之森': { top: '40%', left: '78%' },
  '远古遗迹': { top: '35%', left: '62%' },
  '沉寂河流': { top: '55%', left: '68%' },
  '凋零之路': { top: '65%', left: '50%' },
  '荒蛮峭壁': { top: '68%', left: '30%' },
  '霸王龙岩': { top: '85%', left: '25%' },
  '庞然巨岩': { top: '80%', left: '80%' },
  '草本绿野': { top: '75%', left: '10%' },
  // 如果有新地点，继续在这里添加...
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
  // 获取当前搜索结果中包含的所有地点
  const activeLocations = Array.from(new Set(data.map(item => item.source).filter(Boolean)));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800/10 bg-slate-100 group select-none">
      {/* 地图底图 */}
      <img src="/map.jpg" alt="Map" className="w-full h-auto object-cover" />
      
      {/* 遍历坐标点生成图标 */}
      {Object.entries(MAP_LOCATIONS).map(([locName, coords]) => {
        // 判断该点是否在当前搜索结果中
        const hasResults = activeLocations.includes(locName);
        // 判断该点是否被高亮选中
        const isActive = activeLocation === locName;
        
        // 如果不在搜索结果中，且没有高亮，则半透明显示或隐藏
        if (!hasResults && !isActive && query) return null;

        // 找出该地点的所有展品
        const locExhibits = data.filter(i => i.source === locName);

        return (
          <div
            key={locName}
            className="absolute z-10"
            style={{ top: coords.top, left: coords.left }}
          >
            {/* 图标主体 (放大镜效果) */}
            <div 
              onClick={() => onLocationSelect(locName)}
              className={`
                relative -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300
                flex items-center justify-center rounded-full border-2 
                ${isActive 
                  ? 'w-16 h-16 bg-blue-500/90 border-white scale-110 shadow-[0_0_30px_rgba(59,130,246,0.8)] z-50' 
                  : 'w-8 h-8 bg-slate-900/60 border-white/80 hover:scale-[2.5] hover:bg-blue-500 hover:z-40'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/80'}`} />
              
              {/* 悬浮/选中时的详情弹窗 */}
              <div className={`
                absolute left-full top-1/2 ml-4 -translate-y-1/2 w-48 bg-white/95 backdrop-blur rounded-xl p-3 shadow-2xl border-l-4 border-blue-500
                transition-all duration-200 origin-left pointer-events-none
                ${isActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'}
              `}>
                <h4 className="font-black text-slate-800 text-sm mb-1">{locName}</h4>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-bold text-blue-600">发现 {locExhibits.length} 件展品:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {locExhibits.slice(0, 3).map(e => (
                      <span key={e.id} className="bg-slate-100 px-1 rounded">{e.name}</span>
                    ))}
                    {locExhibits.length > 3 && <span>...</span>}
                  </div>
                </div>
              </div>
            </div>
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
  
  // 新增状态：视图模式 & 选中的地点
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredExhibits = useMemo(() => {
    if (!hasMounted || !EXHIBITS_DATA) return [];
    
    // 如果没有任何搜索词，且没有选中地点，返回空(或者全部，看你想怎么处理)
    // 这里为了不让地图空着，如果没有query，默认显示全部
    
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
        matchesLocation = item.source === selectedLocation;
      }

      return matchesQuery && matchesLocation;
    });
  }, [query, searchType, hasMounted, selectedLocation, viewMode]);

  const handleLocateOnMap = (location: string) => {
    if (MAP_LOCATIONS[location]) {
      setSelectedLocation(location); // 设置选中地点
      setViewMode('map');            // 切换到地图模式
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(`暂无 "${location}" 的地图坐标数据`);
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            {EXHIBITS_DATA.length} Exhibits Indexed
          </p>
        </div>

        {/* 搜索控制台 (含模式切换) */}
        <div className="sticky top-4 z-50 mb-8">
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
            
            {/* 左侧：搜索输入 */}
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

            {/* 右侧：模式切换开关 */}
            <div className="bg-slate-100 p-1 rounded-xl flex shrink-0 relative">
               {/* 滑块背景动画 */}
               <div 
                 className={`absolute top-1 bottom-1 w-[50%] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${viewMode === 'list' ? 'left-1' : 'left-[48%]'}`}
               />
               
               <button 
                 onClick={() => setViewMode('list')}
                 className={`relative z-10 px-6 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-slate-500'}`}
               >
                 <List size={14} /> 列表
               </button>
               <button 
                 onClick={() => setViewMode('map')}
                 className={`relative z-10 px-6 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors ${viewMode === 'map' ? 'text-blue-600' : 'text-slate-500'}`}
               >
                 <MapIcon size={14} /> 地图
               </button>
            </div>
          </div>
        </div>

        {/* 内容展示区域 */}
        <div className="transition-all duration-500">
          
          {/* 模式 A: 地图模式 */}
          {viewMode === 'map' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <InteractiveMap 
                query={query} 
                data={EXHIBITS_DATA} // 传全部数据，由地图组件自己根据query高亮
                activeLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
              {selectedLocation && (
                 <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-800">当前选中: {selectedLocation}</span>
                    <button onClick={() => setSelectedLocation(null)} className="text-xs text-blue-500 hover:underline">清除筛选</button>
                 </div>
              )}
              {/* 地图模式下也显示下方的列表，展示当前筛选结果 */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filteredExhibits.map(item => (
                    <ExhibitCard 
                      key={item.id} 
                      data={item} 
                      keyword={query} 
                      onLocate={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // 地图模式下点击卡片定位，只需滚回地图
                        setSelectedLocation(item.source || null);
                      }}
                    />
                 ))}
              </div>
            </div>
          )}

          {/* 模式 B: 列表模式 */}
          {viewMode === 'list' && (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
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
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Sparkles className="w-12 h-12 mb-4 text-slate-200" />
                    <p>未找到相关藏品</p>
                  </div>
                )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ================= 卡片组件 (含动态地图缩略图) ================= */
function ExhibitCard({ 
  data, 
  keyword,
  onLocate 
}: { 
  data: Exhibit; 
  keyword: string; 
  onLocate: () => void;
}) {
  const location = MAP_LOCATIONS[data.source || ''];

  return (
    <div className="group p-5 hover:bg-slate-50 transition-colors flex gap-4 items-start">
      
      {/* --- 动态生成的地图缩略图 --- */}
      <div 
        onClick={(e) => { e.stopPropagation(); onLocate(); }}
        className="shrink-0 w-20 h-20 rounded-xl overflow-hidden relative border-2 border-slate-100 cursor-pointer shadow-sm group-hover:shadow-md hover:border-blue-400 transition-all"
        title="点击在地图上查看"
      >
        {/* 缩略图底图 (使用 css scale 模拟小地图) */}
        <div className="w-full h-full bg-slate-200 relative">
           <img 
             src="/map.jpg" 
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
             style={{ 
               // 稍微调整 objectPosition 让定位点尽量靠中间 (可选高级优化)
               objectPosition: location ? `${location.left} ${location.top}` : 'center' 
             }}
           />
           
           {/* 红色定位圈 */}
           {location ? (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/20 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-red-600 relative z-10 shadow-sm" />
             </div>
           ) : (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-[10px] text-slate-400 font-bold">
               无地图
             </div>
           )}
        </div>
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
           <MapPin size={12} className="text-blue-400" />
           {highlightText(data.source || '未知来源', keyword)}
        </div>

        {data.traits && (
          <div className="flex flex-wrap gap-1">
            {data.traits.map((t, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                #{highlightText(t, keyword)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
