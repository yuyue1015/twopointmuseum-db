// 文件路径: components/HandDrawnCircle.tsx
'use client';

import { motion } from 'framer-motion';

// isSelected: true=选中状态(虚线/细线), false=搜索高亮(粗线/实线)
export default function HandDrawnCircle({ isSelected = false }: { isSelected?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
        isSelected ? 'w-[140%] h-[140%]' : 'w-[180%] h-[180%]' // 调整圈的大小
      }`}
      style={{ overflow: 'visible' }}
    >
      <motion.path
        // 这里是手绘风格的不规则圆路径
        d="M10,50 Q15,10 50,10 T90,50 T50,90 T10,50 T50,10" 
        fill="none"
        stroke="#ef4444" // Tailwind red-500
        strokeWidth={isSelected ? "2" : "3"}
        strokeLinecap="round"
        strokeDasharray={isSelected ? "5, 5" : "none"} // 选中时可以是虚线，看你喜好
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          // 让圈圈一直有轻微的蠕动感，像是在呼吸或手绘线条在抖动
          d: [
             "M10,50 Q15,10 50,10 T90,50 T50,90 T10,50 T50,10",
             "M12,48 Q18,8 52,12 T88,52 T48,92 T12,48 T52,12",
             "M10,50 Q15,10 50,10 T90,50 T50,90 T10,50 T50,10"
          ]
        }}
        transition={{ 
          pathLength: { duration: 0.5, ease: "easeOut" },
          d: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </svg>
  );
}
