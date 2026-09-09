from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RuleCondition(Base):
    __tablename__ = "rule_conditions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    rule_id: Mapped[int] = mapped_column(
        ForeignKey("pricing_rules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    field: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    operator: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    value: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    condition_group: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    logical_operator: Mapped[str] = mapped_column(
        String(10),
        default="AND",
        nullable=False,
    )

    pricing_rule = relationship(
        "PricingRule",
        back_populates="conditions",
    )
