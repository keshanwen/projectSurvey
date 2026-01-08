<script>
  let count = $state(0);
  let message = $state("hello");

  /*
    
     $inspect 符文大致等同于 console.log，不同之处在于当其参数发生变化时它会重新运行。$inspect 会深度跟踪响应式状态   

     找到某些更改的来源的便捷方法是将 console.trace 传递给 with：

     $inspect(stuff).with(console.trace);

     $effect(() => {
		$inspect.trace();
		doSomeWork();
	});

    **/

  $inspect(count, message); // 当 `count` 或 `message` 改变时会调用 console.log

  $inspect(count).with((type, count) => {
    if (type === "update") {
      debugger; // 或者使用 `console.trace`，或任何你想要的
    }
  });
</script>

<button onclick={() => count++}>递增</button>
<input bind:value={message} />
