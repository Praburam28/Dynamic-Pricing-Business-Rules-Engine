from fastapi import HTTPException

from app.repositories.pricing_history_repository import (
    PricingHistoryRepository,
)


class PricingHistoryService:

    @staticmethod
    def _to_response(calculation):

        applied_rules = []

        for rule in calculation.calculation_rules:
            applied_rules.append(
                {
                    "rule_id": rule.rule_id,
                    "rule_name": rule.rule_name,
                    "action_type": rule.action_type,
                    "discount_amount": rule.discount_amount,
                }
            )

        return {
            "calculation_id": calculation.id,
            "product_id": calculation.product_id,
            "customer_id": calculation.customer_id,
            "quantity": calculation.quantity,
            "location": calculation.location,
            "promotional_code": calculation.promotional_code,
            "original_price": calculation.original_price,
            "discount_amount": calculation.discount_amount,
            "tax_amount": calculation.tax_amount,
            "final_price": calculation.final_price,
            "calculated_at": calculation.calculated_at,
            "applied_rules": applied_rules,
        }

    @staticmethod
    def get_by_id(db, calculation_id: int):

        calculation = PricingHistoryRepository.get_by_id(
            db,
            calculation_id,
        )

        if not calculation:
            raise HTTPException(
                status_code=404,
                detail="Pricing calculation not found",
            )

        return PricingHistoryService._to_response(
            calculation
        )

    @staticmethod
    def get_all(
        db,
        skip: int = 0,
        limit: int = 20,
        product_id: int | None = None,
        customer_id: int | None = None,
    ):

        calculations = PricingHistoryRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            product_id=product_id,
            customer_id=customer_id,
        )

        total = PricingHistoryRepository.count(
            db=db,
            product_id=product_id,
            customer_id=customer_id,
        )

        items = [
            PricingHistoryService._to_response(
                calculation
            )
            for calculation in calculations
        ]

        return {
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit,
        }
