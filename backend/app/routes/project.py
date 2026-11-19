import os
from uuid import UUID

import httpx  # type: ignore[import-not-found]
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.dependencies.auth import get_current_user
from app.models.project import ProjectCreate, ProjectUpdate, ProjectResponse

load_dotenv()

router = APIRouter(prefix="/projects", tags=["Projects"])

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_ANON_KEY = os.environ["SUPABASE_ANON_KEY"]
PROJECTS_URL = f"{SUPABASE_URL}/rest/v1/projects"


async def db_request(
    method: str,
    user: dict,
    params: dict | None = None,
    body: dict | None = None,
):
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {user['access_token']}",
        "Content-Type": "application/json",
    }

    if method in ("POST", "PATCH", "DELETE"):
        headers["Prefer"] = "return=representation"

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.request(
            method,
            PROJECTS_URL,
            headers=headers,
            params=params,
            json=body,
        )

    if response.status_code >= 400:
        # Do not expose database internals to the frontend.
        if response.status_code in (401, 403):
            raise HTTPException(
                status_code=403,
                detail="Not allowed to access this project",
            )

        if response.status_code >= 500:
            raise HTTPException(
                status_code=502,
                detail="Database request failed",
            )

        raise HTTPException(
            status_code=400,
            detail="Invalid project request",
        )

    if response.status_code == 204 or not response.content:
        return []

    return response.json()


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    data: ProjectCreate,
    user: dict = Depends(get_current_user),
):
    body = data.model_dump()

    # Never take the owner ID from client input.
    body["user_id"] = user["id"]

    rows = await db_request("POST", user, body=body)

    if not rows:
        raise HTTPException(
            status_code=500,
            detail="Project was not returned after creation",
        )

    return rows[0]


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    user: dict = Depends(get_current_user),
):
    return await db_request(
        "GET",
        user,
        params={
            "select": "*",
            "order": "created_at.desc",
            "user_id": f"eq.{user['id']}",
        },
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    user: dict = Depends(get_current_user),
):
    rows = await db_request(
        "GET",
        user,
        params={
            "select": "*",
            "id": f"eq.{project_id}",
            "user_id": f"eq.{user['id']}",
        },
    )

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return rows[0]


@router.put("/{project_id}", response_model=ProjectResponse)
async def replace_project(
    project_id: UUID,
    data: ProjectCreate,
    user: dict = Depends(get_current_user),
):
    body = data.model_dump()
    rows = await db_request(
        "PATCH",
        user,
        params={
            "id": f"eq.{project_id}",
            "user_id": f"eq.{user['id']}",
            "select": "*",
        },
        body=body,
    )

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return rows[0]


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    user: dict = Depends(get_current_user),
):
    body = data.model_dump(exclude_unset=True)

    if not body:
        raise HTTPException(
            status_code=422,
            detail="Provide at least one field to update",
        )

    rows = await db_request(
        "PATCH",
        user,
        params={
            "id": f"eq.{project_id}",
            "user_id": f"eq.{user['id']}",
            "select": "*",
        },
        body=body,
    )

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return rows[0]


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    user: dict = Depends(get_current_user),
):
    rows = await db_request(
        "DELETE",
        user,
        params={
            "id": f"eq.{project_id}",
            "user_id": f"eq.{user['id']}",
            "select": "*",
        },
    )

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)