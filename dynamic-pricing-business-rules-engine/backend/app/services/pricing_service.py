from decimal import Decimal

from fastapi import HTTPException

from app.engine.pricing_engine import PricingEngine
from app.engine.tax_calculator import TaxCalculator
from app.models.pricing_rule import PricingRule
from app.repositories.category_repository import CategoryRepository
from app.repositories.customer_repository import CustomerRepository
from app.repositories.pricing_calculation_repository import (
    PricingCalculationRepository,
)
from app.repositories.product_repository import ProductRepository
from app.services.promotion_service import PromotionService
from app.repositories.pricing_rule_repository import (
    PricingRuleRepository,
)

class PricingService:

    @staticmethod
    def calculate(db, data):

        # ---------------------------------------------------------
        # 1. Validate Product
        # ---------------------------------------------------------

        product = ProductRepository.get_by_id(
            db,
            data.product_id,
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found",
            )

        if not product.is_active:
            raise HTTPException(
                status_code=400,
                detail="Product is inactive",
            )

        # ---------------------------------------------------------
        # 2. Validate Category
        # ---------------------------------------------------------

        category = CategoryRepository.get_by_id(
            db,
            product.category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Product category not found",
            )

        if not category.is_active:
            raise HTTPException(
                status_code=400,
                detail="Product category is inactive",
            )

        # ---------------------------------------------------------
        # 3. Validate Customer
        # ---------------------------------------------------------

        customer = CustomerRepository.get_by_id(
            db,
            data.customer_id,
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found",
            )

        if not customer.is_active:
            raise HTTPException(
                status_code=400,
                detail="Customer is inactive",
            )

        # ---------------------------------------------------------
        # 4. Calculate Original Price
        # ---------------------------------------------------------

        unit_price = Decimal(
            str(product.base_price)
        )

        quantity = data.quantity

        original_price = (
            unit_price * Decimal(str(quantity))
        ).quantize(
            Decimal("0.01")
        )

        # ---------------------------------------------------------
        # 5. Build Pricing Context
        # ---------------------------------------------------------

        location = (
            data.location
            or customer.location
        )

        context = {
            "customer_type": customer.customer_type,
            "customer_category": customer.customer_category,
            "location": location,
            "quantity": quantity,
            "category_id": product.category_id,
            "product_id": product.id,
            "base_price": float(unit_price),
            "promotion_code": data.promotional_code,
        }

        # ---------------------------------------------------------
        # 6. Load Active Pricing Rules
        # ---------------------------------------------------------

        rules = PricingRuleRepository.get_active_rules_cached(db)

        # ---------------------------------------------------------
        # 7. Execute Pricing Rule Engine
        # ---------------------------------------------------------

        engine = PricingEngine(rules)
        

        engine_result = engine.calculate(
            base_price=unit_price,
            quantity=quantity,
            context=context,
        )

        rule_discount = Decimal(
            str(engine_result["discount_amount"])
        )

        # ---------------------------------------------------------
        # 8. Apply Promotion
        # ---------------------------------------------------------

        promotion_discount = Decimal("0.00")

        if data.promotional_code:

            promotion = PromotionService.validate_for_purchase(
                db=db,
                code=data.promotional_code,
                purchase_amount=engine_result["final_price"],
            )

            if promotion.discount_type == "PERCENTAGE":

                promotion_discount = (
                    engine_result["final_price"]
                    * Decimal(
                        str(promotion.discount_value)
                    )
                    / Decimal("100")
                )

            else:

                promotion_discount = Decimal(
                    str(promotion.discount_value)
                )

            # Apply maximum promotion discount
            if promotion.maximum_discount is not None:

                promotion_discount = min(
                    promotion_discount,
                    Decimal(
                        str(promotion.maximum_discount)
                    ),
                )

            # Promotion cannot exceed current price
            promotion_discount = min(
                promotion_discount,
                engine_result["final_price"],
            ).quantize(
                Decimal("0.01")
            )

        # ---------------------------------------------------------
        # 9. Calculate Discounted Subtotal
        # ---------------------------------------------------------

        subtotal_after_discount = max(
            Decimal("0.00"),
            engine_result["final_price"]
            - promotion_discount,
        ).quantize(
            Decimal("0.01")
        )

        # ---------------------------------------------------------
        # 10. Calculate Tax
        # ---------------------------------------------------------

        tax_amount = TaxCalculator.calculate(
            subtotal_after_discount,
            data.tax_rate,
        )

        # ---------------------------------------------------------
        # 11. Calculate Final Price
        # ---------------------------------------------------------

        final_price = (
            subtotal_after_discount
            + tax_amount
        ).quantize(
            Decimal("0.01")
        )

        # ---------------------------------------------------------
        # 12. Total Discount
        # ---------------------------------------------------------

        total_discount = (
            rule_discount
            + promotion_discount
        ).quantize(
            Decimal("0.01")
        )

        # ---------------------------------------------------------
        # 13. Save Pricing Calculation
        # ---------------------------------------------------------

        try:

            calculation = PricingCalculationRepository.create(
                db=db,
                product_id=product.id,
                customer_id=customer.id,
                quantity=quantity,
                location=location,
                promotional_code=data.promotional_code,

                # JSON-safe values only
                input_parameters={
                    "customer_type": customer.customer_type,
                    "customer_category": customer.customer_category,
                    "location": location,
                    "quantity": quantity,
                    "category_id": product.category_id,
                    "product_id": product.id,
                    "base_price": str(unit_price),
                    "tax_rate": str(data.tax_rate),
                    "promotion_code": data.promotional_code,
                },

                original_price=original_price,
                discount_amount=total_discount,
                tax_amount=tax_amount,
                final_price=final_price,
            )

            # -----------------------------------------------------
            # 14. Save Applied Rules
            # -----------------------------------------------------

            for rule in engine_result["applied_rules"]:

                PricingCalculationRepository.create_calculation_rule(
                    db=db,
                    calculation_id=calculation.id,
                    rule_id=rule["rule_id"],
                    rule_name=rule["rule_name"],
                    action_type="DISCOUNT",
                    discount_amount=rule["discount_amount"],
                )

            # -----------------------------------------------------
            # 15. Commit Transaction
            # -----------------------------------------------------

            PricingCalculationRepository.commit(db)

            PricingCalculationRepository.refresh(
                db,
                calculation,
            )

        except Exception:

            db.rollback()
            raise

        # ---------------------------------------------------------
        # 16. Return Result
        # ---------------------------------------------------------

        return {
            "calculation_id": calculation.id,
            "product_id": product.id,
            "customer_id": customer.id,
            "quantity": quantity,
            "base_price": unit_price,
            "original_price": original_price,
            "discount_amount": total_discount,
            "promotion_discount": promotion_discount,
            "tax_rate": data.tax_rate,
            "tax_amount": tax_amount,
            "final_price": final_price,
            "promotional_code": data.promotional_code,
            "applied_rules": engine_result["applied_rules"],
        }
