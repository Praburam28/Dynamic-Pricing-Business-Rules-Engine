from decimal import Decimal

from app.engine.tax_calculator import TaxCalculator


def test_percentage_tax():
    tax = TaxCalculator.calculate(
        Decimal("1000.00"),
        Decimal("18.00")
    )

    assert tax == Decimal("180.00")


def test_zero_tax():
    tax = TaxCalculator.calculate(
        Decimal("1000.00"),
        Decimal("0.00")
    )

    assert tax == Decimal("0.00")


def test_tax_after_discount():
    tax = TaxCalculator.calculate(
        Decimal("900.00"),
        Decimal("18.00")
    )

    assert tax == Decimal("162.00")
