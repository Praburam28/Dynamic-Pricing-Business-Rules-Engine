from sqlalchemy.orm import Session

from app.models.customer import Customer


class CustomerRepository:

    @staticmethod
    def get_by_id(db: Session, customer_id: int):
        return db.query(Customer).filter(
            Customer.id == customer_id
        ).first()

    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(Customer).filter(
            Customer.email == email
        ).first()

    @staticmethod
    def get_all(db: Session, skip=0, limit=20):
        return (
            db.query(Customer)
            .order_by(Customer.id.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(db: Session):
        return db.query(Customer).count()

    @staticmethod
    def create(
        db,
        name,
        email,
        customer_type,
        customer_category,
        location,
        account_status,
    ):
        customer = Customer(
            name=name,
            email=email,
            customer_type=customer_type,
            customer_category=customer_category,
            location=location,
            account_status=account_status,
            is_active=True,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def update(db, customer, **values):
        for key, value in values.items():
            if value is not None:
                setattr(customer, key, value)

        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def update_active_status(db, customer, is_active):
        customer.is_active = is_active

        db.commit()
        db.refresh(customer)

        return customer
