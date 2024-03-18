export const GreetTS = () => {
  const greet = (name: any) => {
  return "Hello, " + name + "!!";
};

return (
  <div>
    <p>{greet("John")}</p>
    <p>{greet(42)}</p>
    <p>{greet("なんでもよろしい")}</p>

  </div>
)
}
