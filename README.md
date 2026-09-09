<h1 align="center">⚡ Dynamic Pricing & Business Rules Engine</h1>

<p align="center">
  <strong>A reusable, configurable pricing platform for managing products, customers, promotions, and dynamic business rules without changing application source code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white" alt="Python 3.14">
  <img src="https://img.shields.io/badge/FastAPI-REST%20API-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=black" alt="React TypeScript">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker">
</p>

📌 Overview

The Dynamic Pricing & Business Rules Engine is a full-stack application designed to calculate product prices dynamically based on configurable business rules.

Instead of hard-coding pricing logic inside application code, administrators can create and manage pricing rules through APIs and the web interface.

Rules can consider:

👤 Customer type

📦 Quantity

📍 Location

🏷️ Product category

💰 Base price

🎟️ Promotions

📅 Start/end dates

🔢 Rule priority

⚙️ Rule execution strategy

The pricing engine evaluates applicable rules and returns a transparent pricing breakdown.

✨ Key Features

🔐 Authentication & RBAC

User registration and login

JWT-based authentication

Admin and user roles

User activation/deactivation

Role management

Protected API endpoints

📦 Product Management

Product CRUD

SKU management

Base price management

Category assignment

Product activation/deactivation

Search and filtering

Pagination and sorting

👥 Customer Management

Customer CRUD

Customer types:

Regular

Premium

Business

Wholesale

Customer category

Location

Account status

Activation/deactivation

Search and filtering

🏷️ Category Management

Create and update categories

Category descriptions

Active/inactive status

Product-category relationship

⚙️ Dynamic Pricing Rules

Administrators can configure:

Rule name and description

Priority

Conditions

Actions

Execution type

Maximum discount

Start/end dates

Active/inactive status

Execution Type

Purpose

COMBINABLE

Can be combined with other applicable discounts

EXCLUSIVE

Takes priority over combinable discounts

OVERRIDE

Overrides the calculated price/discount

🧠 Rule Conditions

Supported fields:

customer_type
customer_category
location
quantity
category_id
product_id
base_price
promotion_code

Supported operators:

=
!=
>
>=
<
<=
IN
NOT_IN
CONTAINS

Rules support logical conditions such as AND / OR.

🎟️ Promotions

Promotion codes

Percentage and fixed discounts

Minimum purchase amount

Maximum discount

Start/end dates

Usage limits

Usage tracking

Promotion validation

Activation/deactivation

💰 Pricing Calculation

The pricing calculation follows a clear pipeline:

flowchart TD
    A[Base Price] --> B[Applicable Rules]
    B --> C[Discounts]
    C --> D[Additional Charges]
    D --> E[Promotion]
    E --> F[Tax]
    F --> G[Final Price]

🧪 Rule Testing

Administrators can test pricing rules with sample inputs before using them in production.

The tester evaluates:

Rule conditions

Customer information

Product information

Quantity

Base price

Match status

Discount amount

📊 Pricing History

Pricing calculations can record:

Product

Customer

Quantity

Location

Promotion code

Original price

Discount

Tax

Final price

Applied rules

Calculation timestamp

📈 Dashboard & Analytics

The dashboard provides:

Total calculations

Original pricing value

Discount totals

Tax totals

Final pricing value

Active products

Active customers

Active pricing rules

Recent calculations

Rule usage analytics

Pricing trend visualization

Rule performance visualization

⚡ Redis Caching

Redis is used to cache frequently accessed pricing-rule data and reduce unnecessary database queries.

🐳 Docker

Docker Compose provides containerized services for:

MySQL

Redis

FastAPI Backend

🏗️ System Architecture

flowchart TB
    FE["React Frontend<br/>React + TypeScript + Material UI"]

    API["FastAPI Backend"]

    ROUTER["API Routers"]
    SERVICE["Business Services"]
    REPO["Repositories"]
    ORM["SQLAlchemy ORM"]

    ENGINE["Pricing Engine"]
    EVAL["Condition Evaluator"]
    EXEC["Rule Executor"]
    DISC["Discount Calculator"]
    CONFLICT["Conflict Resolver"]
    TAX["Tax Calculator"]

    DB[("MySQL 8.0")]
    REDIS[("Redis 7")]

    FE -->|REST / JSON| API
    API --> ROUTER
    ROUTER --> SERVICE
    SERVICE --> REPO
    REPO --> ORM
    ORM --> DB

    SERVICE --> ENGINE
    ENGINE --> EVAL
    ENGINE --> EXEC
    ENGINE --> DISC
    ENGINE --> CONFLICT
    ENGINE --> TAX

    SERVICE <--> REDIS

