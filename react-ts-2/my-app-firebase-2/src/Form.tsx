import React, { useState, ChangeEvent, FormEvent } from "react";

type FormProps = {
  onSubmit: (name: string) => void;
};

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>("");

  const submit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(name);
    setName("");
  };

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={submit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;

