<template>
  <div class="kdm-field" :class="{ 'kdm-field--idle': !inDuel }">
    <!-- 决斗状态条 -->
    <div class="kdm-status">
      <span class="kdm-status-dot" :class="{ on: inDuel }"></span>
      <span class="kdm-status-txt">
        {{ inDuel ? '决斗进行中' : '未在对局' }}
        <template v-if="inDuel">
          ｜ 第 {{ turn }} 回合 ｜ 阶段：{{ stage || '—' }}
        </template>
      </span>
    </div>

    <!-- 对手侧（上半，倒置） -->
    <PlayerSide v-if="inDuel" side="对手" :data="stat" />

    <!-- 分隔 -->
    <div class="kdm-divider"><span>⚔</span></div>

    <!-- 己方侧（下半） -->
    <PlayerSide v-if="inDuel" side="己方" :data="stat" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';
import PlayerSide from './components/PlayerSide.vue';

const store = useDataStore();
const stat = computed(() => (store.data && store.data.stat_data) || store.data || {});
const duel = computed(() => (stat.value && stat.value.决斗) || {});
const inDuel = computed(() => !!(duel.value && duel.value.进行中));
const turn = computed(() => Number(duel.value.回合) || 1);
const stage = computed(() => duel.value.阶段 || '');
</script>
