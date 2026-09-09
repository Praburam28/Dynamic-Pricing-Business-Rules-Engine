from fastapi import APIRouter, Depends

from app.database import get_db
from app.dependencies import require_admin
from app.schemas.rule_testing import (
    RuleTestRequest,
    RuleTestResponse,
)
from app.services.rule_testing_service import (
    RuleTestingService,
)


router = APIRouter(
    prefix="/rule-testing",
    tags=["Rule Testing"],
)


@router.post(
    "",
    response_model=RuleTestResponse,
)
def test_pricing_rule(
    data: RuleTestRequest,
    db=Depends(get_db),
    current_user=Depends(require_admin),
):

    return RuleTestingService.test_rule(
        db=db,
        data=data,
    )
