from datetime import datetime, timezone
from decimal import Decimal

from app.engine.conflict_resolver import ConflictResolver
from app.engine.discount_calculator import DiscountCalculator
from app.engine.rule_executor import RuleExecutor


class PricingEngine:

    def __init__(self, rules):
        self.rules = sorted(
            rules,
            key=lambda rule: (
                rule.priority,
                rule.id,
            ),
        )

    def calculate(
        self,
        base_price: Decimal,
        quantity: int,
        context: dict,
    ):

        unit_price = Decimal(str(base_price))

        original_price = (
            unit_price * Decimal(str(quantity))
        ).quantize(
            Decimal("0.01")
        )

        current_time = datetime.now(timezone.utc)

        matched_rules = []

        for rule in self.rules:

            if not rule.is_active:
                continue

            if rule.start_date:

                start_date = rule.start_date

                if start_date.tzinfo is None:
                    start_date = start_date.replace(
                        tzinfo=timezone.utc
                    )

                if current_time < start_date:
                    continue

            if rule.end_date:

                end_date = rule.end_date

                if end_date.tzinfo is None:
                    end_date = end_date.replace(
                        tzinfo=timezone.utc
                    )

                if current_time > end_date:
                    continue

            if not RuleExecutor.evaluate_rule(
                rule,
                context,
            ):
                continue

            for action in rule.actions:

                if action.action_type == "DISCOUNT":

                    discount = DiscountCalculator.calculate(
                        base_price=original_price,
                        action=action,
                    )

                    if rule.maximum_discount is not None:

                        maximum_discount = Decimal(
                            str(rule.maximum_discount)
                        )

                        discount = min(
                            discount,
                            maximum_discount,
                        )

                    matched_rules.append(
                        {
                            "rule": rule,
                            "action": action,
                            "discount": discount,
                        }
                    )

                elif action.action_type == "OVERRIDE_PRICE":

                    override_unit_price = Decimal(
                        str(action.value)
                    )

                    override_price = (
                        override_unit_price
                        * Decimal(str(quantity))
                    ).quantize(
                        Decimal("0.01")
                    )

                    matched_rules.append(
                        {
                            "rule": rule,
                            "action": action,
                            "discount": Decimal("0.00"),
                            "override_price": override_price,
                        }
                    )

        result = ConflictResolver.resolve(
            base_price=original_price,
            matched_rules=matched_rules,
        )

        total_discount = min(
            result["discount"],
            original_price,
        )

        final_price = (
            original_price - total_discount
        ).quantize(
            Decimal("0.01")
        )

        applied_rules = []

        for item in result["applied_rules"]:

            applied_rules.append(
                {
                    "rule_id": item["rule"].id,
                    "rule_name": item["rule"].name,
                    "discount_amount": item.get(
                        "discount",
                        Decimal("0.00"),
                    ),
                }
            )

        return {
            "base_price": unit_price,
            "original_price": original_price,
            "discount_amount": total_discount,
            "final_price": final_price,
            "applied_rules": applied_rules,
        }
