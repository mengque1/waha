<template>
  <div class="kdm-slot" :class="slotClass">
    <div v-if="empty" class="kdm-slot-empty">空</div>
    <template v-else-if="isFaceDown">
      <div class="kdm-slot-name kdm-facedown">里侧盖卡</div>
      <div class="kdm-slot-sub">未发动</div>
    </template>
    <template v-else-if="isHiddenMonster">
      <div class="kdm-slot-name kdm-facedown">里侧怪兽</div>
      <div class="kdm-slot-sub">DEF ???</div>
    </template>
    <template v-else-if="isCard">
      <div class="kdm-slot-name" :title="card.效果 || ''">{{ card.卡名 }}</div>
      <div class="kdm-slot-meta">{{ metaLine }}</div>
      <div class="kdm-slot-atk">{{ statLine }}</div>
    </template>
    <div v-else class="kdm-slot-name">{{ rawText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: unknown;
  side: '己方' | '对手';
  zone: '前场' | '后场' | '场地';
}>();

const empty = computed(() => {
  const v = props.value as any;
  return v === null || v === undefined || v === '' || v === '空';
});

const isFaceDown = computed(() => props.value === '里侧盖卡' || props.value === '盖卡');
const isHiddenMonster = computed(() => String(props.value || '').includes('里侧'));
const isCard = computed(() => {
  const v = props.value as any;
  return v && typeof v === 'object' && v.卡名;
});
const card = computed(() => (isCard.value ? (props.value as any) : null));
const rawText = computed(() => String(props.value ?? ''));

const isMonster = computed(() => {
  const c = card.value;
  if (!c) return false;
  return /怪兽/.test(c.类型 || '') || (c.ATK !== undefined && c.ATK !== null);
});

const metaLine = computed(() => {
  const c = card.value;
  if (!c) return '';
  const parts: string[] = [];
  if (c.属性) parts.push(c.属性);
  if (c.种族) parts.push(c.种族);
  if (Number(c.阶级) > 0) parts.push('阶级' + c.阶级);
  else if (Number(c.Lv) > 0) parts.push('Lv' + c.Lv);
  if (c.调整) parts.push('调整');
  if (c.类型) parts.push(c.类型);
  return parts.join(' · ');
});

const statLine = computed(() => {
  const c = card.value;
  if (!c) return '';
  if (isMonster.value) {
    return `ATK ${Number(c.ATK) || 0} / DEF ${Number(c.DEF) || 0}` + (Number(c.素材?.length) > 0 ? ` · 素材×${c.素材.length}` : '');
  }
  return '';
});

const slotClass = computed(() => ({
  'kdm-slot--monster': isMonster.value && !isFaceDown.value && !isHiddenMonster.value,
  'kdm-slot--facedown': isFaceDown.value || isHiddenMonster.value,
}));
</script>
