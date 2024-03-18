import React, { useState } from 'react';
import logo from "./logo.svg";
import "./App.css";
import Form from "./Form";

// 人物を表す型を定義します。
interface Person {
  name: string;
  age: string;
}

const App: React.FC = () => {
  const [ageInfo, setAgeInfo] = useState<string>("");

  const handleSubmit = async (name: string) => {
    const response = await fetch(
      `https://realtimedb-dede8-default-rtdb.firebaseio.com/tweet.json`
    );
    const data = await response.json();

    // Object.valuesの各要素をPersonとして扱うように変更
    const person = (Object.values(data) as Person[]).find(person => person.name === name);
    
    // 該当する人物が見つかった場合、その年齢を10歳加算してセット
    if (person) {
      setAgeInfo(`${person.name} さんは10年後には ${parseInt(person.age) + 10} 才になります.`);
    } else {
      setAgeInfo("Person not found.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.tsx</code> and save to reload.</p>
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
