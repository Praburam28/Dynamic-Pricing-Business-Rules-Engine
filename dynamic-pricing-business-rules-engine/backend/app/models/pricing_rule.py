from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PricingRule(Base):
    __tablename__ = "pricing_rules"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    priority: Mapped[int] = mapped_column(
        Integer,
        default=100,
        nullable=False,
        index=True,
    )

    execution_type: Mapped[str] = mapped_column(
        String(30),
        default="COMBINABLE",
        nullable=False,
    )

    maximum_discount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    start_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
        index=True,
    )

    end_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    conditions = relationship(
        "RuleCondition",
        back_populates="pricing_rule",
        cascade="all, delete-orphan",
    )

    actions = relationship(
        "RuleAction",
        back_populates="pricing_rule",
        cascade="all, delete-orphan",
    )

    calculation_rules = relationship(
        "CalculationRule",
        back_populates="pricing_rule",
    )
