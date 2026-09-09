from decimal import Decimal

from app.engine.condition_evaluator import ConditionEvaluator


def test_equal_condition():
    assert ConditionEvaluator.evaluate(
        "PREMIUM",
        "=",
        "PREMIUM",
    ) is True


def test_quantity_condition():
    assert ConditionEvaluator.evaluate(
        10,
        ">=",
        "10",
    ) is True


def test_quantity_condition_false():
    assert ConditionEvaluator.evaluate(
        5,
        ">=",
        "10",
    ) is False


def test_in_condition():
    assert ConditionEvaluator.evaluate(
        "INDIA",
        "IN",
        "INDIA,USA,UK",
    ) is True


def test_contains_condition():
    assert ConditionEvaluator.evaluate(
        "Premium Customer",
        "CONTAINS",
        "Premium",
    ) is True
