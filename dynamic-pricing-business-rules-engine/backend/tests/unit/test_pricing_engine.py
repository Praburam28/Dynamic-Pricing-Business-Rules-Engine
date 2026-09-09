from decimal import Decimal

from app.engine.pricing_engine import PricingEngine


class FakeAction:
    action_type = "DISCOUNT"
    discount_type = "PERCENTAGE"
    value = Decimal("10")


class FakeCondition:
    field = "customer_type"
    operator = "="
    value = "PREMIUM"
    condition_group = 1
    logical_operator = "AND"


class FakeRule:
    id = 1
    name = "Premium Discount"
    priority = 10
    execution_type = "COMBINABLE"
    maximum_discount = None
    is_active = True
    start_date = None
    end_date = None
    conditions = [FakeCondition()]
    actions = [FakeAction()]


def test_premium_discount():

    engine = PricingEngine(
        rules=[FakeRule()]
    )

    result = engine.calculate(
        base_price=Decimal("1000.00"),
        context={
            "customer_type": "PREMIUM",
        },
    )

    assert result["base_price"] == Decimal("1000.00")
    assert result["discount_amount"] == Decimal("100.00")
    assert result["final_price"] == Decimal("900.00")

    assert len(result["applied_rules"]) == 1
    assert result["applied_rules"][0]["rule_name"] == "Premium Discount"
