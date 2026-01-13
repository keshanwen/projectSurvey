import { createSignal } from "solid-js";
import MyComponent from "./study/show";
import MyClick from "./study/click";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h1>Vite + Solid hello wrold</h1>
      <div class="card red">
        <button onClick={() => setCount(count => count + 1)}>count is {count()}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <MyComponent></MyComponent>
      <MyClick></MyClick>
    </>
  );
}

export default App;
