from decimal import Decimal


class ConflictResolver:

    @staticmethod
    def resolve(
        base_price: Decimal,
        matched_rules: list,
    ):

        total_discount = Decimal("0.00")
        applied_rules = []

        exclusive_applied = False
        override_rule = None

        for item in matched_rules:

            rule = item["rule"]
            discount = item["discount"]

            if rule.execution_type == "OVERRIDE":
                override_rule = item
                continue

            if rule.execution_type == "EXCLUSIVE":

                if exclusive_applied:
                    continue

                exclusive_applied = True

                total_discount += discount
                applied_rules.append(item)

                continue

            if rule.execution_type == "COMBINABLE":

                total_discount += discount
                applied_rules.append(item)

        if override_rule:

            override_price = override_rule["override_price"]

            total_discount = (
                base_price - override_price
            )

            if total_discount < 0:
                total_discount = Decimal("0.00")

            applied_rules = [override_rule]

        return {
            "discount": total_discount,
            "applied_rules": applied_rules,
        }
