from decimal import Decimal


class ConditionEvaluator:

    @staticmethod
    def evaluate(field_value, operator: str, expected_value: str) -> bool:
        if field_value is None:
            return False

        operator = operator.upper()

        if operator == "=":
            return str(field_value).lower() == expected_value.lower()

        if operator == "!=":
            return str(field_value).lower() != expected_value.lower()

        if operator in {">", ">=", "<", "<="}:
            try:
                actual = Decimal(str(field_value))
                expected = Decimal(str(expected_value))
            except Exception:
                return False

            if operator == ">":
                return actual > expected

            if operator == ">=":
                return actual >= expected

            if operator == "<":
                return actual < expected

            if operator == "<=":
                return actual <= expected

        if operator == "IN":
            values = [
                item.strip().lower()
                for item in expected_value.split(",")
            ]

            return str(field_value).lower() in values

        if operator == "NOT_IN":
            values = [
                item.strip().lower()
                for item in expected_value.split(",")
            ]

            return str(field_value).lower() not in values

        if operator == "CONTAINS":
            return expected_value.lower() in str(field_value).lower()

        return False
