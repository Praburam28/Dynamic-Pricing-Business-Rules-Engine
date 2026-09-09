from sqlalchemy.orm import Session

from app.models.category import Category


class CategoryRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        category_id: int,
    ):
        return (
            db.query(Category)
            .filter(Category.id == category_id)
            .first()
        )

    @staticmethod
    def get_by_name(
        db: Session,
        name: str,
    ):
        return (
            db.query(Category)
            .filter(Category.name == name)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(Category)

        if search:
            query = query.filter(
                Category.name.ilike(f"%{search}%")
            )

        if is_active is not None:
            query = query.filter(
                Category.is_active == is_active
            )

        return (
            query
            .order_by(Category.id.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(
        db: Session,
        search: str | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(Category)

        if search:
            query = query.filter(
                Category.name.ilike(f"%{search}%")
            )

        if is_active is not None:
            query = query.filter(
                Category.is_active == is_active
            )

        return query.count()

    @staticmethod
    def create(
        db: Session,
        name: str,
        description: str | None,
    ):
        category = Category(
            name=name,
            description=description,
            is_active=True,
        )

        db.add(category)
        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def update(
        db: Session,
        category: Category,
        name: str | None = None,
        description: str | None = None,
    ):
        if name is not None:
            category.name = name

        if description is not None:
            category.description = description

        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def update_active_status(
        db: Session,
        category: Category,
        is_active: bool,
    ):
        category.is_active = is_active

        db.commit()
        db.refresh(category)

        return category
