from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:

    @staticmethod
    def create(
        db: Session,
        data: CategoryCreate,
    ):
        existing = CategoryRepository.get_by_name(
            db,
            data.name,
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category already exists",
            )

        return CategoryRepository.create(
            db=db,
            name=data.name,
            description=data.description,
        )

    @staticmethod
    def get(
        db: Session,
        category_id: int,
    ):
        category = CategoryRepository.get_by_id(
            db,
            category_id,
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        return category

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        items = CategoryRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active,
        )

        total = CategoryRepository.count(
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
        db: Session,
        category_id: int,
        data: CategoryUpdate,
    ):
        category = CategoryService.get(
            db,
            category_id,
        )

        if data.name is not None:
            existing = CategoryRepository.get_by_name(
                db,
                data.name,
            )

            if existing and existing.id != category.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Category name already exists",
                )

        return CategoryRepository.update(
            db=db,
            category=category,
            name=data.name,
            description=data.description,
        )

    @staticmethod
    def activate(
        db: Session,
        category_id: int,
    ):
        category = CategoryService.get(
            db,
            category_id,
        )

        if category.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category is already active",
            )

        return CategoryRepository.update_active_status(
            db,
            category,
            True,
        )

    @staticmethod
    def deactivate(
        db: Session,
        category_id: int,
    ):
        category = CategoryService.get(
            db,
            category_id,
        )

        if not category.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category is already inactive",
            )

        return CategoryRepository.update_active_status(
            db,
            category,
            False,
        )
