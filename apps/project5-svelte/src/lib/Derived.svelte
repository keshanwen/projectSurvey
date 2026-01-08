<script lang="ts">
  /*
        $derived 类比 computed


        本质上，$derived(expression) 等同于 $derived.by(() => expression)
    
    **/
  let count = $state(0);
  let doubled = $derived(count * 2);

  let numbers = $state([1, 2, 3]);
  let total = $derived.by(() => {
    let total = 0;
    for (const n of numbers) {
      total += n;
    }
    return total;
  });
</script>

<button onclick={() => count++}>
  {doubled}
</button>

<p>{count} 的两倍是 {doubled}</p>

<button onclick={() => numbers.push(numbers.length + 1)}>
  {numbers.join(" + ")} = {total}
</button>
