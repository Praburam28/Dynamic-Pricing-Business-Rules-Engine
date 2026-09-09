from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RuleAction(Base):
    __tablename__ = "rule_actions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    rule_id: Mapped[int] = mapped_column(
        ForeignKey("pricing_rules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    action_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    discount_type: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    value: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    pricing_rule = relationship(
        "PricingRule",
        back_populates="actions",
    )
