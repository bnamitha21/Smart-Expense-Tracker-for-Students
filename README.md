# 💰 Smart Expense Tracker for Students

A full-stack web application designed to help students **track, manage, and analyze daily expenses** efficiently.
This project aims to improve financial awareness and promote better money management habits among students.

---

## 🚀 Features

* 🔐 **User Authentication (JWT-based)**
* ➕ Add, edit, and delete expenses
* 📊 View expense analytics and insights
* 📅 Track daily spending habits
* 💡 Clean and user-friendly interface
* 🔎 Categorize expenses (Food, Travel, etc.)

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js
* HTML, CSS
* Axios

### 🔹 Backend

* Spring Boot
* Spring Security (JWT Authentication)
* REST APIs

### 🔹 Database

* MySQL (Aiven Cloud)

---

## 📂 Project Structure

```
Smart-Expense-Tracker-for-Students/
│
├── expensetrackerFrontend/   # React frontend
├── expensetrackerBackend/    # Spring Boot backend
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

1. Navigate to backend folder:

```
cd expensetrackerBackend
```

2. Configure environment variables:

```
spring.datasource.url=YOUR_DB_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YOUR_SECRET_KEY
```

3. Run the application:

```
mvn spring-boot:run
```

---

### 🔹 Frontend Setup

1. Navigate to frontend folder:

```
cd expensetrackerFrontend
```

2. Install dependencies:

```
npm install
```

3. Start the app:

```
npm start
```

---

## 🌐 Future Enhancements

* 📱 Mobile app integration
* 🔔 Smart reminders for expenses
* 📈 Advanced analytics with AI insights
* 🌍 Multi-currency support

---

## 🎯 Purpose of the Project

Many students struggle with managing expenses due to lack of tracking.
This project provides a **simple and effective solution** to monitor spending and build financial discipline.

---
 Author

Namitha Bajjuri



 📌 Note

This project is built as part of learning full-stack development and showcases real-world implementation of authentication, APIs, and data management.
