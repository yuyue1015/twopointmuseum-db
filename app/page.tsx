'use client';

import { useState, useMemo } from 'react';
import { Search, Compass, AlertTriangle, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { DILEMMA_DATA, DilemmaRecord } from './dilemma-data';

// --- 配置区域 ---
const FORM_URL = "https://你的企业域.feishu.cn/share/base/form/xxxxxxxx"; 
// ---------------

interface GroupedDilemma {
  name: string;
  map: string;
  options: DilemmaRecord[];
}

export default function DilemmaSearchApp() {
  const [query, setQuery] = useState('');

  // 搜索与分组逻辑
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();

    // 1. 过滤
    const filteredRows = DILEMMA_DATA.filter(item => 
      (item.dilemma?.toLowerCase().includes(lowerQuery)) ||
      (item.map?.toLowerCase().includes(lowerQuery))
    );

    // 2. 分组
    const groups: { [key: string]: GroupedDilemma } = {};
    filteredRows.forEach(row => {
      if (!groups[row.dilemma]) {
        groups[row.dilemma] = { name: row.dilemma, map: row.map, options: [] };
      }
      groups[row.dilemma].options.push(row);
    });

    return Object.values(groups);
  }, [query]);

  return (
    <div className="