Architecture Pattern

Router
   ↓
Service
   ↓
Repository
   ↓
SQLAlchemy
   ↓
MySQL

Pricing logic is kept independent from API routes:

Pricing Service
      ↓
Pricing Engine
      ↓
Rule Evaluator
      ↓
Rule Executor
      ↓
Discount / Conflict / Tax Calculators

🧰 Tech Stack

Backend

Technology

Purpose

Python 3.14

Backend language

FastAPI

REST API framework

SQLAlchemy

ORM

Alembic

Database migrations

Pydantic

Request/response validation

MySQL 8.0

Relational database

Redis 7

Caching

JWT

Authentication

bcrypt

Password hashing

PyMySQL

MySQL driver

Pytest

Testing

Frontend

Technology

Purpose

React

UI framework

TypeScript

Type-safe development

Vite

Build tool

Material UI

UI components

Axios

HTTP client

React Router

Application routing

Chart.js

Analytics visualization

Development Tools

Tool

Purpose

Visual Studio Code

Development

Git

Version control

GitHub

Source control

Docker

Containerization

Docker Compose

Service orchestration

MySQL Workbench

Database management

Postman

API testing

Swagger / OpenAPI

API documentation

Figma

UI design

📁 Project Structure

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

🗄️ Database Design

The application uses MySQL 8.0.

Core Tables

Table

Purpose

roles

Application roles

users

User accounts

categories

Product categories

products

Products and base prices

customers

Customer information

pricing_rules

Dynamic pricing rules

rule_conditions

Rule conditions

rule_actions

Rule actions

promotions

Promotion configuration

pricing_calculations

Pricing calculation history

calculation_rules

Rules applied to calculations

Relationships

