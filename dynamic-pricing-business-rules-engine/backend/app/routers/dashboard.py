from fastapi import APIRouter, Depends

from app.database import get_db
from app.dependencies import require_admin
from app.schemas.dashboard import (
    DashboardAnalyticsResponse,
    DashboardSummaryResponse,
)
from app.services.dashboard_service import (
    DashboardService,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
)
def get_dashboard_summary(
    db=Depends(get_db),
    current_user=Depends(require_admin),
):
    return DashboardService.get_summary(db)


@router.get(
    "/analytics",
    response_model=DashboardAnalyticsResponse,
)
def get_dashboard_analytics(
    db=Depends(get_db),
    current_user=Depends(require_admin),
):
    return DashboardService.get_analytics(db)
