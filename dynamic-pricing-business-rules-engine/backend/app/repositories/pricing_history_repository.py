from app.models.pricing_calculation import PricingCalculation


class PricingHistoryRepository:

    @staticmethod
    def get_by_id(db, calculation_id: int):
        return (
            db.query(PricingCalculation)
            .filter(
                PricingCalculation.id == calculation_id
            )
            .first()
        )

    @staticmethod
    def get_all(
        db,
        skip: int = 0,
        limit: int = 20,
        product_id: int | None = None,
        customer_id: int | None = None,
    ):
        query = db.query(PricingCalculation)

        if product_id is not None:
            query = query.filter(
                PricingCalculation.product_id == product_id
            )

        if customer_id is not None:
            query = query.filter(
                PricingCalculation.customer_id == customer_id
            )

        return (
            query
            .order_by(
                PricingCalculation.calculated_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(
        db,
        product_id: int | None = None,
        customer_id: int | None = None,
    ):
        query = db.query(PricingCalculation)

        if product_id is not None:
            query = query.filter(
                PricingCalculation.product_id == product_id
            )

        if customer_id is not None:
            query = query.filter(
                PricingCalculation.customer_id == customer_id
            )

        return query.count()
