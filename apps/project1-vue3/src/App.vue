<script setup lang="ts">
import { ref } from 'vue' 
import HelloWorld from './components/HelloWorld.vue'
import { sum } from '@project-survey/utils'


let a = ref(1)
let b = ref(2)

const hanleclick = () => {
  a.value += 1;
}

</script>

<template>
  <div>
   <h1>{{ sum(a,b) }}</h1>
   <button @click="hanleclick">click</button>
  </div>
  
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
