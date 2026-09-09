from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.routers import (
    auth,
    users,
    categories,
    products,
    customers,
    pricing_rules,
    promotions,
    pricing,
    pricing_history,
    dashboard,
    rule_testing,
)


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Dynamic Pricing & Business Rules Engine API",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Routers
# ---------------------------------------------------------

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(pricing_rules.router)
app.include_router(promotions.router)
app.include_router(pricing.router)
app.include_router(pricing_history.router)
app.include_router(dashboard.router)
app.include_router(rule_testing.router)


@app.get("/")
def root():
    return {
        "message": "Dynamic Pricing & Business Rules Engine API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }