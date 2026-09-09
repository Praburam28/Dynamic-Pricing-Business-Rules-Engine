from sqlalchemy import func

from app.models.customer import Customer
from app.models.pricing_calculation import PricingCalculation
from app.models.pricing_rule import PricingRule
from app.models.calculation_rule import CalculationRule
from app.models.product import Product


class DashboardRepository:

    @staticmethod
    def get_calculation_summary(db):

        result = (
            db.query(
                func.count(PricingCalculation.id),
                func.coalesce(
                    func.sum(
                        PricingCalculation.original_price
                    ),
                    0,
                ),
                func.coalesce(
                    func.sum(
                        PricingCalculation.discount_amount
                    ),
                    0,
                ),
                func.coalesce(
                    func.sum(
                        PricingCalculation.tax_amount
                    ),
                    0,
                ),
                func.coalesce(
                    func.sum(
                        PricingCalculation.final_price
                    ),
                    0,
                ),
            )
            .first()
        )

        return result

    @staticmethod
    def get_active_product_count(db):

        return (
            db.query(Product)
            .filter(Product.is_active == True)
            .count()
        )

    @staticmethod
    def get_active_customer_count(db):

        return (
            db.query(Customer)
            .filter(Customer.is_active == True)
            .count()
        )

    @staticmethod
    def get_active_rule_count(db):

        return (
            db.query(PricingRule)
            .filter(PricingRule.is_active == True)
            .count()
        )

    @staticmethod
    def get_recent_calculations(
        db,
        limit: int = 10,
    ):

        return (
            db.query(PricingCalculation)
            .order_by(
                PricingCalculation.calculated_at.desc()
            )
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_rule_usage(
        db,
        limit: int = 10,
    ):

        return (
            db.query(
                CalculationRule.rule_id,
                CalculationRule.rule_name,
                func.count(
                    CalculationRule.id
                ).label("usage_count"),
            )
            .group_by(
                CalculationRule.rule_id,
                CalculationRule.rule_name,
            )
            .order_by(
                func.count(
                    CalculationRule.id
                ).desc()
            )
            .limit(limit)
            .all()
        )
