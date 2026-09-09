from decimal import Decimal

from app.engine.discount_calculator import DiscountCalculator


class FakeAction:
    discount_type = "PERCENTAGE"
    value = Decimal("10")


def test_percentage_discount():

    discount = DiscountCalculator.calculate(
        Decimal("1000.00"),
        FakeAction(),
    )

    assert discount == Decimal("100.00")


class FakeFixedAction:
    discount_type = "FIXED"
    value = Decimal("100")


def test_fixed_discount():

    discount = DiscountCalculator.calculate(
        Decimal("1000.00"),
        FakeFixedAction(),
    )

    assert discount == Decimal("100.00")
