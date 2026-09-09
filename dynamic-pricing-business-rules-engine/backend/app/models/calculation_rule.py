from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CalculationRule(Base):
    __tablename__ = "calculation_rules"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    calculation_id: Mapped[int] = mapped_column(
        ForeignKey(
            "pricing_calculations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    rule_id: Mapped[int] = mapped_column(
        ForeignKey("pricing_rules.id"),
        nullable=False,
        index=True,
    )

    rule_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    action_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2),
        default=0,
        nullable=False,
    )

    calculation = relationship(
        "PricingCalculation",
        back_populates="calculation_rules",
    )

    pricing_rule = relationship(
        "PricingRule",
        back_populates="calculation_rules",
    )
