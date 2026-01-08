<script module>
  // 模块级逻辑在这里
  // (你很少会用到这个)
  export let pageName = "kebi";
</script>

<script lang="ts">
  // 实例级逻辑在这里
  // Svelte 是一个具备响应式来保证DOM与应用数据一直同步的强大框架，比如说事件响应
  let count: number = $state(0);
  const increment = () => {
    count += 1;
    console.log(pageName);
  };

  console.log("counter render~~~~~");
</script>

<button class="red" onclick={increment}>
  count is {count}
  pageName is {pageName}
</button>