erDiagram
    ROLES ||--o{ USERS : has
    CATEGORIES ||--o{ PRODUCTS : contains
    PRICING_RULES ||--o{ RULE_CONDITIONS : contains
    PRICING_RULES ||--o{ RULE_ACTIONS : contains
    PRODUCTS ||--o{ PRICING_CALCULATIONS : calculated_for
    CUSTOMERS ||--o{ PRICING_CALCULATIONS : calculated_for
    PRICING_CALCULATIONS ||--o{ CALCULATION_RULES : records
    PRICING_RULES ||--o{ CALCULATION_RULES : applied_as

Database migrations are managed using Alembic.

🧠 Example Pricing Rules

Premium Customer Discount

Condition:
customer_type = PREMIUM

Action:
10% discount

Priority:
10

Execution:
COMBINABLE

Bulk Quantity Discount

Condition:
quantity >= 10

Action:
5% discount

Priority:
20

Execution:
COMBINABLE

Electronics Bulk Discount

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

💡 Example Calculation

Suppose:

Input

Value

Product Base Price

₹1,000

Quantity

10

Customer Type

PREMIUM

Tax Rate

18%

Applicable rules:

Premium Discount = 10%
Bulk Discount    = 5%

Calculation:

Step

Calculation

Result

Original Price

₹1,000 × 10

₹10,000

Total Discount

15% of ₹10,000

₹1,500

Price After Discount

₹10,000 − ₹1,500

₹8,500

Tax

18% of ₹8,500

₹1,530

Final Price

₹8,500 + ₹1,530

₹10,030

🔐 Security

The application includes:

JWT Bearer authentication

bcrypt password hashing

Role-based access control

Protected API routes

Active/inactive user validation

Pydantic request validation

Environment-based configuration

No arbitrary SQL or executable rule code

Dynamic rules use structured conditions and actions rather than allowing administrators to execute arbitrary application code.

🚀 Getting Started

1. Clone the Repository

git clone <your-github-repository-url>
cd dynamic-pricing-business-rules-engine

2. Configure Environment Variables

Create:

backend/.env

Example:

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

⚠️ Never commit real passwords, JWT secrets, or other sensitive credentials to GitHub.

🐳 Docker Setup

From the project root:

docker compose up -d --build

Check containers:

docker compose ps

Expected services:

dynamic_pricing_mysql
dynamic_pricing_redis
dynamic_pricing_backend

Run migrations:

docker exec -it dynamic_pricing_backend alembic upgrade head

🖥️ Backend Setup

cd backend

python -m venv .venv

.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

🎨 Frontend Setup

cd frontend

npm install

npm run dev

Frontend:

http://localhost:5173

📚 API Documentation

Documentation

URL

Swagger UI

http://127.0.0.1:8000/docs

ReDoc

http://127.0.0.1:8000/redoc

OpenAPI JSON

http://127.0.0.1:8000/openapi.json

Use the Authorize button in Swagger to provide the JWT Bearer token.

📮 Postman

Recommended Postman collection structure:

Folder

APIs

01 Authentication

Register, Login

02 Users

User management

03 Categories

Category CRUD

04 Products

Product CRUD

05 Customers

Customer CRUD

06 Pricing Rules

Rule management

07 Promotions

Promotion management

08 Pricing

Pricing calculation

09 Rule Testing

Rule simulation

10 Pricing History

Calculation history

11 Dashboard

Analytics

Configure the Postman environment:

base_url = http://127.0.0.1:8000
token    = <JWT access token>

🧪 Testing

Run backend tests:

cd backend
pytest

Verbose output:

pytest -v

Frontend production build:

cd frontend
npm run build

Pricing engine tests cover:

Condition Evaluation
Rule Execution
Discount Calculation
Conflict Resolution
Tax Calculation
Pricing Engine

🔄 API Workflow

flowchart TD
    A[Authenticate] --> B[Select Product]
    B --> C[Select Customer]
    C --> D[Submit Quantity]
    D --> E[Load Active Pricing Rules]
    E --> F[Evaluate Conditions]
    F --> G[Resolve Priority and Conflicts]
    G --> H[Apply Discounts]
    H --> I[Validate Promotion]
    I --> J[Apply Tax]
    J --> K[Calculate Final Price]
    K --> L[Save Pricing History]
    L --> M[Return Pricing Breakdown]

⚡ Performance & Scalability

The architecture supports future scaling through:

Redis caching

Database indexes

Repository/service separation

Stateless JWT authentication

Independent pricing-engine logic

Dockerized services

Environment configuration

Pagination and filtering

Reusable rule evaluation components

📋 Project Status

Module

Status

Authentication

✅

JWT Security

✅

RBAC

✅

User Management

✅

Category Management

✅

Product Management

✅

Customer Management

✅

Pricing Rules

✅

Rule Conditions

✅

Rule Actions

✅

Rule Priority

✅

Conflict Resolution

✅

Pricing Engine

✅

Promotions

✅

Pricing Calculator

✅

Rule Testing

✅

Pricing History

✅

Redis Caching

✅

Dashboard

✅

Swagger / OpenAPI

✅

Postman Collection

✅

Docker Compose

✅

Unit Testing

🔄

📸 Screenshots

Recommended project screenshots:

docs/
├── dashboard.png
├── products.png
├── customers.png
├── categories.png
├── pricing-rules.png
├── promotions.png
├── calculator.png
├── pricing-history.png
└── rule-testing.png

Add screenshots using:

![Dashboard](docs/dashboard.png)

🛣️ Future Enhancements

📊 Advanced revenue and pricing analytics

📅 Date-range dashboard filters

🔔 Real-time notifications

🧾 Export pricing history to CSV/PDF

👤 More granular permissions

🔄 Rule versioning

↩️ Rule rollback

🧪 Full pricing simulation mode

📦 Bulk product import

🌐 Multi-currency pricing

🏢 Multi-tenant support

☁️ Cloud deployment

📡 Event-driven pricing updates

📄 Documentation

Project documentation can include:

Swagger_API_Documentation.md
Dynamic_Pricing_Business_Rules_Engine.postman_collection.json

🤝 Contribution

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add or update tests
5. Commit your changes
6. Push the branch
7. Create a Pull Request

👨‍💻 Author

<h2 align="center">Praburam R</h2>

<p align="center">
  Python Developer • FastAPI • React • MySQL • REST APIs
</p>

Skills Demonstrated

Area

Technologies

Backend

Python, FastAPI

Database

MySQL, SQLAlchemy

Caching

Redis

Security

JWT, RBAC, bcrypt

Frontend

React, TypeScript, Material UI

API

REST, Swagger, Postman

DevOps

Docker, Docker Compose

Database Migration

Alembic

Business Logic

Dynamic Pricing, Rule Engine

<p align="center">
  <strong>⚡ Dynamic Rules. Smarter Pricing. Scalable Architecture.</strong>
</p>

<p align="center">
  Built with Python, FastAPI, React, MySQL, Redis and Docker.
</p>
