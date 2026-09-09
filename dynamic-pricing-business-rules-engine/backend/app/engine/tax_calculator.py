from decimal import Decimal, ROUND_HALF_UP


class TaxCalculator:
    """
    Calculates tax on the amount after discounts and promotions.
    """

    @staticmethod
    def calculate(amount: Decimal, tax_rate: Decimal) -> Decimal:
        if amount < Decimal("0.00"):
            amount = Decimal("0.00")

        if tax_rate < Decimal("0.00"):
            raise ValueError("Tax rate cannot be negative.")

        tax = amount * (tax_rate / Decimal("100"))

        return tax.quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP
        )
