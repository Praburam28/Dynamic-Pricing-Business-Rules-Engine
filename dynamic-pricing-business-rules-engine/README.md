# ⚡ Dynamic Pricing & Business Rules Engine

<p align="center">
  <strong>A reusable, configurable pricing platform for managing products, customers, promotions, and dynamic business rules without changing application source code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.14-blue?logo=python" alt="Python 3.14">
  <img src="https://img.shields.io/badge/FastAPI-REST%20API-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis" alt="Redis">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker">
</p>

---

## 📌 Overview

The **Dynamic Pricing & Business Rules Engine** is a full-stack application designed to calculate product prices dynamically based on configurable business rules.

Instead of hard-coding pricing logic inside application code, administrators can create and manage rules through APIs and the web interface.

Rules can consider factors such as:

- 👤 Customer type
- 📦 Quantity
- 📍 Location
- 🏷️ Product category
- 💰 Base price
- 🎟️ Promotions
- 📅 Start/end dates
- 🔢 Rule priority
- ⚙️ Rule execution strategy

The pricing engine evaluates the applicable rules and produces a transparent pricing breakdown.

---

## ✨ Key Features

### 🔐 Authentication & RBAC
- User registration and login
- JWT-based authentication
- Admin and user roles
- User activation/deactivation
- Role management
- Protected API endpoints

### 📦 Product Management
- Product CRUD
- SKU management
- Base price management
- Category assignment
- Product activation/deactivation
- Search and filtering
- Pagination and sorting

### 👥 Customer Management
- Customer CRUD
- Customer types:
  - Regular
  - Premium
  - Business
  - Wholesale
- Customer category
- Location
- Account status
- Activation/deactivation
- Search and filtering

### 🏷️ Category Management
- Create and update categories
- Category descriptions
- Active/inactive status
- Product-category relationship

### ⚙️ Dynamic Pricing Rules
Administrators can configure:

- Rule name and description
- Priority
- Conditions
- Actions
- Execution type
- Maximum discount
- Start/end dates
- Active/inactive status

Supported execution types:

| Type | Purpose |
|---|---|
| `COMBINABLE` | Can be combined with other applicable discounts |
| `EXCLUSIVE` | Takes priority over combinable discounts |
| `OVERRIDE` | Overrides the calculated price/discount |

### 🧠 Rule Conditions

Supported fields include:

- `customer_type`
- `customer_category`
- `location`
- `quantity`
- `category_id`
- `product_id`
- `base_price`
- `promotion_code`

Supported operators:

```text
=
!=
>
>=
<
<=
IN
NOT_IN
CONTAINS
```

Rules can use logical conditions such as **AND / OR**.

### 🎟️ Promotions
- Promotion codes
- Percentage discounts
- Fixed discounts
- Minimum purchase amount
- Maximum discount
- Start/end dates
- Usage limits
- Usage tracking
- Promotion validation
- Activation/deactivation

### 💰 Pricing Calculation

The pricing engine follows a structured pipeline:

```text
                    ┌───────────────┐
                    │   Base Price  │
                    └───────┬───────┘
                            ↓
                  ┌───────────────────┐
                  │ Applicable Rules │
                  └─────────┬─────────┘
                            ↓
                  ┌───────────────────┐
                  │     Discounts     │
                  └─────────┬─────────┘
                            ↓
                  ┌───────────────────┐
                  │ Additional Charges│
                  └─────────┬─────────┘
                            ↓
                  ┌───────────────────┐
                  │    Promotion      │
                  └─────────┬─────────┘
                            ↓
                  ┌───────────────────┐
                  │       Tax         │
                  └─────────┬─────────┘
                            ↓
                  ┌───────────────────┐
                  │    Final Price    │
                  └───────────────────┘
```

### 🧪 Rule Testing
Administrators can test a pricing rule with sample input before using it in production.

