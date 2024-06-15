// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { fireAuth } from "./firebase/config";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmailPassword = (): void => {
    signInWithEmailAndPassword(fireAuth, email, password)
      .then(res => {
        const user = res.user;
        alert("ログインユーザー: " + user.email);
      })
      .catch(err => {
        const errorMessage = err.message;
        alert(errorMessage);
      });
  };

  const signUpWithEmailPassword = (): void => {
    createUserWithEmailAndPassword(fireAuth, email, password)
      .then(res => {
        const user = res.user;
        alert("新規ユーザー作成: " + user.email);
      })
      .catch(err => {
        const errorMessage = err.message;
        alert(errorMessage);
      });
  };

  const signOutWithEmailPassword = (): void => {
    signOut(fireAuth).then(() => {
      alert("ログアウトしました");
    }).catch(err => {
      alert(err);
    });
  };

  return (
    <div>
      <div>
        <input 
          type="email" 
          placeholder="メールアドレス" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="パスワード" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <button onClick={signInWithEmailPassword}>
        ログイン
      </button>
      <button onClick={signUpWithEmailPassword}>
        新規ユーザー作成
      </button>
      <button onClick={signOutWithEmailPassword}>
        ログアウト
      </button>
    </div>
  );
};
