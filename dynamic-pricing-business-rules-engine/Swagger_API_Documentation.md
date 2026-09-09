# Swagger API Documentation
## Dynamic Pricing & Business Rules Engine

### API Base URL
`http://127.0.0.1:8000`

### Interactive Documentation
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI JSON: `/openapi.json`

### Authentication
The API uses JWT Bearer authentication.

1. Register using `POST /auth/register`.
2. Login using `POST /auth/login`.
3. Copy `access_token` from the login response.
4. In Swagger, click **Authorize** and enter:
   `Bearer <access_token>`

### API Modules

#### 1. Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

#### 2. Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/users/me` | Authenticated |
| GET | `/users/admin-test` | Admin |
| GET | `/users` | Admin |
| GET | `/users/{user_id}` | Admin |
| PATCH | `/users/{user_id}/activate` | Admin |
| PATCH | `/users/{user_id}/deactivate` | Admin |
| PATCH | `/users/{user_id}/role` | Admin |

#### 3. Categories
| Method | Endpoint | Access |
|---|---|---|
| POST | `/categories` | Admin |
| GET | `/categories` | Authenticated/Admin |
| GET | `/categories/{category_id}` | Authenticated/Admin |
| PATCH | `/categories/{category_id}` | Admin |
| PATCH | `/categories/{category_id}/activate` | Admin |
| PATCH | `/categories/{category_id}/deactivate` | Admin |

#### 4. Products
| Method | Endpoint | Access |
|---|---|---|
| POST | `/products` | Admin |
| GET | `/products` | Authenticated |
| GET | `/products/{product_id}` | Authenticated |
| PATCH | `/products/{product_id}` | Admin |
| PATCH | `/products/{product_id}/activate` | Admin |
| PATCH | `/products/{product_id}/deactivate` | Admin |

Product listing supports search/filter/pagination/sorting parameters such as:
`skip`, `limit`, `search`, `category_id`, `is_active`, `sort_by`, `sort_order`.

#### 5. Customers
| Method | Endpoint | Access |
|---|---|---|
| POST | `/customers` | Admin |
| GET | `/customers` | Authenticated |
| GET | `/customers/{customer_id}` | Authenticated |
| PATCH | `/customers/{customer_id}` | Admin |
| PATCH | `/customers/{customer_id}/activate` | Admin |
| PATCH | `/customers/{customer_id}/deactivate` | Admin |

Customer listing supports search/filter/pagination.

#### 6. Pricing Rules
| Method | Endpoint | Access |
|---|---|---|
| POST | `/pricing-rules` | Admin |
| GET | `/pricing-rules` | Authenticated |
| GET | `/pricing-rules/{rule_id}` | Authenticated |
| PATCH | `/pricing-rules/{rule_id}` | Admin |
| PATCH | `/pricing-rules/{rule_id}/activate` | Admin |
| PATCH | `/pricing-rules/{rule_id}/deactivate` | Admin |

Supported condition operators:
`=`, `!=`, `>`, `>=`, `<`, `<=`, `IN`, `NOT_IN`, `CONTAINS`

Supported execution types:
`COMBINABLE`, `EXCLUSIVE`, `OVERRIDE`

Supported actions:
`DISCOUNT`, `SURCHARGE`, `OVERRIDE_PRICE`

Supported discount types:
`PERCENTAGE`, `FIXED`

#### 7. Promotions
| Method | Endpoint | Access |
|---|---|---|
| POST | `/promotions` | Admin |
| GET | `/promotions` | Authenticated |
| GET | `/promotions/{promotion_id}` | Authenticated |
| PATCH | `/promotions/{promotion_id}` | Admin |
| POST | `/promotions/validate/{code}` | Authenticated |
| PATCH | `/promotions/{promotion_id}/activate` | Admin |
| PATCH | `/promotions/{promotion_id}/deactivate` | Admin |

Promotion validation checks active status, dates, usage limit, minimum purchase and discount constraints.

#### 8. Pricing Calculation
| Method | Endpoint | Access |
|---|---|---|
| POST | `/pricing/calculate` | Authenticated |

Pricing pipeline:

`Base Price → Applicable Rules → Discounts → Additional Charges → Promotion → Tax → Final Price`

Example request:
```json
{
  "product_id": 1,
  "customer_id": 1,
  "quantity": 1,
  "location": "Chennai",
  "promotional_code": null,
  "tax_rate": 18
}
```

#### 9. Rule Testing
| Method | Endpoint | Access |
|---|---|---|
| POST | `/rule-testing` | Admin |

Example request:
```json
{
  "rule_id": 1,
  "customer_type": "PREMIUM",
  "customer_category": "VIP",
  "location": "Chennai",
  "quantity": 10,
  "category_id": 1,
  "product_id": 1,
  "base_price": 1000
}
```

#### 10. Pricing History
| Method | Endpoint | Access |
|---|---|---|
| GET | `/pricing-history` | Authenticated |
| GET | `/pricing-history/{calculation_id}` | Authenticated |

Supports pagination and product/customer filters.

#### 11. Dashboard
| Method | Endpoint | Access |
|---|---|---|
| GET | `/dashboard/summary` | Admin |
| GET | `/dashboard/analytics` | Admin |

Dashboard provides calculation totals, original value, discounts, tax, final value, active products, active customers, active pricing rules, recent calculations and rule usage.

### Common HTTP Responses
- `200 OK` — successful read/update/action
- `201 Created` — successful resource creation
- `400 Bad Request` — invalid business input
- `401 Unauthorized` — missing/invalid JWT
- `403 Forbidden` — insufficient permissions
- `404 Not Found` — resource does not exist
- `409 Conflict` — duplicate/conflicting resource
- `422 Unprocessable Entity` — validation error
- `500 Internal Server Error` — unexpected server error

### Swagger Usage
Start the backend and open:

`http://127.0.0.1:8000/docs`

For protected endpoints:
**Authorize → Bearer token → Execute**

The Swagger UI is generated automatically from FastAPI/OpenAPI and therefore remains synchronized with the registered application routes and Pydantic schemas.
