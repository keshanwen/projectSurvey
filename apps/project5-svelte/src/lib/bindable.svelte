<script lang="ts">
  let { value = $bindable(), ...props } = $props();
</script>

<input bind:value {...props} />

<!-- 


    <script>
	import FancyInput from './FancyInput.svelte';

	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>





-->

<style>
  input {
    font-family: "Comic Sans MS";
    color: deeppink;
  }
</style>
