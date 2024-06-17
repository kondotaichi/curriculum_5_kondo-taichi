import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fireAuth } from './firebase/firebase.js';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userPost, setUserPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(fireAuth, async (user) => {
      setLoggedIn(!!user);
      if (user) {
        setUserID(user.uid);
        fetchPosts();
      }
    });
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
      const user = userCredential.user;

      // FirebaseのUIDを取得してそのままUsersテーブルに保存
      await makeUser(user.uid, email);

      setUserID(user.uid);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };

  const makeUser = async (uid: string, email: string) => {
    try {
      await axios.post('http://localhost:8080/api/users', {
        id: uid,
        email: email,
        password: password, // パスワードも一緒に保存
      });
      console.log("User created");
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(fireAuth, email, password);
      setUserID(userCredential.user.uid);
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(fireAuth);
      setUserID(null);
      setLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Error logging out. Please try again.');
    }
  };

  const makePost = async () => {
    try {
      if (!userID) {
        console.error('No user is logged in');
        setError('No user is logged in. Please log in first.');
        return;
      }
      if (!userPost.trim()) {
        console.error('Post content is empty');
        setError('Post content is empty. Please enter some content.');
        return;
      }

      await axios.post('http://localhost:8080/api/posts', {
        user_id: userID,
        content: userPost,
      });
      console.log("Post created");

      // Reset the user post input
      setUserPost('');

      // Fetch the updated posts list
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post. Please try again.');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error fetching posts. Please try again.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="app">
      <h1>Twitter-like App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loggedIn ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <textarea
            value={userPost}
            onChange={(e) => setUserPost(e.target.value)}
            placeholder="What's happening?"
            className="textarea"
          />
          <button onClick={makePost} className="button">Post</button>
          <div className="posts">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <p>{post.content}</p>
                <button className="button" style={{ marginLeft: "auto" }}>Reply</button>
                <small>Posted by User ID: {post.user_id} at {new Date(post.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;