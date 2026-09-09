from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    @staticmethod
    def get_by_username(db: Session, username: str):
        return (
            db.query(User)
            .filter(User.username == username)
            .first()
        )

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_by_id(db: Session, user_id: int):
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ):
        return (
            db.query(User)
            .order_by(User.id.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(db: Session):
        return db.query(User).count()

    @staticmethod
    def create(
        db: Session,
        username: str,
        email: str,
        password_hash: str,
        role_id: int,
    ):
        user = User(
            username=username,
            email=email,
            password_hash=password_hash,
            role_id=role_id,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_role(
        db: Session,
        user: User,
        role_id: int,
    ):
        user.role_id = role_id
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_active_status(
        db: Session,
        user: User,
        is_active: bool,
    ):
        user.is_active = is_active
        db.commit()
        db.refresh(user)
        return user
