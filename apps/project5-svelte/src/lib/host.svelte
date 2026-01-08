<!-- 将组件定义为一个自定义元素，命名为 my-stepper，使其可以在标准 HTML 中使用。 -->
<svelte:options customElement="my-stepper" />

<script>
  /*
    
    <svelte:options customElement="my-stepper" />: 这行代码将组件定义为一个自定义元素，命名为 my-stepper，使其可以在标准 HTML 中使用。

    $host(): 这是 Svelte 提供的一个特殊函数，用于获取当前自定义元素的宿主元素（即 web component 的根元素）。

    CustomEvent: 创建一个自定义事件，通过按钮点击触发，可以被外部监听和响应。

    事件分发: 按钮点击时会触发 "decrement" 或 "increment" 事件，允许外部代码监听这些事件并执行相应的逻辑。
    
    **/
  function dispatch(type) {
    // 用于获取当前自定义元素的宿主元素（即 web component 的根元素）。
    $host().dispatchEvent(new CustomEvent(type));
  }
</script>

<button onclick={() => dispatch("decrement")}>decrement</button>
<button onclick={() => dispatch("increment")}>increment</button>
