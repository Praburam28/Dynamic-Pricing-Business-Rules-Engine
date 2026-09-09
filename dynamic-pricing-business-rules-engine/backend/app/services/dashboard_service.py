from app.repositories.dashboard_repository import (
    DashboardRepository,
)


class DashboardService:

    @staticmethod
    def get_summary(db):

        summary = (
            DashboardRepository
            .get_calculation_summary(db)
        )

        (
            total_calculations,
            total_original_value,
            total_discount,
            total_tax,
            total_final_value,
        ) = summary

        return {
            "total_calculations": total_calculations,
            "total_original_value": total_original_value,
            "total_discount": total_discount,
            "total_tax": total_tax,
            "total_final_value": total_final_value,
            "active_products": (
                DashboardRepository
                .get_active_product_count(db)
            ),
            "active_customers": (
                DashboardRepository
                .get_active_customer_count(db)
            ),
            "active_pricing_rules": (
                DashboardRepository
                .get_active_rule_count(db)
            ),
        }

    @staticmethod
    def get_analytics(db):

        summary = DashboardService.get_summary(db)

        recent_calculations = (
            DashboardRepository
            .get_recent_calculations(db)
        )

        rule_usage_rows = (
            DashboardRepository
            .get_rule_usage(db)
        )

        recent = [
            {
                "calculation_id": calculation.id,
                "product_id": calculation.product_id,
                "customer_id": calculation.customer_id,
                "quantity": calculation.quantity,
                "original_price": calculation.original_price,
                "discount_amount": calculation.discount_amount,
                "tax_amount": calculation.tax_amount,
                "final_price": calculation.final_price,
                "calculated_at": calculation.calculated_at,
            }
            for calculation in recent_calculations
        ]

        rule_usage = [
            {
                "rule_id": row.rule_id,
                "rule_name": row.rule_name,
                "usage_count": row.usage_count,
            }
            for row in rule_usage_rows
        ]

        return {
            "summary": summary,
            "recent_calculations": recent,
            "rule_usage": rule_usage,
        }
