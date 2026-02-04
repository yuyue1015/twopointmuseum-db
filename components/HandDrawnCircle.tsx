// 文件路径: components/HandDrawnCircle.tsx
'use client';

import { motion } from 'framer-motion';

interface HandDrawnCircleProps {
  /** * true = 选中状态 (虚线、细线、不抖动或微抖动)
   * false = 搜索高亮 (实线、粗线、明显抖动)
   */
  isSelected?: boolean;
}

export default function HandDrawnCircle({ isSelected = false }: HandDrawnCircleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      // 根据状态调整 SVG 容器的大小，isSelected 时稍微小一点紧凑一点，搜索高亮时大一点显眼一点
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
        isSelected ? 'w-[140%] h-[140%]' : 'w-[180%] h-[180%]'
      }`}
      style={{ overflow: 'visible' }}
    >
      <motion.path
        // 初始路径
        d="M10,50 Q15,10 50,10 T90,50 T50,90 T10,50 T50,10"
        fill="none"
        stroke="#ef4444" // 对应 Tailwind 的 text-red-500 颜色
        strokeWidth={isSelected ? "2" : "3"}
        strokeLinecap="round"
        strokeDasharray={isSelected ? "5, 5" : "none"} // 选中状态使用虚线
        
        // 初始状态：路径长度为0（不可见），透明度0
        initial={{ pathLength: 0, opacity: 0 }}
        
        // 动画状态
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          // 路径变形动画：模拟手绘线条不稳定的“抖动”效果
          d: [
             "M10,50 Q15,10 50,10 T90,50 T50,90 T10,50 T50,10", // 状态 A
             "M12,48 Q18,8 52,12 T88,52 T48,92 T12,48 T52,12",  // 状态 B (稍微变形)
             "M10,50 Q15,10 50,10 T90,50 T50,90 T10,50 T50,10"  // 回到 状态 A
          ]
        }}
        
        // 动画过渡配置
        transition={{ 
          // 画圆圈的过程（描边动画）持续 0.5秒
          pathLength: { duration: 0.5, ease: "easeOut" },
          // 抖动动画无限循环，持续 4秒
          d: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </svg>
  );
}
