export interface Exhibit {
  id: string;
  name: string;
  category: string; // 展品主题
  subcategory: string; // 子分类
  description: string; // 对应表格中的"特性效果"或"特殊说明"
  traits: string[]; // 对应表格中的"特性（颜色）"
  source: string; // 对应"所在地图" + "探索点"
  base_buzz: number; // 基础热议度
  max_buzz: number; // 热议度上限
  max_knowledge: number; // 最大知识数量
  image_url?: string; // 预留图片字段
}

export const EXHIBITS_DATA: Exhibit[] = [
  {
    "id": "1",
    "name": "甲壳化石",
    "category": "史前",
    "subcategory": "化石",
    "description": "甲壳化石",
    "traits": [
      "无"
    ],
    "source": "白骨带 - 焦油旷野",
    "base_buzz": 0,
    "max_buzz": 0,
    "max_knowledge": 0,
    "image_url": ""
  },
  {
    "id": "2",
    "name": "异星化石",
    "category": "史前",
    "subcategory": "化石",
    "description": "异星化石",
    "traits": [
      "无"
    ],
    "source": "白骨带 - 焦油旷野",
    "base_buzz": 0,
    "max_buzz": 0,
    "max_knowledge": 0,
    "image_url": ""
  },
  {
    "id": "3",
    "name": "软盘化石",
    "category": "史前",
    "subcategory": "化石",
    "description": "软盘化石",
    "traits": [
      "无"
    ],
    "source": "白骨带 - 焦油旷野",
    "base_buzz": 0,
    "max_buzz": 0,
    "max_knowledge": 0,
    "image_url": ""
  },
  {
    "id": "4",
    "name": "壶龙果",
    "category": "自然",
    "subcategory": "食用植物",
    "description": "增加喝饱度，但减少肠胃舒适