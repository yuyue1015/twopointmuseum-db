// app/data.ts

export interface Exhibit {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  traits: string[];
  source: string;
  base_buzz: number;
  max_buzz: number;
  max_knowledge: number;
  image_url?: string;
}

export const EXHIBITS_DATA: Exhibit[] = [
  {
    id: "1",
    name: "灯笼鱼化石",
    category: "史前",
    subcategory: "化石",
    description: "来自双点海或白骨带的远古生物遗骸。",
    traits: ["无"],
    source: "双点海, 白骨带 - 永逝之湖",
    base_buzz: 0,
    max_buzz: 0,
    max_knowledge: 0,
  },
  {
    id: "2",
    name: "恶龙骨架",
    category: "史前",
    subcategory: "恐龙骨骼",
    description: "好笑的惊吓方式，轻微影响肠胃舒适度。",
    traits: ["特别访客加成", "腹泻的幽默"],
    source: "白骨带 - 阴云山",
    base_buzz: 40,
    max_buzz: 150,
    max_knowledge: 50,
  },
  {
    id: "3",
    name: "冰封冰箱",
    category: "史前",
    subcategory: "冰封珍品",
    description: "维护度降为0%时会发生融化，解冻的展示品只能进行出售。",
    traits: ["冰封"],
    source: "双点海, 白骨带 - 寒冷矿洞, 极暗深渊",
    base_buzz: 50,
    max_buzz: 180,
    max_knowledge: 30,
  },
  {
    id: "4",
    name: "马戏团小丑花",
    category: "自然",
    subcategory: "食人植物",
    description: "偶尔会吞掉访客，把他们变成小丑。健康度降至0%时会死亡/枯萎。",
    traits: ["植物出品（小丑）", "生老病死"],
    source: "冥界, 白骨带 - 冥界展会",
    base_buzz: 30,
    max_buzz: 100,
    max_knowledge: 10,
  },
  {
    id: "5",
    name: "维多利亚时代名流",
    category: "超自然",
    subcategory: "工业时代灵体",
    description: "用音乐天赋提升娱乐度，喜欢家具，极具创意力，提供更多知识。",
    traits: ["作曲家", "室内设计师", "艺术家", "学者", "医生"],
    source: "冥界 - 超自然观测机构",
    base_buzz: 80,
    max_buzz: 300,
    max_knowledge: 150,
  },
  {
    id: "6",
    name: "闹鬼的厕所",
    category: "超自然",
    subcategory: "诅咒物品",
    description: "最糟糕的惊吓方式，严重影响肠胃舒适度（-10%）；恐怖与迷人平衡（娱乐+5%）。",
    traits: ["鬼魅诱惑", "恶灵修复", "厕所跳脸杀", "永恒沉眠", "混沌之雨"],
    source: "冥界 - 深谙瀑布",
    base_buzz: 100,
    max_buzz: 500,
    max_knowledge: 0,
  },
  {
    id: "7",
    name: "异象：轨道图腾",
    category: "太空",
    subcategory: "星界异象",
    description: "提升幸福感，这件展示品上的神秘符号绝对十分关键。",
    traits: ["疗愈之声", "星际异象", "有趣", "令人好奇的", "望而生畏"],
    source: "已知宇宙 - 蓝酪月球",
    base_buzz: 200,
    max_buzz: 800,
    max_knowledge: 100,
  },
  {
    id: "8",
    name: "二十面命运",
    category: "奇幻",
    subcategory: "魔法珍品",
    description: "20点：吸引访客提升热议度；1点：可能导致访客离开。一个充满随机性的魔法骰子。",
    traits: ["神奇魔法"],
    source: "其他",
    base_buzz: 75,
    max_buzz: 220,
    max_knowledge: 0,
  },
  {
    id: "9",
    name: "壶龙果",
    category: "自然",
    subcategory: "食用植物",
    description: "增加喝饱度，但减少肠胃舒适度,健康度降至0%时会死亡/枯萎",
    traits: ["壶龙果", "生老病死"],
    source: "白骨带 - 沉寂河流",
    base_buzz: 0,
    max_buzz: 0,
    max_knowledge: 0,
  },
  {
    id: "10",
    name: "常青香肠树",
    category: "自然",
    subcategory: "食用植物",
    description: "增加吃饱度，但减少肠胃舒适度",
    traits: ["香肠果"],
    source: "白骨带 - 草本绿野",
    base_buzz: 0,
    max_buzz: 0,
    max_knowledge: 0,
  },
  {
    id: "11",
    name: "糖浆树",
    category: "自然",
    subcategory: "食用植物",
    description: "增加喝饱度，但减少肠胃舒适度,健康度降至0%时会死亡/枯萎",
    traits: ["糖浆果", "生老病死"],
    source: "白骨带 - 白费镇与徒劳镇的交界之地",
    base_buzz: 0,
    max_buzz: 0,
    max_knowledge: 0,
  }
];
