import { useState } from "react";

const Form = ({ onSubmit }) => {
  const [name, setName] = useState("");  // 名前を入力するための状態

  const submit = (event) => {
    event.preventDefault();  // フォームのデフォルト送信動作を防止
    onSubmit(name);  // 親コンポーネントのhandleSubmit関数に名前を渡す
    setName("");  // 送信後にフォームをクリア
  };

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={submit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}  // 入力値でname状態を更新
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
