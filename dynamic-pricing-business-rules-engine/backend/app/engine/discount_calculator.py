from decimal import Decimal


class DiscountCalculator:

    @staticmethod
    def calculate(
        base_price: Decimal,
        action,
    ) -> Decimal:

        value = Decimal(str(action.value))

        if action.discount_type == "PERCENTAGE":

            discount = (
                base_price * value / Decimal("100")
            )

        elif action.discount_type == "FIXED":

            discount = value

        else:
            return Decimal("0.00")

        if discount > base_price:
            discount = base_price

        return discount.quantize(
            Decimal("0.01")
        )
