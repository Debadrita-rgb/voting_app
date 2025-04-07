# 🗳️ Voting App

A simple and secure voting application where users can sign up using their Aadhar card number and vote for their preferred candidate. Admins can manage candidates but cannot vote.

---

## ✨ Features

- User sign up and login with Aadhar Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete)
- Admin cannot vote

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Debadrita-rgb/voting_app
API Endpoints
🧾 Authentication
🔸 Sign Up
POST /signup – Sign up a user

🔸 Login
POST /login – Login a user

👤 User Profile
🔸 Get Profile
GET /users/profile – Get user profile information

🔸 Change Password
PUT /users/profile/password – Change user password

🧑‍💼 Candidates
🔸 Get Candidates
GET /candidates – Get the list of candidates

🔸 Add Candidate (Admin only)
POST /candidates – Add a new candidate

🔸 Update Candidate (Admin only)
PUT /candidates/:id – Update a candidate by ID

🔸 Delete Candidate (Admin only)
DELETE /candidates/:id – Delete a candidate by ID

🗳️ Voting
🔸 Vote for Candidate (User only)
POST /candidates/vote/:id – Vote for a candidate

🔸 Get Vote Count
GET /candidates/vote/count – Get the count of votes for each candidate
