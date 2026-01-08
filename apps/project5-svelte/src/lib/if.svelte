<script>
  let state = $state(200);
</script>

{#if state > 100}
  <p>太热了！</p>
{:else if 80 > state}
  <p>太冷了！</p>
{:else}
  <p>刚刚好！</p>
{/if}
