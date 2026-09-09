from sqlalchemy import or_

from app.core.cache import cache
from app.models.pricing_rule import PricingRule
from app.repositories.pricing_rule_cache import PricingRuleCache


class PricingRuleRepository:

    CACHE_KEY = "pricing_rules:active"

    @staticmethod
    def get_by_id(db, rule_id: int):
        return (
            db.query(PricingRule)
            .filter(PricingRule.id == rule_id)
            .first()
        )

    @staticmethod
    def get_by_name(db, name: str):
        return (
            db.query(PricingRule)
            .filter(PricingRule.name == name)
            .first()
        )

    @staticmethod
    def get_all(
        db,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(PricingRule)

        if search:
            search_value = f"%{search}%"

            query = query.filter(
                or_(
                    PricingRule.name.ilike(search_value),
                    PricingRule.description.ilike(search_value),
                )
            )

        if is_active is not None:
            query = query.filter(
                PricingRule.is_active == is_active
            )

        return (
            query
            .order_by(PricingRule.priority.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(
        db,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(PricingRule)

        if search:
            search_value = f"%{search}%"

            query = query.filter(
                or_(
                    PricingRule.name.ilike(search_value),
                    PricingRule.description.ilike(search_value),
                )
            )

        if is_active is not None:
            query = query.filter(
                PricingRule.is_active == is_active
            )

        return query.count()

    @staticmethod
    def get_active_rules(db):
        return (
            db.query(PricingRule)
            .filter(PricingRule.is_active == True)
            .order_by(PricingRule.priority.asc())
            .all()
        )

    @staticmethod
    def get_active_rules_cached(db):

        # -----------------------------------------
        # Check Redis
        # -----------------------------------------

        cached_rules = cache.get(
            PricingRuleRepository.CACHE_KEY
        )

        if cached_rules is not None:

            return [
                PricingRuleCache.deserialize(rule)
                for rule in cached_rules
            ]

        # -----------------------------------------
        # Redis MISS ? MySQL
        # -----------------------------------------

        rules = PricingRuleRepository.get_active_rules(db)

        # -----------------------------------------
        # Serialize rules for Redis
        # -----------------------------------------

        serialized_rules = [
            PricingRuleCache.serialize(rule)
            for rule in rules
        ]

        # -----------------------------------------
        # Store in Redis for 5 minutes
        # -----------------------------------------

        cache.set(
            PricingRuleRepository.CACHE_KEY,
            serialized_rules,
            expire=300,
        )

        return rules

    @staticmethod
    def create(
        db,
        name,
        description,
        priority,
        execution_type,
        maximum_discount,
        start_date,
        end_date,
        is_active,
        conditions,
        actions,
    ):

        rule = PricingRule(
            name=name,
            description=description,
            priority=priority,
            execution_type=execution_type,
            maximum_discount=maximum_discount,
            start_date=start_date,
            end_date=end_date,
            is_active=is_active,
        )

        db.add(rule)
        db.flush()

        for condition_data in conditions:
            rule.conditions.append(condition_data)

        for action_data in actions:
            rule.actions.append(action_data)

        db.flush()

        PricingRuleRepository.invalidate_cache()

        return rule

    @staticmethod
    def update(db, rule, **values):

        for key, value in values.items():

            if value is not None:
                setattr(rule, key, value)

        db.flush()

        PricingRuleRepository.invalidate_cache()

        return rule

    @staticmethod
    def update_active_status(
        db,
        rule,
        is_active: bool,
    ):

        rule.is_active = is_active

        db.flush()

        PricingRuleRepository.invalidate_cache()

        return rule

    @staticmethod
    def invalidate_cache():

        try:
            cache.delete(
                PricingRuleRepository.CACHE_KEY
            )
        except Exception:
            pass
