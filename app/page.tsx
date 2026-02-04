'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Tag, Sparkles, Map as MapIcon, List, Info } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from './data';

/* ================= 1. 坐标配置系统 ================= */
// ⚠️ 这里的 Key (如"永逝之湖") 需要是 data.ts 中 source 字段的一部分
// 例如：数据是 "白骨带 - 永逝之湖"，这里写 "永逝之湖" 即可匹配
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
  // 获取当前所有展品的来源列表
  const activeSources = data.map(item => item.source || '');

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800/10 bg-slate-100 group select-none">
      {/* 地图底图 */}
      <img src="/map.jpg" alt="Map" className="w-full h-auto object-cover" />
      
      {/* 遍历坐标点生成图标 */}
      {Object.entries(MAP_LOCATIONS).map(([locName, coords]) => {
        // 核心匹配逻辑：数据源 "白骨带 - 永逝之湖" 包含 "永逝之湖" 吗？
        // 如果包含，说明这个地点有相关展品
        const locExhibits = data.filter(i => i.source?.includes(locName));
        const hasResults = locExhibits.length > 0;
        
        // 判断该点是否被高亮选中
        const isActive = activeLocation === locName;
        
        // 如果不在搜索结果中，且没有高亮，则隐藏 (仅在有搜索词时生效)
        // 如果没有搜索词(query为空)，则默认显示所有地图点
        if (query && !hasResults && !isActive) return null;

        return (
          <div
            key={locName}
            className="absolute z-10"
            style={{ top: coords.top, left: coords.left }}
          >
            {/* 图标主体 */}
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
                transition-all duration-200 origin-left pointer-events-none z-[60]
                ${isActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'}
              `}>
                <h4 className="font-black text-slate-800 text-sm mb-1">{locName}</h4>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-bold text-blue-600">发现 {locExhibits.length} 件展品</span>
                  {locExhibits.length > 0 && (
                     <div className="mt-1 flex flex-wrap gap-1">
                      {locExhibits.slice(0, 3).map(e => (
                        <span key={e.id} className="bg-slate-100 px-1 rounded truncate max-w-[100px]">{e.name}</span>
                      ))}
                      {locExhibits.length > 3 && <span>...</span>}
                    </div>
                  )}
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
  
  // 视图模式 & 选中的地点
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredExhibits = useMemo(() => {
    if (!hasMounted || !EXHIBITS_DATA) return [];
    
    // 【修改点1】默认状态逻辑：如果没有搜索词 且 没有选中的地点，返回空数组
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

      // 2. 地图地点筛选 【修改点3：数据匹配逻辑】
      let matchesLocation = true;
      if (viewMode === 'map' && selectedLocation) {
        // 使用 includes，这样 "永逝之湖" 可以匹配 "白骨带 - 永逝之湖"
        matchesLocation = source.includes(selectedLocation);
      }

      return matchesQuery && matchesLocation;
    });
  }, [query, searchType, hasMounted, selectedLocation, viewMode]);

  const handleLocateOnMap = (itemSource: string) => {
    // 尝试在 MAP_LOCATIONS 中找到匹配的 Key
    // 例如 itemSource 是 "白骨带 - 永逝之湖"，我们要找 "永逝之湖" 这个 Key
    const matchedKey = Object.keys(MAP_LOCATIONS).find(key => itemSource.includes(key));

    if (matchedKey) {
      setSelectedLocation(matchedKey);
      setViewMode('map');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 如果找不到坐标，提示一下（或者静默失败）
      // alert(`暂无该地点地图数据`);
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 pt-4 md:pt-8">
        
        {/* 【修改点2】顶部 Banner 图片还原 */}
        <div className="flex justify-center mb-6">
          <a href="/" className="block w-[70%] md:w-[40%] aspect-[3/1] relative overflow-hidden rounded-xl shadow-sm border border-slate-100 bg-white hover:shadow-md transition-all">
             <img src="/banner.png" alt="双点博物馆展品库" className="w-full h-full object-contain" />
          </a>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            双点博物馆 <span className="text-blue-600">档案库</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
             已收录 {EXHIBITS_DATA.length} 件展品
          </p>
        </div>

        {/* 搜索控制台 */}
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
            <div className="bg-slate-100 p-1 rounded-xl flex shrink-0 relative w-full md:w-auto h-12 md:h-auto">
               <div 
                 className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${viewMode === 'list' ? 'left-1' : 'left-[50%]'}`}
               />
               <button 
                 onClick={() => setViewMode('list')}
                 className={`relative z-10 flex-1 px-4 md:px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-slate-500'}`}
               >
                 <List size={14} /> 列表
               </button>
               <button 
                 onClick={() => setViewMode('map')}
                 className={`relative z-10 flex-1 px-4 md:px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors ${viewMode === 'map' ? 'text-blue-600' : 'text-slate-500'}`}
               >
                 <MapIcon size={14} /> 地图
               </button>
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
              {selectedLocation && (
                 <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-800">当前筛选地点: <span className="text-black">{selectedLocation}</span></span>
                    <button onClick={() => setSelectedLocation(null)} className="text-xs text-blue-500 hover:text-blue-700 font-bold px-3 py-1 bg-white rounded-lg shadow-sm">显示全部</button>
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
                {/* 默认空状态：没有搜索 且 没有结果 */}
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

        {/* 【修改点2】底部 Footer 还原 */}
        <footer className="mt-12 pb-8 text-center border-t border-slate-200 pt-6">
          <p className="text-slate-300 text-[10px] mb-4 uppercase tracking-widest font-sans">Exhibit Guide System | 仅供参考</p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <span className="text-slate-600 font-bold text-sm">
              欢迎关注 <a href="https://xhslink.com/m/4fdFysr8G7t" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">悦小白游戏记</a>
            </span>
            <span className="hidden sm:block text-slate-200">|</span>
            <span className="text-slate-400 font-medium text-xs font-sans">小红书 @悦小白游戏记</span>
          </div>
        </footer>

      </div>
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
  // 查找匹配的地图 Key (模糊匹配)
  const mapKey = Object.keys(MAP_LOCATIONS).find(key => data.source?.includes(key));
  const location = mapKey ? MAP_LOCATIONS[mapKey] : null;

  return (
    <div className="group p-5 hover:bg-slate-50 transition-colors flex gap-4 items-start">
      
      {/* 缩略图逻辑：如果有对应地图位置，显示红圈小地图；否则显示类别图标 */}
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
               style={{ 
                 objectPosition: `${location.left} ${location.top}` 
               }}
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/20 animate-ping absolute" />
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
