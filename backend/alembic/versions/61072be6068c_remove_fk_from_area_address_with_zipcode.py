"""remove FK from area_address_with_zipcode

Revision ID: 61072be6068c
Revises: eb4669307651
Create Date: 2025-04-17 08:06:54.992469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '61072be6068c'
down_revision: Union[str, None] = 'eb4669307651'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
