<script setup lang="ts">
import { ref } from "vue";
import { sum } from "@project-survey/utils";
import { List } from "@project-survey/ui";

let a = ref(1);
let b = ref(2);
console.log(a, b);
let c = 25;

let d = 34;
let e = 34;
const hanleclick = () => {
  a.value += 1;
};
</script>

<template>
  <div>
    <h1>{{ sum(a, b) }}</h1>
    <button @click="hanleclick">click</button>
    <List />
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
