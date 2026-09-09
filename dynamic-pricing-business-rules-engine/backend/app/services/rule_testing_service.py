from decimal import Decimal

from fastapi import HTTPException

from app.engine.discount_calculator import DiscountCalculator
from app.engine.rule_executor import RuleExecutor
from app.repositories.pricing_rule_repository import (
    PricingRuleRepository,
)


class RuleTestingService:

    @staticmethod
    def test_rule(db, data):

        # ---------------------------------------------------------
        # 1. Get Rule
        # ---------------------------------------------------------

        rule = PricingRuleRepository.get_by_id(
            db,
            data.rule_id,
        )

        if not rule:
            raise HTTPException(
                status_code=404,
                detail="Pricing rule not found",
            )

        # ---------------------------------------------------------
        # 2. Build Test Context
        # ---------------------------------------------------------

        context = {
            "customer_type": data.customer_type,
            "customer_category": data.customer_category,
            "location": data.location,
            "quantity": data.quantity,
            "category_id": data.category_id,
            "product_id": data.product_id,
            "base_price": float(data.base_price),
            "promotion_code": None,
        }

        # ---------------------------------------------------------
        # 3. Evaluate Conditions
        # ---------------------------------------------------------

        matched = RuleExecutor.evaluate_rule(
            rule,
            context,
        )

        discount_amount = Decimal("0.00")

        # ---------------------------------------------------------
        # 4. Calculate Discount
        # ---------------------------------------------------------

        if matched:

            for action in rule.actions:

                if action.action_type != "DISCOUNT":
                    continue

                discount_amount += (
                    DiscountCalculator.calculate(
                        base_price=data.base_price,
                        action=action,
                    )
                )

            # -----------------------------------------------------
            # 5. Apply Maximum Rule Discount
            # -----------------------------------------------------

            if rule.maximum_discount is not None:

                discount_amount = min(
                    discount_amount,
                    Decimal(
                        str(rule.maximum_discount)
                    ),
                )

            # Never discount below zero
            discount_amount = min(
                discount_amount,
                data.base_price,
            )

            discount_amount = discount_amount.quantize(
                Decimal("0.01")
            )

        # ---------------------------------------------------------
        # 6. Result Message
        # ---------------------------------------------------------

        if matched:

            message = (
                "Pricing rule matched successfully."
            )

        else:

            message = (
                "Pricing rule did not match "
                "the supplied conditions."
            )

        return {
            "rule_id": rule.id,
            "rule_name": rule.name,
            "matched": matched,
            "execution_type": rule.execution_type,
            "message": message,
            "discount_amount": discount_amount,
        }
