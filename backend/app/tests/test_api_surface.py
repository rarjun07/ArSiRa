from fastapi import FastAPI

from app.main import create_app


def test_cms_api_surface_includes_required_routes() -> None:
    app: FastAPI = create_app()
    paths = set(app.openapi()["paths"])

    assert "/health" in paths
    assert "/api/v1/auth/login" in paths
    assert "/api/v1/about" in paths
    assert "/api/v1/projects" in paths
    assert "/api/v1/upload/image" in paths
    assert "/api/v1/contact" in paths
