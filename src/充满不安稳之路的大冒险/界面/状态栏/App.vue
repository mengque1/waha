<template>
  <div class="status-panel">
    <!-- 主角面板 -->
    <div class="panel panel-hero">
      <div class="panel-title">
        <i class="fa-solid fa-user"></i> 主角
        <span class="badge">Lv.{{ store.data.主角.等级 }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">❤️ HP</span>
        <div class="bar">
          <div class="bar-fill bar-hp" :style="{ width: hpPct + '%' }"></div>
        </div>
        <span class="stat-value">{{ store.data.主角.HP }}/{{ store.data.主角.最大HP }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">🔮 MP</span>
        <div class="bar">
          <div class="bar-fill bar-mp" :style="{ width: mpPct + '%' }"></div>
        </div>
        <span class="stat-value">{{ store.data.主角.MP }}/{{ store.data.主角.最大MP }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">💗 快感</span>
        <div class="bar">
          <div class="bar-fill bar-pleasure" :style="{ width: heroPleasurePct + '%' }"></div>
        </div>
        <span class="stat-value">{{ store.data.主角.快感度 }}/100</span>
      </div>
      <div class="mini-row">
        <span class="mini-item">💰 {{ store.data.主角.金钱 }}</span>
        <span class="mini-item">⚡ {{ store.data.主角.状态 }}</span>
      </div>
    </div>

    <!-- 同行女孩面板 -->
    <div class="panel panel-girl" v-if="store.data.队伍.当前同行女孩.姓名">
      <div class="panel-title">
        <i class="fa-solid fa-female"></i> {{ store.data.队伍.当前同行女孩.姓名 }}
        <span class="badge">Lv.{{ store.data.队伍.当前同行女孩.等级 }}</span>
        <span class="badge badge-girl">💖 {{ store.data.队伍.当前同行女孩.好感度 }}/100</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">❤️ HP</span>
        <div class="bar">
          <div class="bar-fill bar-hp" :style="{ width: girlHpPct + '%' }"></div>
        </div>
        <span class="stat-value">{{ store.data.队伍.当前同行女孩.HP }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">💗 快感</span>
        <div class="bar">
          <div class="bar-fill bar-pleasure" :style="{ width: girlPleasurePct + '%' }"></div>
        </div>
        <span class="stat-value">{{ store.data.队伍.当前同行女孩.快感度 }}/100</span>
      </div>
      <div class="mini-row">
        <span class="mini-item">⚡ {{ store.data.队伍.当前同行女孩.状态 }}</span>
      </div>
    </div>

    <!-- 战斗面板 -->
    <div class="panel panel-battle">
      <div class="panel-title">
        <i class="fa-solid fa-crosshairs"></i> 战斗
      </div>
      <div class="battle-grid">
        <div class="battle-item">
          <span class="mini-label">进行中</span>
          <span class="battle-value" :class="{ on: store.data.战斗.进行中 }">{{ store.data.战斗.进行中 ? '⚔️ 战斗中' : '待机' }}</span>
        </div>
        <div class="battle-item">
          <span class="mini-label">回合</span>
          <span class="battle-value">{{ store.data.战斗.回合数 }}</span>
        </div>
        <div class="battle-item">
          <span class="mini-label">主角拘束</span>
          <span class="battle-value">{{ store.data.战斗.主角拘束 }}</span>
        </div>
        <div class="battle-item">
          <span class="mini-label">女孩拘束</span>
          <span class="battle-value">{{ store.data.战斗.女孩拘束 }}</span>
        </div>
      </div>
    </div>

    <!-- 世界面板 -->
    <div class="panel panel-world">
      <div class="panel-title">
        <i class="fa-solid fa-map"></i> {{ store.data.世界.当前地区 }}
      </div>
      <div class="world-row">
        <span class="mini-item">📍 {{ store.data.世界.当前场景 }}</span>
        <span class="mini-item">🕐 {{ store.data.世界.日期 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();

const hpPct = computed(() => {
  const max = store.data.主角.最大HP || 1;
  return Math.min(100, Math.max(0, (store.data.主角.HP / max) * 100));
});
const mpPct = computed(() => {
  const max = store.data.主角.最大MP || 1;
  return Math.min(100, Math.max(0, (store.data.主角.MP / max) * 100));
});
const heroPleasurePct = computed(() => Math.min(100, Math.max(0, store.data.主角.快感度)));
const girlHpPct = computed(() => {
  const max = store.data.主角.最大HP || 1;
  const hp = store.data.队伍.当前同行女孩.HP || 0;
  return Math.min(100, Math.max(0, (hp / max) * 100));
});
const girlPleasurePct = computed(() => Math.min(100, Math.max(0, store.data.队伍.当前同行女孩.快感度)));
</script>

<style scoped>
.status-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
  width: 100%;
  padding: 10px;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 10px;
}

.panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 10px;
}

.panel-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 6px;
}

.panel-hero .panel-title { color: var(--c-primary); }
.panel-girl .panel-title { color: var(--c-girl); }
.panel-battle .panel-title { color: var(--c-battle); }
.panel-world .panel-title { color: var(--c-text); }

.badge {
  background: var(--c-primary);
  color: #fff;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 11px;
  margin-left: auto;
}

.badge-girl {
  background: var(--c-girl);
  margin-left: 4px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
}

.stat-label {
  width: 48px;
  color: var(--c-text-muted);
  font-size: 12px;
  flex-shrink: 0;
}

.bar {
  flex: 1;
  height: 10px;
  background: #2a2a44;
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.bar-hp { background: var(--c-hp); }
.bar-mp { background: var(--c-mp); }
.bar-pleasure { background: var(--c-pleasure); }

.stat-value {
  width: 64px;
  text-align: right;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
}

.mini-row {
  display: flex;
  gap: 10px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.mini-item {
  font-size: 12px;
  color: var(--c-text-muted);
}

.battle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.battle-item {
  background: #1e1e3a;
  border-radius: 6px;
  padding: 6px;
  text-align: center;
}

.mini-label {
  display: block;
  font-size: 11px;
  color: var(--c-text-muted);
}

.battle-value {
  font-size: 12px;
  font-weight: 600;
}

.battle-value.on {
  color: var(--c-primary);
}

.world-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
