from fastapi import HTTPException

from app.repositories.category_repository import CategoryRepository
from app.repositories.product_repository import ProductRepository


class ProductService:

    @staticmethod
    def create(db, data):

        existing = ProductRepository.get_by_sku(
            db,
            data.sku,
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Product SKU already exists",
            )

        category = CategoryRepository.get_by_id(
            db,
            data.category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        if not category.is_active:
            raise HTTPException(
                status_code=400,
                detail="Cannot assign product to an inactive category",
            )

        return ProductRepository.create(
            db=db,
            name=data.name,
            sku=data.sku,
            description=data.description,
            base_price=data.base_price,
            category_id=data.category_id,
        )

    @staticmethod
    def get(db, product_id):

        product = ProductRepository.get_by_id(
            db,
            product_id,
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found",
            )

        return product

    @staticmethod
    def get_all(
        db,
        skip=0,
        limit=20,
        search=None,
        category_id=None,
        is_active=None,
        sort_by="id",
        sort_order="asc",
    ):

        allowed_sort_fields = {
            "id",
            "name",
            "sku",
            "base_price",
        }

        if sort_by not in allowed_sort_fields:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid sort_by. "
                    "Allowed values: id, name, sku, base_price"
                ),
            )

        if sort_order not in {"asc", "desc"}:
            raise HTTPException(
                status_code=400,
                detail="sort_order must be 'asc' or 'desc'",
            )

        items = ProductRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            search=search,
            category_id=category_id,
            is_active=is_active,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        total = ProductRepository.count(
            db=db,
            search=search,
            category_id=category_id,
            is_active=is_active,
        )

        return {
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit,
            "sort_by": sort_by,
            "sort_order": sort_order,
        }

    @staticmethod
    def update(db, product_id, data):

        product = ProductService.get(
            db,
            product_id,
        )

        if data.sku is not None:
            existing = ProductRepository.get_by_sku(
                db,
                data.sku,
            )

            if existing and existing.id != product.id:
                raise HTTPException(
                    status_code=409,
                    detail="Product SKU already exists",
                )

        if data.category_id is not None:

            category = CategoryRepository.get_by_id(
                db,
                data.category_id,
            )

            if not category:
                raise HTTPException(
                    status_code=404,
                    detail="Category not found",
                )

            if not category.is_active:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot assign product to an inactive category",
                )

        return ProductRepository.update(
            db=db,
            product=product,
            name=data.name,
            sku=data.sku,
            description=data.description,
            base_price=data.base_price,
            category_id=data.category_id,
        )

    @staticmethod
    def activate(db, product_id):

        product = ProductService.get(
            db,
            product_id,
        )

        if product.is_active:
            raise HTTPException(
                status_code=400,
                detail="Product is already active",
            )

        return ProductRepository.update_active_status(
            db,
            product,
            True,
        )

    @staticmethod
    def deactivate(db, product_id):

        product = ProductService.get(
            db,
            product_id,
        )

        if not product.is_active:
            raise HTTPException(
                status_code=400,
                detail="Product is already inactive",
            )

        return ProductRepository.update_active_status(
            db,
            product,
            False,
        )
