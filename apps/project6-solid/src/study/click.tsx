export default function () {
  // const handler = (data, event) => {
  //   console.log("Data:", data, "Event:", event);
  // };

  // return <button onClick={[handler, "Hello!"]}>Click Me</button>;
  return <button onClick={() => console.log("Clicked!")}>Click Me</button>;
}
