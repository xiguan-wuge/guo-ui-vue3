<script setup lang="ts">
// import { ref } from 'vue'
import gButton from '../../packages/button/index'
import gBadge from '../../packages/badge/index'
import gIcon from '../../packages/icon/index'
import gConfigProvider from '../../packages/config-provider/index'

defineProps<{ msg: string }>()

// const count = ref(0)
const demoIcon = 'chat-o';
</script>

<template>
  <h1>{{ msg }}</h1>
  <g-button text="anniu" type="primary">主要按钮</g-button>

  <g-badge content="5">
    <div class="child" />
  </g-badge>

  <hr>
  <g-icon :name="demoIcon" color="pink" dot size="40"></g-icon> 
  <br>
  <g-icon name="https://fastly.jsdelivr.net/npm/@vant/assets/icon-demo.png"/>


  <!-- <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p> -->
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

</style>
<style>
.child {
  width: 40px;
  height: 40px;
  background: var(--g-gray-2);
  border-radius: 4px;
}
</style>