from sqlalchemy.orm import Session

from app.models.promotion import Promotion


class PromotionRepository:

    @staticmethod
    def get_by_id(db: Session, promotion_id: int):
        return (
            db.query(Promotion)
            .filter(Promotion.id == promotion_id)
            .first()
        )

    @staticmethod
    def get_by_code(db: Session, code: str):
        return (
            db.query(Promotion)
            .filter(Promotion.code == code)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(Promotion)

        if search:
            query = query.filter(
                Promotion.code.ilike(f"%{search}%")
            )

        if is_active is not None:
            query = query.filter(
                Promotion.is_active == is_active
            )

        return (
            query
            .order_by(Promotion.id.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(
        db: Session,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(Promotion)

        if search:
            query = query.filter(
                Promotion.code.ilike(f"%{search}%")
            )

        if is_active is not None:
            query = query.filter(
                Promotion.is_active == is_active
            )

        return query.count()

    @staticmethod
    def create(
        db: Session,
        code,
        discount_type,
        discount_value,
        minimum_purchase,
        maximum_discount,
        start_date,
        expiry_date,
        usage_limit,
        is_active,
    ):
        promotion = Promotion(
            code=code,
            discount_type=discount_type,
            discount_value=discount_value,
            minimum_purchase=minimum_purchase,
            maximum_discount=maximum_discount,
            start_date=start_date,
            expiry_date=expiry_date,
            usage_limit=usage_limit,
            usage_count=0,
            is_active=is_active,
        )

        db.add(promotion)
        db.commit()
        db.refresh(promotion)

        return promotion

    @staticmethod
    def update(
        db: Session,
        promotion,
        discount_type=None,
        discount_value=None,
        minimum_purchase=None,
        maximum_discount=None,
        start_date=None,
        expiry_date=None,
        usage_limit=None,
        is_active=None,
    ):
        if discount_type is not None:
            promotion.discount_type = discount_type

        if discount_value is not None:
            promotion.discount_value = discount_value

        if minimum_purchase is not None:
            promotion.minimum_purchase = minimum_purchase

        if maximum_discount is not None:
            promotion.maximum_discount = maximum_discount

        if start_date is not None:
            promotion.start_date = start_date

        if expiry_date is not None:
            promotion.expiry_date = expiry_date

        if usage_limit is not None:
            promotion.usage_limit = usage_limit

        if is_active is not None:
            promotion.is_active = is_active

        db.commit()
        db.refresh(promotion)

        return promotion

    @staticmethod
    def update_active_status(
        db: Session,
        promotion,
        is_active: bool,
    ):
        promotion.is_active = is_active

        db.commit()
        db.refresh(promotion)

        return promotion
