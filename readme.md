# Game Inventory System

A full‑stack web application for managing game inventory and marketplace trading. Users can view items, list them for trade, and interact with a dynamic marketplace. Admins can add, update, and remove items.

## 🔧 Features
- Browse and manage in‑game items.
- List items for sale or trade in a real‑time marketplace.
- User authentication with role‑based access control.
- Admin dashboard for item and user management.
- Secure RESTful API with input validation and error handling.

## 🖥️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** PostgreSQL

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Parthgogia/game-inventory.git
cd game-inventory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a .env file in the project root:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=game_inventory
JWT_SECRET=your_jwt_secret
```

### 4. Start the server
```bash
cd server
node app.js
```
By default, the server runs on `http://localhost:3000\`. \

### 5. Start the application
```bash
cd client
npm run dev
```

## 🛠️ Admin Functionality
- **Add items:** Create new inventory entries with name, description, stats, image URL, etc.
- **Update items:** Modify existing item details.
- **Delete items:** Remove obsolete or deprecated items.
- **Manage users:** Promote/demote users between admin and player roles.

## 🔑 Authentication & Security
- JWT‑based authentication for secure access.
- Role checks on protected routes.
- Input sanitization and validation to prevent injection attacks.
- HTTPS recommended in production.

## 🙌 Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch: \`git checkout -b feature/YourFeature\`.
3. Commit your changes: \`git commit -m "Add YourFeature"\`.
4. Push to your branch: \`git push origin feature/YourFeature\`.
5. Open a pull request.