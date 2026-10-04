from typing import Any, TypeVar

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


async def list_records(
    session: AsyncSession,
    model: type[ModelType],
    *,
    order_by: Any | None = None,
) -> list[ModelType]:
    query: Select[tuple[ModelType]] = select(model)
    if order_by is not None:
        query = query.order_by(order_by)
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_record(
    session: AsyncSession,
    model: type[ModelType],
    record_id: int,
) -> ModelType | None:
    return await session.get(model, record_id)


async def create_record(
    session: AsyncSession,
    model: type[ModelType],
    data: dict[str, Any],
) -> ModelType:
    record = model(**data)
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def update_record(
    session: AsyncSession,
    record: ModelType,
    data: dict[str, Any],
) -> ModelType:
    for field, value in data.items():
        setattr(record, field, value)
    await session.commit()
    await session.refresh(record)
    return record


async def delete_record(session: AsyncSession, record: ModelType) -> None:
    await session.delete(record)
    await session.commit()
