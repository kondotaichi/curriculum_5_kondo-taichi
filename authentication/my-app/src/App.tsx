// src/App.tsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase/config";
import { LoginForm } from './components/LoginForm';

const Contents: React.FC = () => {
  return (
    <div>
      <h1>Protected Content</h1>
      <p>ここはログインしたユーザーのみが見られるコンテンツです。</p>
    </div>
  );
};

const App: React.FC = () => {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, user => {
      setLoginUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>My App</h1>
      <LoginForm />
      {loginUser ? (
        <div>
          <p>ログイン成功！ユーザー: {loginUser?.email}</p>
          <Contents />
        </div>
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  );
};

export default App;
