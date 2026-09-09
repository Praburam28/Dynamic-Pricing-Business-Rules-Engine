from sqlalchemy.orm import Session

from app.models.product import Product


class ProductRepository:

    @staticmethod
    def get_by_id(db: Session, product_id: int):
        return (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

    @staticmethod
    def get_by_sku(db: Session, sku: str):
        return (
            db.query(Product)
            .filter(Product.sku == sku)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        category_id: int | None = None,
        is_active: bool | None = None,
        sort_by: str = "id",
        sort_order: str = "asc",
    ):
        query = db.query(Product)

        if search:
            query = query.filter(
                Product.name.ilike(f"%{search}%")
                | Product.sku.ilike(f"%{search}%")
            )

        if category_id is not None:
            query = query.filter(
                Product.category_id == category_id
            )

        if is_active is not None:
            query = query.filter(
                Product.is_active == is_active
            )

        sort_column = getattr(Product, sort_by)

        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        return (
            query
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(
        db: Session,
        search: str | None = None,
        category_id: int | None = None,
        is_active: bool | None = None,
    ):
        query = db.query(Product)

        if search:
            query = query.filter(
                Product.name.ilike(f"%{search}%")
                | Product.sku.ilike(f"%{search}%")
            )

        if category_id is not None:
            query = query.filter(
                Product.category_id == category_id
            )

        if is_active is not None:
            query = query.filter(
                Product.is_active == is_active
            )

        return query.count()

    @staticmethod
    def create(
        db: Session,
        name: str,
        sku: str,
        description: str | None,
        base_price,
        category_id: int,
    ):
        product = Product(
            name=name,
            sku=sku,
            description=description,
            base_price=base_price,
            category_id=category_id,
            is_active=True,
        )

        db.add(product)
        db.commit()
        db.refresh(product)

        return product

    @staticmethod
    def update(
        db: Session,
        product: Product,
        name=None,
        sku=None,
        description=None,
        base_price=None,
        category_id=None,
    ):
        if name is not None:
            product.name = name

        if sku is not None:
            product.sku = sku

        if description is not None:
            product.description = description

        if base_price is not None:
            product.base_price = base_price

        if category_id is not None:
            product.category_id = category_id

        db.commit()
        db.refresh(product)

        return product

    @staticmethod
    def update_active_status(
        db: Session,
        product: Product,
        is_active: bool,
    ):
        product.is_active = is_active

        db.commit()
        db.refresh(product)

        return product
