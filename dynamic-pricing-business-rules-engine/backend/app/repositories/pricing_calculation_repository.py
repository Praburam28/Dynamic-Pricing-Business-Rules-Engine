from sqlalchemy.orm import Session

from app.models.calculation_rule import CalculationRule
from app.models.pricing_calculation import PricingCalculation


class PricingCalculationRepository:

    @staticmethod
    def create(
        db: Session,
        product_id: int,
        customer_id: int,
        quantity: int,
        location: str | None,
        promotional_code: str | None,
        input_parameters: dict,
        original_price,
        discount_amount,
        tax_amount,
        final_price,
    ):

        calculation = PricingCalculation(
            product_id=product_id,
            customer_id=customer_id,
            quantity=quantity,
            location=location,
            promotional_code=promotional_code,
            input_parameters=input_parameters,
            original_price=original_price,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            final_price=final_price,
        )

        db.add(calculation)
        db.flush()

        return calculation

    @staticmethod
    def create_calculation_rule(
        db: Session,
        calculation_id: int,
        rule_id: int,
        rule_name: str,
        action_type: str,
        discount_amount,
    ):

        calculation_rule = CalculationRule(
            calculation_id=calculation_id,
            rule_id=rule_id,
            rule_name=rule_name,
            action_type=action_type,
            discount_amount=discount_amount,
        )

        db.add(calculation_rule)

        return calculation_rule

    @staticmethod
    def commit(db: Session):
        db.commit()

    @staticmethod
    def refresh(db: Session, calculation):
        db.refresh(calculation)
        return calculation
