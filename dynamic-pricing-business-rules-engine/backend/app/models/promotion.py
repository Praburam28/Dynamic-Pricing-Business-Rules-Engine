from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Promotion(Base):
    __tablename__ = "promotions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    discount_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    discount_value: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    minimum_purchase: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    maximum_discount: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    start_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    expiry_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    usage_limit: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    usage_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )
