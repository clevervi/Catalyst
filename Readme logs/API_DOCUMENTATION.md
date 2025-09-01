# API Documentation

This document provides a detailed description of the API endpoints for the Catalyst HR System.

## Authentication

All protected routes require a valid JWT token to be included in the `Authorization` header as a Bearer token.

`Authorization: Bearer <token>`

## Endpoints

### Authentication

*   **POST /api/auth/register**

    *   **Description:** Registers a new user.
    *   **Request Body:**
        *   `email` (string, required): The user's email address.
        *   `password` (string, required): The user's password (min. 8 characters).
        *   `firstName` (string, required): The user's first name.
        *   `lastName` (string, required): The user's last name.
    *   **Response:**
        *   `message` (string): A success message.
        *   `user` (object): The user's data.
        *   `token` (string): The JWT token.

*   **POST /api/auth/login**

    *   **Description:** Logs in a user.
    *   **Request Body:**
        *   `email` (string, required): The user's email address.
        *   `password` (string, required): The user's password.
    *   **Response:**
        *   `message` (string): A success message.
        *   `user` (object): The user's data.
        *   `token` (string): The JWT token.

*   **GET /api/auth/me**

    *   **Description:** Gets the current user's profile.
    *   **Authentication:** Required.
    *   **Response:**
        *   `user` (object): The user's data.

### Jobs

*   **GET /api/jobs**

    *   **Description:** Gets a list of jobs.
    *   **Query Parameters:**
        *   `limit` (integer, optional): The maximum number of jobs to return (default: 20).
        *   `offset` (integer, optional): The number of jobs to skip (default: 0).
        *   `category` (string, optional): The job category.
        *   `location` (string, optional): The job location.
        *   `work_mode` (string, optional): The work mode (on-site, remote, hybrid).
        *   `experience_level` (string, optional): The experience level (entry-level, mid-level, senior-level).
        *   `work_type` (string, optional): The work type (full-time, part-time, contract, internship).
        *   `search` (string, optional): A search term to filter jobs by.
        *   `featured` (boolean, optional): Whether to return only featured jobs.
    *   **Response:**
        *   `jobs` (array): A list of jobs.
        *   `total` (integer): The total number of jobs.
        *   `limit` (integer): The limit used for pagination.
        *   `offset` (integer): The offset used for pagination.

*   **GET /api/jobs/:identifier**

    *   **Description:** Gets a single job by ID or slug.
    *   **Response:**
        *   `job` (object): The job data.

*   **POST /api/jobs**

    *   **Description:** Creates a new job.
    *   **Authentication:** Required.
    *   **Roles:** `administrator`, `talent_human_team`, `hiring_manager`.
    *   **Request Body:**
        *   `companyId` (integer, required): The company ID.
        *   `categoryId` (integer, required): The category ID.
        *   `title` (string, required): The job title.
        *   `description` (string, required): The job description.
        *   `requirements` (string, required): The job requirements.
        *   `workType` (string, required): The work type (full-time, part-time, contract, internship).
        *   `workMode` (string, required): The work mode (on-site, remote, hybrid).
        *   `experienceLevel` (string, required): The experience level (entry-level, mid-level, senior-level).
        *   `location` (string, required): The job location.
    *   **Response:**
        *   `message` (string): A success message.
        *   `jobId` (integer): The ID of the created job.

*   **POST /api/jobs/:jobId/apply**

    *   **Description:** Applies for a job.
    *   **Authentication:** Required.
    *   **Request Body:**
        *   `coverLetter` (string, required): The cover letter.
        *   `resume` (file, required): The resume file.
    *   **Response:**
        *   `message` (string): A success message.
        *   `applicationId` (integer): The ID of the created application.

### Courses

*   **GET /api/courses**

    *   **Description:** Gets a list of courses.
    *   **Query Parameters:**
        *   `limit` (integer, optional): The maximum number of courses to return (default: 20).
        *   `offset` (integer, optional): The number of courses to skip (default: 0).
    *   **Response:**
        *   `courses` (array): A list of courses.

*   **POST /api/courses/:courseId/enroll**

    *   **Description:** Enrolls in a course.
    *   **Authentication:** Required.
    *   **Response:**
        *   `message` (string): A success message.
        *   `enrollmentId` (integer): The ID of the created enrollment.

