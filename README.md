# 🧳 Tourism & Travel Management System

This system will streamline tourism management by allowing customers to browse, book, and pay for tour packages online, while enabling staff, managers, and tour guides to manage bookings, packages, and customer interactions efficiently and let marketing management to track popular packages and how ads are performing. 

## 🛠️ Technologies Used

| Layer | Technology |
|------|------------|
| Frontend | React, Bootstrap |
| Backend | Spring Boot |
| Database | Microsoft SQL Server |
| Tools | Postman, IntelliJ IDEA, VS Code, Git |
| Authentication | JWT (JSON Web Tokens) |

---

## ✨ Features

### 👤 Roles
- **General Manager**: Access to reports, bookings, and payment summaries.
- **Senior Travel Consultant**: Manages travel packages and tour guide.
- **Customer Service Executive**: Handles booking confirmations and customer interaction.
- **Tour Guide**: Views assigned tour plans and updates.
- **Customer**: Searches, books, pays for packages online.
- **Marketing Manager**: Manage promotions, track package performance and maintaining promotions with a calendar. 

### 🔑 Core Functionalities

- **Tour Package Browsing, Booking, and Availability Checks**  
  Customers can search, filter, and browse available tour packages. The system checks real-time availability based on selected dates and confirms bookings instantly. Staff and tour guides are notified accordingly.

- **Secure Online Payments and Refunds**  
  Integration with secure payment gateways enables seamless online payments. The system handles structured cancellation and refund workflows, generating automated receipts and notifications.

- **Dynamic Tour Package Management**  
  Senior Travel Consultants can add, update, or remove tour packages. They can configure discounts, apply seasonal offers, and assign promotional codes. Marketing Managers can analyze package performance to promote trending or highly rated tours.

- **Booking Updates and Management**  
  Authorized staff members can view, manage, and update booking details in real-time to ensure accuracy and support customer needs.

- **Dedicated Tour Guide Management Board**  
  Tour Guides can log in to view ongoing tours assigned to them. They can access detailed itineraries, view customer information, and receive timely updates related to the tour.

- **Customer Feedback and Rating System**  
  After completing a tour, customers can leave ratings and reviews. The system displays average ratings on tour packages. Managers can monitor this feedback to assess service quality and make improvements.

- **Performance Tracking and Reporting**  
  General Managers can generate analytical reports covering bookings, payments, and package performance. Visual dashboards support data-driven decisions and operational efficiency.

---

## ⚙️ System Architecture

- **Frontend:** React app communicating with backend via REST APIs.
- **Backend:** Spring Boot app using layered architecture (Controller → Service → Repository).
- **Database:** SQL Server for data persistence.
- **Security:** JWT-based authentication with role-based access control.

---
