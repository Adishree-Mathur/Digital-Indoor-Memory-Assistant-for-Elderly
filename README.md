# 🏡 Digital Indoor Memory Assistant for Elderly

## 📌 Overview

The **Digital Indoor Memory Assistant** is a smart web application designed to help elderly individuals remember where they have kept important items inside their home.

Users can upload a layout of their home, mark locations visually, and store item details for easy retrieval later.

---

## 🚀 Key Features

### 📍 Visual Item Placement

* Users can upload a home layout (floor plan/image)
* Click anywhere on the map to place a pin
* Coordinates are captured dynamically (percentage-based positioning)

---

### 📝 Add & Save Items

* Enter item name and description
* Save item along with its exact location on the map
* Each item is associated with:

  * Name
  * Description
  * Coordinates (x, y)

---

### 🔍 Search & Locate Items

* Users can search for stored items
* Matching items are highlighted on the map
* Helps quickly recall where items were kept

---

### 🗺️ Interactive Map UI

* Real-time pin placement
* Visual feedback for selected and saved items
* Highlight animation for searched items

---

### ⚙️ Backend Integration (REST API)

* Built custom REST APIs using **Java Servlets**
* APIs handle:

  * Saving item data (`POST /saveItem`)
  * Retrieving item data (`GET /searchItem`)
* Communication between frontend and backend via **JSON**

---

### 💾 Data Handling

* Frontend uses **localStorage** for persistence
* Backend currently uses **in-memory storage**
* Easily extendable to databases like MySQL or MongoDB

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML, CSS, JavaScript

### Backend

* Java Servlets
* Apache Tomcat

### Communication

* REST API (HTTP methods: GET, POST)
* JSON data exchange

---

## 🔄 Application Flow

1. User uploads home layout
2. Clicks on map to place item location
3. Enters item details
4. Data is sent to backend via API
5. Item is saved and displayed
6. User can search and locate items later

---

## 🎯 Problem Solved

This project addresses a real-world issue where elderly individuals often forget where they have kept their belongings.
By providing a **visual memory aid**, the system makes recalling item locations simple and intuitive.

---

## 🔮 Future Enhancements

* Database integration (MySQL / MongoDB)
* Voice-based search
* Multi-language support
* AI-based suggestions
* Mobile app version

---

## 👩‍💻 Author

Adishree Mathur

---
