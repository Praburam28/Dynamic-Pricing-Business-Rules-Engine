from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, JSON, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PricingCalculation(Base):
    __tablename__ = "pricing_calculations"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        nullable=False,
        index=True,
    )

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id"),
        nullable=False,
        index=True,
    )

    quantity: Mapped[int] = mapped_column(
        nullable=False,
    )

    location: Mapped[str | None] = mapped_column(
        nullable=True,
    )

    promotional_code: Mapped[str | None] = mapped_column(
        nullable=True,
    )

    input_parameters: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    original_price: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        default=0,
        nullable=False,
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        default=0,
        nullable=False,
    )

    final_price: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        nullable=False,
    )

    calculated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    product = relationship(
        "Product",
        back_populates="pricing_calculations",
    )

    customer = relationship(
        "Customer",
        back_populates="pricing_calculations",
    )

    calculation_rules = relationship(
        "CalculationRule",
        back_populates="calculation",
        cascade="all, delete-orphan",
    )
