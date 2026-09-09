from app.engine.condition_evaluator import ConditionEvaluator


class RuleExecutor:

    @staticmethod
    def evaluate_rule(rule, context: dict) -> bool:

        if not rule.is_active:
            return False

        if not rule.conditions:
            return False

        grouped_conditions = {}

        for condition in rule.conditions:
            grouped_conditions.setdefault(
                condition.condition_group,
                [],
            ).append(condition)

        group_results = []

        for _, conditions in grouped_conditions.items():

            condition_results = []

            for condition in conditions:

                actual_value = context.get(
                    condition.field
                )

                result = ConditionEvaluator.evaluate(
                    field_value=actual_value,
                    operator=condition.operator,
                    expected_value=condition.value,
                )

                condition_results.append(
                    result
                )

            if any(
                condition.logical_operator == "OR"
                for condition in conditions
            ):
                group_result = any(condition_results)
            else:
                group_result = all(condition_results)

            group_results.append(group_result)

        return all(group_results)
