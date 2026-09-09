from fastapi import HTTPException

from app.repositories.pricing_rule_repository import PricingRuleRepository


class PricingRuleService:

    ALLOWED_OPERATORS = {
        "=",
        "!=",
        ">",
        ">=",
        "<",
        "<=",
        "IN",
        "NOT_IN",
        "CONTAINS",
    }

    ALLOWED_EXECUTION_TYPES = {
        "COMBINABLE",
        "EXCLUSIVE",
        "OVERRIDE",
    }

    ALLOWED_ACTION_TYPES = {
        "DISCOUNT",
        "SURCHARGE",
        "OVERRIDE_PRICE",
    }

    ALLOWED_DISCOUNT_TYPES = {
        "PERCENTAGE",
        "FIXED",
    }

    ALLOWED_FIELDS = {
        "customer_type",
        "customer_category",
        "location",
        "quantity",
        "category_id",
        "product_id",
        "base_price",
        "promotion_code",
    }

    @staticmethod
    def validate_rule_data(data):

        if data.execution_type not in PricingRuleService.ALLOWED_EXECUTION_TYPES:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid execution_type. Allowed values: "
                    "COMBINABLE, EXCLUSIVE, OVERRIDE"
                ),
            )

        for condition in data.conditions:

            if condition.field not in PricingRuleService.ALLOWED_FIELDS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported condition field: {condition.field}",
                )

            if condition.operator not in PricingRuleService.ALLOWED_OPERATORS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported operator: {condition.operator}",
                )

            if condition.logical_operator not in {"AND", "OR"}:
                raise HTTPException(
                    status_code=400,
                    detail="logical_operator must be AND or OR",
                )

        for action in data.actions:

            if action.action_type not in PricingRuleService.ALLOWED_ACTION_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported action_type: {action.action_type}",
                )

            if action.action_type == "DISCOUNT":

                if action.discount_type not in PricingRuleService.ALLOWED_DISCOUNT_TYPES:
                    raise HTTPException(
                        status_code=400,
                        detail=(
                            "Discount action requires discount_type "
                            "PERCENTAGE or FIXED"
                        ),
                    )

                if action.discount_type == "PERCENTAGE" and action.value > 100:
                    raise HTTPException(
                        status_code=400,
                        detail="Percentage discount cannot exceed 100",
                    )

    @staticmethod
    def create(db, data):

        existing = PricingRuleRepository.get_by_name(
            db,
            data.name,
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Pricing rule already exists",
            )

        PricingRuleService.validate_rule_data(data)

        try:
            rule = PricingRuleRepository.create_rule(
                db=db,
                name=data.name,
                description=data.description,
                priority=data.priority,
                execution_type=data.execution_type,
                maximum_discount=data.maximum_discount,
                start_date=data.start_date,
                end_date=data.end_date,
                is_active=data.is_active,
            )

            for condition in data.conditions:
                PricingRuleRepository.create_condition(
                    db=db,
                    rule_id=rule.id,
                    data=condition,
                )

            for action in data.actions:
                PricingRuleRepository.create_action(
                    db=db,
                    rule_id=rule.id,
                    data=action,
                )

            PricingRuleRepository.commit(db)
            return PricingRuleRepository.refresh(db, rule)

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get(db, rule_id):

        rule = PricingRuleRepository.get_by_id(
            db,
            rule_id,
        )

        if not rule:
            raise HTTPException(
                status_code=404,
                detail="Pricing rule not found",
            )

        return rule

    @staticmethod
    def get_all(
        db,
        skip=0,
        limit=20,
        search=None,
        is_active=None,
    ):

        items = PricingRuleRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active,
        )

        total = PricingRuleRepository.count(
            db=db,
            search=search,
            is_active=is_active,
        )

        return {
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    @staticmethod
    def update(db, rule_id, data):

        rule = PricingRuleService.get(
            db,
            rule_id,
        )

        if data.name is not None:

            existing = PricingRuleRepository.get_by_name(
                db,
                data.name,
            )

            if existing and existing.id != rule.id:
                raise HTTPException(
                    status_code=409,
                    detail="Pricing rule name already exists",
                )

        if data.execution_type is not None:

            if data.execution_type not in PricingRuleService.ALLOWED_EXECUTION_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid execution_type",
                )

        if data.start_date and data.end_date:

            if data.end_date <= data.start_date:
                raise HTTPException(
                    status_code=400,
                    detail="end_date must be after start_date",
                )

        return PricingRuleRepository.update(
            db=db,
            rule=rule,
            name=data.name,
            description=data.description,
            priority=data.priority,
            execution_type=data.execution_type,
            maximum_discount=data.maximum_discount,
            start_date=data.start_date,
            end_date=data.end_date,
            is_active=data.is_active,
        )

    @staticmethod
    def activate(db, rule_id):

        rule = PricingRuleService.get(
            db,
            rule_id,
        )

        if rule.is_active:
            raise HTTPException(
                status_code=400,
                detail="Pricing rule is already active",
            )

        return PricingRuleRepository.update_active_status(
            db,
            rule,
            True,
        )

    @staticmethod
    def deactivate(db, rule_id):

        rule = PricingRuleService.get(
            db,
            rule_id,
        )

        if not rule.is_active:
            raise HTTPException(
                status_code=400,
                detail="Pricing rule is already inactive",
            )

        return PricingRuleRepository.update_active_status(
            db,
            rule,
            False,
        )
