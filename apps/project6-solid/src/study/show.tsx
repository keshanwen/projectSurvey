import { createSignal, Show } from "solid-js";
import styles from "./index.module.css";
export default function MyComponent() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <Show
        when={count() > 5}
        fallback={
          <>
            <p class={styles.red}>Count: {count()}</p>
            <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
          </>
        }
      >
        <div>Count limit reached</div>
      </Show>
    </div>
  );
}
