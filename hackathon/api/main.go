package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Post struct {
	ID        string `json:"id"`
	UserID    string `json:"user_id"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	dbUser := os.Getenv("MYSQL_USER")
	dbPassword := os.Getenv("MYSQL_PASSWORD")
	dbHost := os.Getenv("MYSQL_HOST")
	dbPort := os.Getenv("MYSQL_PORT")
	dbName := os.Getenv("MYSQL_DATABASE")

	log.Printf("MYSQL_USER: %s", dbUser)
	log.Printf("MYSQL_PASSWORD: %s", dbPassword)
	log.Printf("MYSQL_HOST: %s", dbHost)
	log.Printf("MYSQL_PORT: %s", dbPort)
	log.Printf("MYSQL_DATABASE: %s", dbName)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
}

func signUpHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Received sign up request: %+v", user) // ログ出力

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)"
	_, err = db.Exec(query, user.ID, user.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("User created: %s, email: %s", user.ID, user.Email)
	w.WriteHeader(http.StatusCreated)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var storedUser User
	query := "SELECT id, email, password_hash FROM Users WHERE email = ?"
	err := db.QueryRow(query, user.Email).Scan(&storedUser.ID, &storedUser.Email, &storedUser.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// ここを作る
func makeUserHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Printf("Error decoding signup request: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)"
	_, err = db.Exec(query, user.ID, user.Email, string(hashedPassword))
	if err != nil {
		log.Printf("Error inserting user into database: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("User created: %s, email: %s", user.ID, user.Email)
	w.WriteHeader(http.StatusCreated)
}

func createPostHandler(w http.ResponseWriter, r *http.Request) {
	var post Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		log.Println("Error decoding post request:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Received post request: %+v", post) // ログ出力

	var userID string
	err := db.QueryRow("SELECT id FROM Users WHERE id = ?", post.UserID).Scan(&userID)
	if err != nil {
		log.Println("Error validating user ID:", err)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO Posts (id, user_id, content, created_at) VALUES (UUID(), ?, ?, NOW())"
	_, err = db.Exec(query, post.UserID, post.Content)
	if err != nil {
		log.Println("Error creating post:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("Post created successfully")
	w.WriteHeader(http.StatusCreated)
}

func fetchPostsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, user_id, content, created_at FROM Posts ORDER BY created_at DESC")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		if err := rows.Scan(&post.ID, &post.UserID, &post.Content, &post.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/users/signup", signUpHandler).Methods("POST")
	r.HandleFunc("/api/users/login", loginHandler).Methods("POST")
	r.HandleFunc("/api/posts", createPostHandler).Methods("POST")
	r.HandleFunc("/api/users", makeUserHandler).Methods("POST")
	r.HandleFunc("/api/posts", fetchPostsHandler).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := c.Handler(r)
	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
