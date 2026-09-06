// ============================================================
// MVU 变量 Schema ——《爆裂决斗：怪兽灾厄录》
// z（Zod v4）与 _（lodash）为全局注入，本文件禁止任何 import 语句。
// Schema 用于增量解析世界状态更新，Schema.parse 的输出可直接作为
// 下一次 Schema.parse 的输入（幂等）。
// ============================================================

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeRoot(raw) {
  if (!isPlainObject(raw)) return raw;
  return raw;
}

// 宽松字符串：undefined/null/空 → fallback
const LooseString = (fallback = '') => z.preprocess(
  v => (v === undefined || v === null || v === '' ? fallback : String(v)),
  z.string()
).prefault(fallback);

// 非负整数：coerce + clamp + 去小数
const NonNegInt = (fallback = 0) => z.coerce.number()
  .transform(v => (Number.isFinite(v) ? Math.max(0, Math.floor(v)) : fallback))
  .prefault(fallback);

// 卡面对象（收藏记录 / 手牌 / 场上通用）
// 效果字段保存完整效果文本，禁止省略；passthrough 防止 LLM 扩展字段被剥离
const CardSchema = z.object({
  卡名: LooseString(''),
  稀有度: LooseString('N'),
  属性: LooseString(''),
  种族: LooseString(''),
  Lv: NonNegInt(1),          // 等级（超量怪兽写 0）
  阶级: NonNegInt(0),        // 超量怪兽的阶级（Rank）；非超量 = 0
  调整: z.boolean().prefault(false),  // 同调素材：是否为调整（Tuner）怪兽
  ATK: NonNegInt(0),
  DEF: NonNegInt(0),
  类型: LooseString(''),
  效果: LooseString(''),
  素材: z.preprocess(v => {
    if (v === undefined || v === null) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'object') return [];        // {} 等对象 → 空数组
    return [String(v)];                          // 字符串 → [字符串]
  }, z.array(z.string())).prefault([]),  // 融合素材(字符串) 或 超量素材(数组)，容忍任意输入
}).passthrough().prefault({});

// 场上格子：null（空）、字符串标记（盖卡/里侧盖卡等）、或卡面对象；非法值 catch 兜底为 null
const SlotSchema = z.union([z.null(), z.string(), CardSchema]).catch(null);

// 前场（3 格）
const ZoneSchema = z.object({
  怪兽区1: SlotSchema,
  怪兽区2: SlotSchema,
  怪兽区3: SlotSchema,
}).prefault({});

// 后场（3 格）
const BackZoneSchema = z.object({
  魔陷区1: SlotSchema,
  魔陷区2: SlotSchema,
  魔陷区3: SlotSchema,
}).prefault({});

// 墓地/除外：字符串卡名 或 完整卡面对象（对手卡必须带效果字段，见《对手卡卡面协议》与《铁律-卡牌效果展示》）
const GraveItem = z.union([z.string(), CardSchema]).catch('');
const GraveArray = z.array(GraveItem).prefault([]);

// 卡组：每张卡一个完整卡面记录（数组，含效果），整理卡组时从收藏复制而来；
// 战斗抽卡直接取该数组元素，保证卡面/效果与收藏一致，无需再回头查收藏
const DeckSchema = z.object({
  主卡组: z.array(CardSchema).prefault([]),
  额外卡组: z.array(CardSchema).prefault([]),
}).prefault({});

export const Schema = z.preprocess(normalizeRoot, z.object({
  user: z.object({
    等级: LooseString('无'),   // 决斗者等级 F~Z
    DP: NonNegInt(0),          // 决斗点数
    龙币: NonNegInt(0),        // 货币
    收藏: z.array(CardSchema).prefault([]),   // 卡籍登记：完整卡面，append-only
    出战卡组: DeckSchema,      // 主 20-40 / 额外 ≤10
    卡组库: z.record(z.string(), DeckSchema).prefault({}), // 命名卡组预设
    素材: z.record(z.string(), z.object({ // 制卡素材槽：主题→品级五槽（如 {"鱼":{白材:3,青材:1}}），见《机制-素材来源与分级》
      白材: NonNegInt(0),
      青材: NonNegInt(0),
      红材: NonNegInt(0),
      金材: NonNegInt(0),
      彩材: NonNegInt(0),
    })).prefault({}),
  }).prefault({}),
  决斗: z.object({
    进行中: z.boolean().prefault(false),
    回合: NonNegInt(1),
    阶段: LooseString(''),     // 抽卡/准备/主要1/战斗/主要2/结束
    己方LP: NonNegInt(8000),
    己方手牌: z.array(CardSchema).prefault([]),  // 携带全卡面（含效果）
    己方前场: ZoneSchema,
    己方后场: BackZoneSchema,
    己方场地魔法: SlotSchema,
    己方卡组数: NonNegInt(0),  // 剩余张数（随抽卡 -1）
    己方额外数: NonNegInt(0),
    己方墓地: GraveArray,
    己方除外: GraveArray,
    对手: z.object({
      名字: LooseString(''),
      LP: NonNegInt(8000),
      手牌数: NonNegInt(0),
      卡组数: NonNegInt(0),
      额外数: NonNegInt(0),
      前场: ZoneSchema,
      后场: BackZoneSchema,
      场地魔法: SlotSchema,
      墓地: GraveArray,
      除外: GraveArray,
    }).prefault({}),
  }).prefault({}),
}));

export type SchemaType = z.infer<typeof Schema>;
