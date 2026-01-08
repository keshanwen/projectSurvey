<script lang="ts">
  /*
    effects 在组件挂载到 DOM 之后运行，并在状态变化后的 微任务 中运行


    可以从 $effect 返回一个函数，该函数将在 effect 重新运行之前立即运行，并在它被销毁之前运行

    $effect 会自动获取在其函数体内 同步 读取的任何响应值（$state、$derived、$props）

    在 await 之后或在 setTimeout 内部等情况下读取的值将不会被追踪。

    effect 仅在它读取的对象发生变化时才重新运行，而不是在对象内部的属性发生变化时。


    $effect.pre

    在 DOM 更新 之前 运行代码

**/

  let size = $state(50);
  let color = $state("#ff3e00");

  let canvas: any;

  $effect(() => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 只要 `color` 或 `size` 发生变化，这段代码就会重新执行
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  });
</script>

<canvas bind:this={canvas} width="100" height="100" />