The tester evaluates:
- Rule conditions
- Customer information
- Product information
- Quantity
- Base price
- Matching status
- Discount amount

### 📊 Pricing History
Every pricing calculation can be recorded with:
- Product
- Customer
- Quantity
- Original price
- Discount
- Tax
- Final price
- Promotion code
- Applied rules
- Calculation timestamp

### 📈 Dashboard & Analytics
The dashboard provides:
- Total calculations
- Original pricing value
- Discount totals
- Tax totals
- Final pricing value
- Active products
- Active customers
- Active pricing rules
- Recent calculations
- Rule usage analytics

### ⚡ Redis Caching
Redis is used for frequently accessed pricing-rule data to reduce unnecessary database queries and improve pricing-engine performance.

### 🐳 Docker
The project includes Docker Compose configuration for:

```text
MySQL
Redis
FastAPI Backend
```

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         React Frontend                        │
│                 React + TypeScript + MUI                     │
└───────────────────────────────┬───────────────────────────────┘
                                │ REST / JSON
                                ↓
┌───────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                         │
│                                                               │
│  Routers → Services → Repositories → SQLAlchemy ORM          │
│                                                               │
│              ┌────────────────────────────┐                   │
│              │      Pricing Engine        │                   │
│              │                            │                   │
│              │ Condition Evaluator        │                   │
│              │ Rule Executor              │                   │
│              │ Discount Calculator        │                   │
│              │ Conflict Resolver          │                   │
│              │ Tax Calculator             │                   │
│              └────────────────────────────┘                   │
└───────────────┬──────────────────────────────┬────────────────┘
                │                              │
                ↓                              ↓
        ┌───────────────┐              ┌───────────────┐
        │    MySQL      │              │     Redis     │
        │   Database    │              │     Cache     │
        └───────────────┘              └───────────────┘
```

---

# 🧰 Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| Python 3.14 | Backend language |
| FastAPI | REST API framework |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| Pydantic | Request/response validation |
| MySQL 8.0 | Relational database |
| Redis 7 | Caching |
| JWT | Authentication |
| bcrypt | Password hashing |
| PyMySQL | MySQL driver |
| Pytest | Testing |

## Frontend

| Technology | Purpose |
|---|---|
| React | UI framework |
| TypeScript | Type-safe frontend development |
| Vite | Frontend build tool |
| Material UI | UI components |
| Axios | HTTP client |
| React Router | Application routing |
| Chart.js | Analytics visualizations |

## Development Tools

```text
Visual Studio Code
Git
GitHub
Docker
Docker Compose
MySQL Workbench
Postman
Swagger / OpenAPI
Figma
```

---

# 📁 Project Structure

```text
dynamic-pricing-business-rules-engine/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── cache.py
│   │   │   ├── exceptions.py
│   │   │   ├── logging.py
│   │   │   └── security.py
│   │   │
│   │   ├── engine/
│   │   │   ├── condition_evaluator.py
│   │   │   ├── conflict_resolver.py
│   │   │   ├── discount_calculator.py
│   │   │   ├── pricing_engine.py
│   │   │   ├── rule_executor.py
│   │   │   └── tax_calculator.py
│   │   │
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🗄️ Database Design

The system uses **MySQL 8.0**.

### Core Tables

```text
roles
  │
  └── users

categories
  │
  └── products

customers

pricing_rules
  │
  ├── rule_conditions
  └── rule_actions

promotions

pricing_calculations
  │
  └── calculation_rules
```

### Main Relationships

```text
Role ────────────────< User

Category ────────────< Product

PricingRule ─────────< RuleCondition
PricingRule ─────────< RuleAction

Product ─────────────< PricingCalculation
Customer ────────────< PricingCalculation

PricingCalculation ──< CalculationRule
PricingRule ─────────< CalculationRule
```

Database migrations are managed using **Alembic**.

---

# 🧠 Example Pricing Rules

### Premium Customer Discount

