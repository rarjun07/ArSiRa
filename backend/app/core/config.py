from functools import lru_cache
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio CMS API"
    app_env: str = "local"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio_cms",
        validation_alias="DATABASE_URL",
    )
    cors_origins: Annotated[list[str], NoDecode] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    secret_key: str = Field(
        default="change-this-before-production",
        validation_alias="SECRET_KEY",
    )
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(
        default=30,
        validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    refresh_token_expire_days: int = Field(
        default=7,
        validation_alias="REFRESH_TOKEN_EXPIRE_DAYS",
    )
    upload_dir: str = Field(default="uploads", validation_alias="UPLOAD_DIR")
    upload_mount_path: str = Field(default="/uploads", validation_alias="UPLOAD_MOUNT_PATH")
    public_upload_base_url: str = Field(
        default="/uploads",
        validation_alias="PUBLIC_UPLOAD_BASE_URL",
    )
    bootstrap_admin_email: str | None = Field(
        default=None,
        validation_alias="BOOTSTRAP_ADMIN_EMAIL",
    )
    bootstrap_admin_username: str | None = Field(
        default=None,
        validation_alias="BOOTSTRAP_ADMIN_USERNAME",
    )
    bootstrap_admin_password: str | None = Field(
        default=None,
        validation_alias="BOOTSTRAP_ADMIN_PASSWORD",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("database_url", mode="before")
    @classmethod
    def use_asyncpg_driver(cls, value: str) -> str:
        """Use the async PostgreSQL driver for local and Render URLs."""
        for prefix in (
            "postgres://",
            "postgresql://",
            "postgresql+psycopg://",
            "postgresql+psycopg2://",
        ):
            if value.startswith(prefix):
                return "postgresql+asyncpg://" + value[len(prefix) :]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
