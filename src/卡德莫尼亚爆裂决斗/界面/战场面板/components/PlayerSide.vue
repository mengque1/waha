<template>
  <div class="kdm-side" :class="'kdm-side--' + sideKey">
    <!-- 信息行 -->
    <div class="kdm-side-head">
      <span class="kdm-side-name">{{ side === '对手' ? (opp.名字 || '对手') : '己方' }}</span>
      <span class="kdm-side-lp" :class="{ low: lp < 2000 }">LP {{ lp }}</span>
      <span class="kdm-side-count">手牌 {{ handCount }} 张</span>
      <span class="kdm-side-count">卡组 {{ deckCount }} 张</span>
      <span class="kdm-side-count">额外 {{ extraCount }} 张</span>
    </div>

    <!-- 场地魔法 -->
    <div class="kdm-row-label">场地魔法</div>
    <div class="kdm-slot-row">
      <SlotCell :value="fieldSpell" :side="side" zone="场地" />
    </div>

    <!-- 后场（对手倒置 3→1，己方 1→3） -->
    <div class="kdm-row-label">后场</div>
    <div class="kdm-slot-row">
      <template v-if="side === '对手'">
        <SlotCell v-for="i in [3, 2, 1]" :key="i" :value="back[i]" :side="side" zone="后场" />
      </template>
      <template v-else>
        <SlotCell v-for="i in [1, 2, 3]" :key="i" :value="back[i]" :side="side" zone="后场" />
      </template>
    </div>

    <!-- 前场 -->
    <div class="kdm-row-label">前场</div>
    <div class="kdm-slot-row">
      <template v-if="side === '对手'">
        <SlotCell v-for="i in [3, 2, 1]" :key="i" :value="front[i]" :side="side" zone="前场" />
      </template>
      <template v-else>
        <SlotCell v-for="i in [1, 2, 3]" :key="i" :value="front[i]" :side="side" zone="前场" />
      </template>
    </div>

    <!-- 手牌（己方才显示卡面；对手只显示数量，已在头部） -->
    <template v-if="side === '己方'">
      <div class="kdm-row-label">己方手牌</div>
      <div v-if="handList.length" class="kdm-hand">
        <div v-for="(c, idx) in handList" :key="idx" class="kdm-hand-card" :title="c.效果 || ''">
          <div class="kdm-hand-name">{{ c.卡名 }}</div>
          <div class="kdm-hand-meta">{{ handMeta(c) }}</div>
          <div class="kdm-hand-atk">{{ handStat(c) }}</div>
        </div>
      </div>
      <div v-else class="kdm-side-empty">无手牌</div>
    </template>

    <!-- 墓地 / 除外 -->
    <div class="kdm-grave-row">
      <div class="kdm-grave">
        <span class="kdm-grave-label">墓地</span>
        <span class="kdm-grave-list">{{ graveNames(grave) }}</span>
      </div>
      <div class="kdm-grave">
        <span class="kdm-grave-label">除外</span>
        <span class="kdm-grave-list">{{ graveNames(excl) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SlotCell from './SlotCell.vue';

const props = defineProps<{
  side: '己方' | '对手';
  data: any;
}>();

const sideKey = computed(() => (props.side === '对手' ? 'opp' : 'my'));
const duel = computed(() => (props.data && props.data.决斗) || {});
const opp = computed(() => (duel.value.对手 || {}));

const lp = computed(() =>
  props.side === '对手' ? Number(opp.value.LP) || 0 : Number(duel.value.己方LP) || 0,
);
const deckCount = computed(() =>
  props.side === '对手' ? Number(opp.value.卡组数) || 0 : Number(duel.value.己方卡组数) || 0,
);
const extraCount = computed(() =>
  props.side === '对手' ? Number(opp.value.额外数) || 0 : Number(duel.value.己方额外数) || 0,
);
const handCount = computed(() =>
  props.side === '对手'
    ? Number(opp.value.手牌数) || 0
    : Array.isArray(duel.value.己方手牌)
      ? duel.value.己方手牌.length
      : 0,
);
const handList = computed(() =>
  props.side === '己方' && Array.isArray(duel.value.己方手牌) ? duel.value.己方手牌 : [],
);
const front = computed(() =>
  props.side === '对手' ? opp.value.前场 || {} : duel.value.己方前场 || {},
);
const back = computed(() =>
  props.side === '对手' ? opp.value.后场 || {} : duel.value.己方后场 || {},
);
const fieldSpell = computed(() =>
  props.side === '对手' ? opp.value.场地魔法 : duel.value.己方场地魔法,
);
const grave = computed(() =>
  props.side === '对手' ? opp.value.墓地 || [] : duel.value.己方墓地 || [],
);
const excl = computed(() =>
  props.side === '对手' ? opp.value.除外 || [] : duel.value.己方除外 || [],
);

function graveNames(arr: any[]): string {
  if (!Array.isArray(arr) || !arr.length) return '无';
  return arr
    .map((x) => (x && typeof x === 'object' && x.卡名 ? x.卡名 : String(x)))
    .join('、');
}
function handMeta(c: any): string {
  const parts: string[] = [];
  if (c.属性) parts.push(c.属性);
  if (c.种族) parts.push(c.种族);
  if (Number(c.阶级) > 0) parts.push('阶级' + c.阶级);
  else if (Number(c.Lv) > 0) parts.push('Lv' + c.Lv);
  if (c.类型) parts.push(c.类型);
  return parts.join(' · ');
}
function handStat(c: any): string {
  if (/怪兽/.test(c.类型 || '')) return `ATK ${Number(c.ATK) || 0} / DEF ${Number(c.DEF) || 0}`;
  return '';
}
</script>
