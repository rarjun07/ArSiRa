from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class TimestampedResponse(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AboutBase(BaseModel):
    headline: str = Field(min_length=2, max_length=160)
    summary: str = Field(min_length=2)
    bio: str | None = None
    profile_image_url: str | None = Field(default=None, max_length=500)
    resume_url: str | None = Field(default=None, max_length=500)
    location: str | None = Field(default=None, max_length=120)
    email: str | None = Field(default=None, max_length=255)
    phone_number: str | None = Field(default=None, max_length=40)
    whatsapp_number: str | None = Field(default=None, max_length=40)
    github_url: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)


class AboutCreate(AboutBase):
    pass


class AboutUpdate(BaseModel):
    headline: str | None = Field(default=None, min_length=2, max_length=160)
    summary: str | None = Field(default=None, min_length=2)
    bio: str | None = None
    profile_image_url: str | None = Field(default=None, max_length=500)
    resume_url: str | None = Field(default=None, max_length=500)
    location: str | None = Field(default=None, max_length=120)
    email: str | None = Field(default=None, max_length=255)
    phone_number: str | None = Field(default=None, max_length=40)
    whatsapp_number: str | None = Field(default=None, max_length=40)
    github_url: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)


class AboutResponse(AboutBase, TimestampedResponse):
    pass


class SkillBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    category: str = Field(min_length=2, max_length=100)
    icon_url: str | None = Field(default=None, max_length=500)
    proficiency: int | None = Field(default=None, ge=0, le=100)
    display_order: int = 0
    is_featured: bool = False


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    category: str | None = Field(default=None, min_length=2, max_length=100)
    icon_url: str | None = Field(default=None, max_length=500)
    proficiency: int | None = Field(default=None, ge=0, le=100)
    display_order: int | None = None
    is_featured: bool | None = None


class SkillResponse(SkillBase, TimestampedResponse):
    pass


class ProjectBase(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    slug: str = Field(min_length=2, max_length=180)
    summary: str = Field(min_length=2)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    live_url: str | None = Field(default=None, max_length=500)
    repo_url: str | None = Field(default=None, max_length=500)
    tech_stack: list[str] = Field(default_factory=list)
    display_order: int = 0
    is_featured: bool = False
    is_published: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    slug: str | None = Field(default=None, min_length=2, max_length=180)
    summary: str | None = Field(default=None, min_length=2)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    live_url: str | None = Field(default=None, max_length=500)
    repo_url: str | None = Field(default=None, max_length=500)
    tech_stack: list[str] | None = None
    display_order: int | None = None
    is_featured: bool | None = None
    is_published: bool | None = None


class ProjectResponse(ProjectBase, TimestampedResponse):
    pass


class BlogBase(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    slug: str = Field(min_length=2, max_length=200)
    excerpt: str = Field(min_length=2)
    content: str = Field(min_length=2)
    cover_image_url: str | None = Field(default=None, max_length=500)
    tags: list[str] = Field(default_factory=list)
    is_published: bool = False
    published_at: datetime | None = None


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=180)
    slug: str | None = Field(default=None, min_length=2, max_length=200)
    excerpt: str | None = Field(default=None, min_length=2)
    content: str | None = Field(default=None, min_length=2)
    cover_image_url: str | None = Field(default=None, max_length=500)
    tags: list[str] | None = None
    is_published: bool | None = None
    published_at: datetime | None = None


class BlogResponse(BlogBase, TimestampedResponse):
    pass


class ExperienceBase(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    company: str = Field(min_length=2, max_length=160)
    location: str | None = Field(default=None, max_length=120)
    start_date: str = Field(min_length=2, max_length=40)
    end_date: str | None = Field(default=None, max_length=40)
    description: str | None = None
    highlights: list[str] = Field(default_factory=list)
    display_order: int = 0
    is_current: bool = False


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    company: str | None = Field(default=None, min_length=2, max_length=160)
    location: str | None = Field(default=None, max_length=120)
    start_date: str | None = Field(default=None, min_length=2, max_length=40)
    end_date: str | None = Field(default=None, max_length=40)
    description: str | None = None
    highlights: list[str] | None = None
    display_order: int | None = None
    is_current: bool | None = None


class ExperienceResponse(ExperienceBase, TimestampedResponse):
    pass


class EducationBase(BaseModel):
    degree: str = Field(min_length=2, max_length=160)
    institution: str = Field(min_length=2, max_length=180)
    field_of_study: str | None = Field(default=None, max_length=160)
    location: str | None = Field(default=None, max_length=120)
    start_date: str = Field(min_length=2, max_length=40)
    end_date: str | None = Field(default=None, max_length=40)
    description: str | None = None
    display_order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    degree: str | None = Field(default=None, min_length=2, max_length=160)
    institution: str | None = Field(default=None, min_length=2, max_length=180)
    field_of_study: str | None = Field(default=None, max_length=160)
    location: str | None = Field(default=None, max_length=120)
    start_date: str | None = Field(default=None, min_length=2, max_length=40)
    end_date: str | None = Field(default=None, max_length=40)
    description: str | None = None
    display_order: int | None = None


class EducationResponse(EducationBase, TimestampedResponse):
    pass


class TestimonialBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    role: str | None = Field(default=None, max_length=160)
    company: str | None = Field(default=None, max_length=160)
    quote: str = Field(min_length=2)
    avatar_url: str | None = Field(default=None, max_length=500)
    display_order: int = 0
    is_published: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    role: str | None = Field(default=None, max_length=160)
    company: str | None = Field(default=None, max_length=160)
    quote: str | None = Field(default=None, min_length=2)
    avatar_url: str | None = Field(default=None, max_length=500)
    display_order: int | None = None
    is_published: bool | None = None


class TestimonialResponse(TestimonialBase, TimestampedResponse):
    pass


class ServiceBase(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    slug: str = Field(min_length=2, max_length=180)
    summary: str = Field(min_length=2)
    description: str | None = None
    icon_url: str | None = Field(default=None, max_length=500)
    display_order: int = 0
    is_published: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    slug: str | None = Field(default=None, min_length=2, max_length=180)
    summary: str | None = Field(default=None, min_length=2)
    description: str | None = None
    icon_url: str | None = Field(default=None, max_length=500)
    display_order: int | None = None
    is_published: bool | None = None


class ServiceResponse(ServiceBase, TimestampedResponse):
    pass


def update_payload(schema: BaseModel) -> dict[str, Any]:
    return schema.model_dump(exclude_unset=True)
