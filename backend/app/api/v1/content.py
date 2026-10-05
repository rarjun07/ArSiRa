from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_admin_user
from app.db.session import get_db_session
from app.models.content import (
    About,
    Blog,
    Education,
    Experience,
    Project,
    Service,
    Skill,
    Testimonial,
)
from app.models.user import User
from app.repositories.crud import (
    create_record,
    delete_record,
    get_record,
    list_records,
    update_record,
)
from app.schemas.content import (
    AboutCreate,
    AboutResponse,
    BlogCreate,
    BlogResponse,
    BlogUpdate,
    EducationCreate,
    EducationResponse,
    EducationUpdate,
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
    ServiceCreate,
    ServiceResponse,
    ServiceUpdate,
    SkillCreate,
    SkillResponse,
    SkillUpdate,
    TestimonialCreate,
    TestimonialResponse,
    TestimonialUpdate,
    update_payload,
)

router = APIRouter(tags=["content"])

SessionDep = Annotated[AsyncSession, Depends(get_db_session)]
AdminDep = Annotated[User, Depends(get_current_admin_user)]


def not_found(resource: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{resource} was not found.",
    )


def conflict(resource: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=f"{resource} could not be saved because a unique value already exists.",
    )


async def save_with_unique_check(operation: Any, session: AsyncSession, resource: str) -> Any:
    try:
        return await operation
    except IntegrityError as exc:
        await session.rollback()
        raise conflict(resource) from exc


@router.get("/about", response_model=AboutResponse | None)
async def get_about(session: SessionDep) -> About | None:
    records = await list_records(session, About, order_by=About.id)
    return records[0] if records else None


