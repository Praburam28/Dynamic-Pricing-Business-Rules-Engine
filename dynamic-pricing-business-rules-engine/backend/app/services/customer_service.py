from fastapi import HTTPException

from app.repositories.customer_repository import CustomerRepository


class CustomerService:

    ALLOWED_TYPES = {
        "REGULAR",
        "PREMIUM",
        "BUSINESS",
        "WHOLESALE",
    }

    ALLOWED_STATUS = {
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
    }

    @staticmethod
    def create(db, data):

        if data.customer_type not in CustomerService.ALLOWED_TYPES:
            raise HTTPException(
                400,
                "customer_type must be REGULAR, PREMIUM, BUSINESS, or WHOLESALE",
            )

        if data.account_status not in CustomerService.ALLOWED_STATUS:
            raise HTTPException(
                400,
                "Invalid account_status",
            )

        existing = CustomerRepository.get_by_email(
            db,
            data.email,
        )

        if existing:
            raise HTTPException(
                409,
                "Customer email already exists",
            )

        return CustomerRepository.create(
            db=db,
            name=data.name,
            email=data.email,
            customer_type=data.customer_type,
            customer_category=data.customer_category,
            location=data.location,
            account_status=data.account_status,
        )

    @staticmethod
    def get(db, customer_id):

        customer = CustomerRepository.get_by_id(
            db,
            customer_id,
        )

        if not customer:
            raise HTTPException(
                404,
                "Customer not found",
            )

        return customer

    @staticmethod
    def get_all(db, skip=0, limit=20):

        items = CustomerRepository.get_all(
            db,
            skip,
            limit,
        )

        return {
            "items": items,
            "total": CustomerRepository.count(db),
            "skip": skip,
            "limit": limit,
        }

    @staticmethod
    def update(db, customer_id, data):

        customer = CustomerService.get(
            db,
            customer_id,
        )

        if data.email is not None:

            existing = CustomerRepository.get_by_email(
                db,
                data.email,
            )

            if existing and existing.id != customer.id:
                raise HTTPException(
                    409,
                    "Customer email already exists",
                )

        if (
            data.customer_type is not None
            and data.customer_type
            not in CustomerService.ALLOWED_TYPES
        ):
            raise HTTPException(
                400,
                "Invalid customer_type",
            )

        if (
            data.account_status is not None
            and data.account_status
            not in CustomerService.ALLOWED_STATUS
        ):
            raise HTTPException(
                400,
                "Invalid account_status",
            )

        return CustomerRepository.update(
            db,
            customer,
            name=data.name,
            email=data.email,
            customer_type=data.customer_type,
            customer_category=data.customer_category,
            location=data.location,
            account_status=data.account_status,
        )

    @staticmethod
    def activate(db, customer_id):

        customer = CustomerService.get(
            db,
            customer_id,
        )

        if customer.is_active:
            raise HTTPException(
                400,
                "Customer is already active",
            )

        return CustomerRepository.update_active_status(
            db,
            customer,
            True,
        )

    @staticmethod
    def deactivate(db, customer_id):

        customer = CustomerService.get(
            db,
            customer_id,
        )

        if not customer.is_active:
            raise HTTPException(
                400,
                "Customer is already inactive",
            )

        return CustomerRepository.update_active_status(
            db,
            customer,
            False,
        )