```text
Condition:
customer_type = PREMIUM

Action:
10% discount

Priority:
10

Execution:
COMBINABLE
```

### Bulk Quantity Discount

```text
Condition:
quantity >= 10

Action:
5% discount

Priority:
20

Execution:
COMBINABLE
```

### Electronics Bulk Discount

```text
Conditions:
category_id = 1
AND
quantity >= 5

Action:
8% discount

Priority:
30

Execution:
COMBINABLE
```

---

# 💡 Example Calculation

Suppose:

```text
Product Base Price = ₹1,000
Quantity            = 10
Customer Type       = PREMIUM
Tax Rate            = 18%
```

Applicable rules:

```text
Premium Discount = 10%
Bulk Discount    = 5%
```

Calculation:

```text
Original Price
₹1,000 × 10
= ₹10,000

Total Discount
10% + 5%
= ₹1,500

Price After Discount
₹10,000 - ₹1,500
= ₹8,500

Tax
18% of ₹8,500
= ₹1,530

Final Price
₹8,500 + ₹1,530
= ₹10,030
```

---

# 🔐 Security

The application includes:

- JWT Bearer authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Active/inactive user validation
- Request validation using Pydantic
- Configurable secrets through environment variables
- No arbitrary SQL or executable rule code

Dynamic rules are represented as structured conditions and actions rather than allowing administrators to execute arbitrary application code.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd dynamic-pricing-business-rules-engine
```

---

## 2. Configure Environment Variables

Create:

```text
backend/.env
```

Example:

```env
APP_NAME=Dynamic Pricing & Business Rules Engine
APP_ENV=development
DEBUG=True

DATABASE_URL=mysql+pymysql://pricing_user:pricing_password@127.0.0.1:3310/dynamic_pricing_db

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3310
MYSQL_DATABASE=dynamic_pricing_db
MYSQL_USER=pricing_user
MYSQL_PASSWORD=pricing_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6382
REDIS_DB=0

JWT_SECRET_KEY=change_this_to_a_secure_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Never commit real passwords, JWT secrets, or other sensitive credentials to GitHub.

---

# 🐳 Run with Docker

From the project root:

```powershell
docker compose up -d --build
```

Check containers:

```powershell
docker compose ps
```

Expected services:

```text
dynamic_pricing_mysql
dynamic_pricing_redis
dynamic_pricing_backend
```

Run migrations:

```powershell
docker exec -it dynamic_pricing_backend alembic upgrade head
```

---

# 🖥️ Run Backend Locally

Go to the backend:

```powershell
cd backend
```

Create virtual environment:

```powershell
python -m venv .venv
```

Activate:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start FastAPI:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 🎨 Run Frontend

Go to frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start development server:

```powershell
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 📚 API Documentation

FastAPI automatically generates OpenAPI documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

### OpenAPI JSON

```text
http://127.0.0.1:8000/openapi.json
```

Use the **Authorize** button in Swagger to provide the JWT Bearer token.

---

# 📮 Postman

A complete Postman collection is included with the project documentation.

Collection structure:

```text
01 Authentication
02 Users
03 Categories
04 Products
05 Customers
06 Pricing Rules
07 Promotions
08 Pricing
09 Rule Testing
10 Pricing History
11 Dashboard
```

Import the collection into Postman and configure:

```text
base_url = http://127.0.0.1:8000
token    = <JWT access token>
```

---

# 🧪 Testing

Run backend tests from the `backend` directory:

```powershell
pytest
```

For verbose output:

```powershell
pytest -v
```

The test suite is intended to cover pricing-engine components such as:

```text
Condition Evaluation
Rule Execution
Discount Calculation
Conflict Resolution
Tax Calculation
Pricing Engine
```

---

# 🔄 API Workflow

A typical pricing request follows:

```text
1. Authenticate
       ↓
2. Select Product
       ↓
3. Select Customer
       ↓
4. Submit Quantity
       ↓
