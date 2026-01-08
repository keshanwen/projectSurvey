<script lang="ts">
  // $state 符文允许你创建响应式状态，这意味着当状态改变时，你的 UI 会作出响应。
  /*

$state 用于数组或简单对象，结果将是一个深度响应式的状态代理

Set 和 Map 这样的类不会被代理，但 Svelte 为这些内置类型提供了响应式实现，可以从 svelte/reactivity 导入


$state.raw.  用 $state.raw 声明的状态不能被改变；它只能被重新赋值


$state.snapshot.   获取深度响应式 $state 代理的静态快照

**/

  let count = $state(0);
  let todos = $state([
    {
      done: false,
      text: "添加更多待办事项"
    }
  ]);
</script>

<button onclick={() => count++}>
  点击次数：{count}
</button>
