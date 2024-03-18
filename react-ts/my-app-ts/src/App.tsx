import logo from "./logo.svg";
import "./App.css";
import Form from "./Form";
import { useState } from "react";

const App = () => {
  const handleSubmit = (name: string, email: string) => {
    console.log("onSubmit:", name, " ", email);
  };
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Form onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