5. Load Active Pricing Rules
       ↓
6. Evaluate Conditions
       ↓
7. Resolve Rule Priority/Conflicts
       ↓
8. Apply Discounts
       ↓
9. Validate Promotion
       ↓
10. Apply Tax
       ↓
11. Calculate Final Price
       ↓
12. Save Pricing History
       ↓
13. Return Pricing Breakdown
```

---

# ⚡ Performance & Scalability

The architecture is designed to support future scaling through:

- Redis caching
- Database indexes
- Repository/service separation
- Stateless JWT authentication
- Independent pricing-engine logic
- Dockerized services
- Configurable environment variables
- Pagination and filtering
- Reusable rule evaluation components

---

# 🎯 Design Principles

### Separation of Concerns

```text
Router
   ↓
Service
   ↓
Repository
   ↓
Database
```

Pricing logic is kept separate:

```text
Pricing Service
      ↓
Pricing Engine
      ↓
Rule Evaluator
      ↓
Rule Executor
      ↓
Discount / Conflict / Tax Calculators
```

This makes the pricing engine reusable independently of API routes.

---

# 🛣️ Future Enhancements

Potential future improvements include:

- 📊 Advanced revenue and pricing analytics
- 📅 Date-range dashboard filters
- 🔔 Real-time notifications
- 🧾 Export pricing history to CSV/PDF
- 👤 More granular permissions
- 🔄 Rule versioning
- ↩️ Rule rollback
- 🧪 Full pricing-simulation mode
- 📦 Bulk product import
- 🌐 Multi-currency pricing
- 🏢 Multi-tenant support
- ☁️ Cloud deployment
- 📡 Event-driven pricing updates

---

# 📸 Screenshots

Add screenshots of the application here after deployment:

```text
docs/
├── dashboard.png
├── products.png
├── customers.png
├── pricing-rules.png
├── promotions.png
├── calculator.png
├── pricing-history.png
└── rule-testing.png
```

Example:

```markdown
![Dashboard](docs/dashboard.png)
```

---

# 📋 Project Modules

| Module | Status |
|---|:---:|
| Authentication | ✅ |
| JWT Security | ✅ |
| RBAC | ✅ |
| User Management | ✅ |
| Category Management | ✅ |
| Product Management | ✅ |
| Customer Management | ✅ |
| Pricing Rules | ✅ |
| Rule Conditions | ✅ |
| Rule Actions | ✅ |
| Rule Priority | ✅ |
| Conflict Resolution | ✅ |
| Pricing Engine | ✅ |
| Promotions | ✅ |
| Pricing Calculator | ✅ |
| Rule Testing | ✅ |
| Pricing History | ✅ |
| Redis Caching | ✅ |
| Dashboard | ✅ |
| Swagger/OpenAPI | ✅ |
| Postman Collection | ✅ |
| Docker Compose | ✅ |
| Unit Testing | 🔄 |

---

# 📄 Documentation

Additional project documentation:

- `Swagger_API_Documentation.md`
- `Dynamic_Pricing_Business_Rules_Engine.postman_collection.json`

---

# 🤝 Contribution

Contributions, improvements and suggestions are welcome.

```text
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add/update tests
5. Commit your changes
6. Push the branch
7. Create a Pull Request
```

---

# 👨‍💻 Author

## Praburam R

**Python Developer | FastAPI | React | MySQL | REST APIs**

This project demonstrates practical experience in:

```text
Python
FastAPI
REST API Development
SQLAlchemy
MySQL
Redis
JWT Authentication
RBAC
React
TypeScript
Material UI
Docker
Alembic
Swagger
Postman
Business Rule Engines
Dynamic Pricing
```

---

<p align="center">
  <strong>⚡ Dynamic Rules. Smarter Pricing. Scalable Architecture.</strong>
</p>

<p align="center">
  Built with Python, FastAPI, React, MySQL, Redis and Docker.
</p>
