// ============================================================
// MVU 变量 Schema ——《充满不安稳之路的大冒险》
// z（Zod v4）与 _（lodash）为全局注入，本文件禁止任何 import 语句。
// Schema 用于增量解析世界状态更新，Schema.parse 的输出可直接作为
// 下一次 Schema.parse 的输入（幂等）。
// ============================================================

export const Schema = z.object({
  // ---- 主角 ----
  主角: z.object({
    姓名: z.string().prefault(''),
    性别: z.string().prefault(''),
    等级: z.coerce.number().transform(v => _.max([1, v])).prefault(1),
    经验值: z.coerce.number().prefault(0),
    金钱: z.coerce.number().prefault(0),
    HP: z.coerce.number().transform(v => _.max([0, v])).prefault(0),
    最大HP: z.coerce.number().transform(v => _.max([0, v])).prefault(1),
    MP: z.coerce.number().transform(v => _.max([0, v])).prefault(0),
    最大MP: z.coerce.number().transform(v => _.max([0, v])).prefault(1),
    快感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    状态: z.string().prefault('正常'),
  }).prefault({}),

  // ---- 世界 ----
  世界: z.object({
    当前地区: z.string().prefault(''),
    当前场景: z.string().prefault(''),
    日期: z.string().prefault(''),
  }).prefault({}),

  // ---- 队伍 ----
  队伍: z.object({
    当前同行女孩: z.object({
      姓名: z.string().prefault(''),
      好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      等级: z.coerce.number().transform(v => _.max([1, v])).prefault(1),
      HP: z.coerce.number().transform(v => _.max([0, v])).prefault(0),
      快感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      状态: z.string().prefault('正常'),
    }).prefault({}),
  }).prefault({}),

  // ---- 战斗 ----
  战斗: z.object({
    进行中: z.boolean().prefault(false),
    回合数: z.coerce.number().prefault(0),
    战斗结果: z.string().prefault('无'),
    主角拘束: z.string().prefault('无'),
    女孩拘束: z.string().prefault('无'),
  }).prefault({}),
}).prefault({});

export type SchemaType = z.infer<typeof Schema>;
