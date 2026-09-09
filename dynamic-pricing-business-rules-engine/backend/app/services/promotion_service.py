from datetime import datetime, timezone
from decimal import Decimal

from fastapi import HTTPException

from app.repositories.promotion_repository import PromotionRepository


class PromotionService:

    @staticmethod
    def validate_discount(
        discount_type,
        discount_value,
    ):
        if discount_type not in {
            "PERCENTAGE",
            "FIXED",
        }:
            raise HTTPException(
                status_code=400,
                detail="discount_type must be PERCENTAGE or FIXED",
            )

        if discount_type == "PERCENTAGE":
            if discount_value > 100:
                raise HTTPException(
                    status_code=400,
                    detail="Percentage discount cannot exceed 100",
                )

    @staticmethod
    def create(db, data):

        existing = PromotionRepository.get_by_code(
            db,
            data.code,
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Promotion code already exists",
            )

        PromotionService.validate_discount(
            data.discount_type,
            data.discount_value,
        )

        return PromotionRepository.create(
            db=db,
            code=data.code,
            discount_type=data.discount_type,
            discount_value=data.discount_value,
            minimum_purchase=data.minimum_purchase,
            maximum_discount=data.maximum_discount,
            start_date=data.start_date,
            expiry_date=data.expiry_date,
            usage_limit=data.usage_limit,
            is_active=data.is_active,
        )

    @staticmethod
    def get(db, promotion_id):

        promotion = PromotionRepository.get_by_id(
            db,
            promotion_id,
        )

        if not promotion:
            raise HTTPException(
                status_code=404,
                detail="Promotion not found",
            )

        return promotion

    @staticmethod
    def get_all(
        db,
        skip=0,
        limit=20,
        search=None,
        is_active=None,
    ):

        items = PromotionRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active,
        )

        total = PromotionRepository.count(
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
    def update(
        db,
        promotion_id,
        data,
    ):

        promotion = PromotionService.get(
            db,
            promotion_id,
        )

        discount_type = (
            data.discount_type
            if data.discount_type is not None
            else promotion.discount_type
        )

        discount_value = (
            data.discount_value
            if data.discount_value is not None
            else promotion.discount_value
        )

        PromotionService.validate_discount(
            discount_type,
            discount_value,
        )

        start_date = (
            data.start_date
            if data.start_date is not None
            else promotion.start_date
        )

        expiry_date = (
            data.expiry_date
            if data.expiry_date is not None
            else promotion.expiry_date
        )

        if expiry_date <= start_date:
            raise HTTPException(
                status_code=400,
                detail="expiry_date must be after start_date",
            )

        if (
            data.usage_limit is not None
            and data.usage_limit < promotion.usage_count
        ):
            raise HTTPException(
                status_code=400,
                detail="usage_limit cannot be less than usage_count",
            )

        return PromotionRepository.update(
            db=db,
            promotion=promotion,
            discount_type=data.discount_type,
            discount_value=data.discount_value,
            minimum_purchase=data.minimum_purchase,
            maximum_discount=data.maximum_discount,
            start_date=data.start_date,
            expiry_date=data.expiry_date,
            usage_limit=data.usage_limit,
            is_active=data.is_active,
        )

    @staticmethod
    def activate(db, promotion_id):

        promotion = PromotionService.get(
            db,
            promotion_id,
        )

        if promotion.is_active:
            raise HTTPException(
                status_code=400,
                detail="Promotion is already active",
            )

        return PromotionRepository.update_active_status(
            db,
            promotion,
            True,
        )

    @staticmethod
    def deactivate(db, promotion_id):

        promotion = PromotionService.get(
            db,
            promotion_id,
        )

        if not promotion.is_active:
            raise HTTPException(
                status_code=400,
                detail="Promotion is already inactive",
            )

        return PromotionRepository.update_active_status(
            db,
            promotion,
            False,
        )

    @staticmethod
    def validate_for_purchase(
        db,
        code,
        purchase_amount,
    ):

        promotion = PromotionRepository.get_by_code(
            db,
            code,
        )

        if not promotion:
            raise HTTPException(
                status_code=404,
                detail="Invalid promotion code",
            )

        if not promotion.is_active:
            raise HTTPException(
                status_code=400,
                detail="Promotion is inactive",
            )

        now = datetime.now(timezone.utc)

        start_date = promotion.start_date
        expiry_date = promotion.expiry_date

        if start_date.tzinfo is None:
            start_date = start_date.replace(
                tzinfo=timezone.utc
            )

        if expiry_date.tzinfo is None:
            expiry_date = expiry_date.replace(
                tzinfo=timezone.utc
            )

        if now < start_date:
            raise HTTPException(
                status_code=400,
                detail="Promotion has not started",
            )

        if now > expiry_date:
            raise HTTPException(
                status_code=400,
                detail="Promotion has expired",
            )

        if (
            promotion.usage_limit is not None
            and promotion.usage_count >= promotion.usage_limit
        ):
            raise HTTPException(
                status_code=400,
                detail="Promotion usage limit reached",
            )

        purchase_amount = Decimal(
            str(purchase_amount)
        )

        if (
            promotion.minimum_purchase is not None
            and purchase_amount < promotion.minimum_purchase
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Minimum purchase of "
                    f"{promotion.minimum_purchase} is required"
                ),
            )

        return promotion
