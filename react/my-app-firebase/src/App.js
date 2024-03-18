import logo from "./logo.svg";
import "./App.css";
import Form from "./Form";
import { useState } from "react";

function App() {
  const [ageInfo, setAgeInfo] = useState("");  // 年齢情報を表示するための状態

  const handleSubmit = async (name) => {
    const response = await fetch(
      `https://realtimedb-dede8-default-rtdb.firebaseio.com/tweet.json`
    );
    const data = await response.json();

    // データから該当する名前の人物を検索
    const person = Object.values(data).find((person) => person.name === name);
    
    // 該当する人物が見つかった場合、その年齢を10歳加算してセット
    if (person) {
      setAgeInfo(`${person.name} さんは10年後には ${parseInt(person.age) + 10} 才になります.`);
    } else {
      setAgeInfo("Person not found.");  // 人物が見つからなかった場合のメッセージ
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
      <Form onSubmit={handleSubmit} />
      <div>{ageInfo}</div>
    </div>
  );
}

export default App;