@router.put("/about", response_model=AboutResponse)
async def upsert_about(
    payload: AboutCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> About:
    records = await list_records(session, About, order_by=About.id)
    data = update_payload(payload)
    if records:
        return await update_record(session, records[0], data)
    return await create_record(session, About, data)


@router.get("/skills", response_model=list[SkillResponse])
async def list_skills(session: SessionDep) -> list[Skill]:
    return await list_records(session, Skill, order_by=Skill.display_order)


@router.get("/skills/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: int, session: SessionDep) -> Skill:
    skill = await get_record(session, Skill, skill_id)
    if skill is None:
        raise not_found("Skill")
    return skill


@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    payload: SkillCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Skill:
    return await save_with_unique_check(
        create_record(session, Skill, payload.model_dump()),
        session,
        "Skill",
    )


@router.put("/skills/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Skill:
    skill = await get_record(session, Skill, skill_id)
    if skill is None:
        raise not_found("Skill")
    return await save_with_unique_check(
        update_record(session, skill, update_payload(payload)),
        session,
        "Skill",
    )


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Response:
    skill = await get_record(session, Skill, skill_id)
    if skill is None:
        raise not_found("Skill")
    await delete_record(session, skill)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects(session: SessionDep) -> list[Project]:
    return await list_records(session, Project, order_by=Project.display_order)


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, session: SessionDep) -> Project:
    project = await get_record(session, Project, project_id)
    if project is None:
        raise not_found("Project")
    return project


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Project:
    return await save_with_unique_check(
        create_record(session, Project, payload.model_dump()),
        session,
        "Project",
    )


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    payload: ProjectUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Project:
    project = await get_record(session, Project, project_id)
    if project is None:
        raise not_found("Project")
    return await save_with_unique_check(
        update_record(session, project, update_payload(payload)),
        session,
        "Project",
    )


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Response:
    project = await get_record(session, Project, project_id)
    if project is None:
        raise not_found("Project")
    await delete_record(session, project)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/blogs", response_model=list[BlogResponse])
async def list_blogs(session: SessionDep) -> list[Blog]:
    return await list_records(session, Blog, order_by=Blog.created_at.desc())


@router.get("/blogs/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: int, session: SessionDep) -> Blog:
    blog = await get_record(session, Blog, blog_id)
    if blog is None:
        raise not_found("Blog")
    return blog


@router.post("/blogs", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
async def create_blog(
    payload: BlogCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Blog:
    return await save_with_unique_check(
        create_record(session, Blog, payload.model_dump()),
        session,
        "Blog",
    )


@router.put("/blogs/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: int,
    payload: BlogUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Blog:
    blog = await get_record(session, Blog, blog_id)
    if blog is None:
        raise not_found("Blog")
    return await save_with_unique_check(
        update_record(session, blog, update_payload(payload)),
        session,
        "Blog",
    )


@router.delete("/blogs/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    blog_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Response:
    blog = await get_record(session, Blog, blog_id)
    if blog is None:
        raise not_found("Blog")
    await delete_record(session, blog)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/experience", response_model=list[ExperienceResponse])
async def list_experience(session: SessionDep) -> list[Experience]:
    return await list_records(session, Experience, order_by=Experience.display_order)


@router.get("/experience/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: int, session: SessionDep) -> Experience:
    experience = await get_record(session, Experience, experience_id)
    if experience is None:
        raise not_found("Experience")
    return experience


@router.post("/experience", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    payload: ExperienceCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Experience:
    return await create_record(session, Experience, payload.model_dump())


@router.put("/experience/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    payload: ExperienceUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Experience:
    experience = await get_record(session, Experience, experience_id)
    if experience is None:
        raise not_found("Experience")
    return await update_record(session, experience, update_payload(payload))


@router.delete("/experience/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    experience_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Response:
    experience = await get_record(session, Experience, experience_id)
    if experience is None:
        raise not_found("Experience")
    await delete_record(session, experience)


@router.get("/education", response_model=list[EducationResponse])
async def list_education(session: SessionDep) -> list[Education]:
    return await list_records(session, Education, order_by=Education.display_order)


@router.get("/education/{education_id}", response_model=EducationResponse)
async def get_education(education_id: int, session: SessionDep) -> Education:
    education = await get_record(session, Education, education_id)
    if education is None:
        raise not_found("Education")
    return education


@router.post("/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def create_education(
    payload: EducationCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Education:
    return await create_record(session, Education, payload.model_dump())


@router.put("/education/{education_id}", response_model=EducationResponse)
async def update_education(
    education_id: int,
    payload: EducationUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Education:
    education = await get_record(session, Education, education_id)
    if education is None:
        raise not_found("Education")
    return await update_record(session, education, update_payload(payload))


@router.delete("/education/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_education(
    education_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> None:
    education = await get_record(session, Education, education_id)
    if education is None:
        raise not_found("Education")
    await delete_record(session, education)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/testimonials", response_model=list[TestimonialResponse])
async def list_testimonials(session: SessionDep) -> list[Testimonial]:
    return await list_records(session, Testimonial, order_by=Testimonial.display_order)


@router.get("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(testimonial_id: int, session: SessionDep) -> Testimonial:
    testimonial = await get_record(session, Testimonial, testimonial_id)
    if testimonial is None:
        raise not_found("Testimonial")
    return testimonial


@router.post(
    "/testimonials",
    response_model=TestimonialResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_testimonial(
    payload: TestimonialCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Testimonial:
    return await create_record(session, Testimonial, payload.model_dump())


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    payload: TestimonialUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Testimonial:
    testimonial = await get_record(session, Testimonial, testimonial_id)
    if testimonial is None:
        raise not_found("Testimonial")
    return await update_record(session, testimonial, update_payload(payload))


@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    testimonial_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Response:
    testimonial = await get_record(session, Testimonial, testimonial_id)
    if testimonial is None:
        raise not_found("Testimonial")
    await delete_record(session, testimonial)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/services", response_model=list[ServiceResponse])
async def list_services(session: SessionDep) -> list[Service]:
    return await list_records(session, Service, order_by=Service.display_order)


@router.get("/services/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, session: SessionDep) -> Service:
    service = await get_record(session, Service, service_id)
    if service is None:
        raise not_found("Service")
    return service


@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    payload: ServiceCreate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Service:
    return await save_with_unique_check(
        create_record(session, Service, payload.model_dump()),
        session,
        "Service",
    )


@router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    payload: ServiceUpdate,
    session: SessionDep,
    _current_user: AdminDep,
) -> Service:
    service = await get_record(session, Service, service_id)
    if service is None:
        raise not_found("Service")
    return await save_with_unique_check(
        update_record(session, service, update_payload(payload)),
        session,
        "Service",
    )


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Response:
    service = await get_record(session, Service, service_id)
    if service is None:
        raise not_found("Service")
    await delete_record(session, service)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
