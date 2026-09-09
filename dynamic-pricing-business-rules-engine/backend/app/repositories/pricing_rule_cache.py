from datetime import datetime
from decimal import Decimal

from types import SimpleNamespace


class PricingRuleCache:

    @staticmethod
    def serialize(rule):

        return {
            "id": rule.id,
            "name": rule.name,
            "description": rule.description,
            "priority": rule.priority,
            "execution_type": rule.execution_type,
            "maximum_discount": (
                str(rule.maximum_discount)
                if rule.maximum_discount is not None
                else None
            ),
            "start_date": (
                rule.start_date.isoformat()
                if rule.start_date
                else None
            ),
            "end_date": (
                rule.end_date.isoformat()
                if rule.end_date
                else None
            ),
            "is_active": rule.is_active,

            "conditions": [
                {
                    "field": condition.field,
                    "operator": condition.operator,
                    "value": condition.value,
                    "condition_group": condition.condition_group,
                    "logical_operator": condition.logical_operator,
                }
                for condition in rule.conditions
            ],

            "actions": [
                {
                    "action_type": action.action_type,
                    "discount_type": action.discount_type,
                    "value": str(action.value),
                }
                for action in rule.actions
            ],
        }

    @staticmethod
    def deserialize(data):

        rule = SimpleNamespace()

        rule.id = data["id"]
        rule.name = data["name"]
        rule.description = data["description"]
        rule.priority = data["priority"]
        rule.execution_type = data["execution_type"]

        rule.maximum_discount = (
            Decimal(data["maximum_discount"])
            if data["maximum_discount"] is not None
            else None
        )

        rule.start_date = (
            datetime.fromisoformat(data["start_date"])
            if data["start_date"]
            else None
        )

        rule.end_date = (
            datetime.fromisoformat(data["end_date"])
            if data["end_date"]
            else None
        )

        rule.is_active = data["is_active"]

        rule.conditions = []

        for condition_data in data["conditions"]:

            condition = SimpleNamespace()

            condition.field = condition_data["field"]
            condition.operator = condition_data["operator"]
            condition.value = condition_data["value"]
            condition.condition_group = condition_data[
                "condition_group"
            ]
            condition.logical_operator = condition_data[
                "logical_operator"
            ]

            rule.conditions.append(condition)

        rule.actions = []

        for action_data in data["actions"]:

            action = SimpleNamespace()

            action.action_type = action_data[
                "action_type"
            ]

            action.discount_type = action_data[
                "discount_type"
            ]

            action.value = Decimal(
                action_data["value"]
            )

            rule.actions.append(action)

        return rule
