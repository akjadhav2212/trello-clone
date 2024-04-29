# Api Documentation
# User Routes

## User Sign Up
- **POST /signup**  
  Description: Register a new user.
  Body Parameters:
    - name (string, required): The name of the user.
    - email (string, required): The email address of the user.
    - password (string, required): The password for the user account (min 6 characters).
    - confirmPassword (string, required): Confirmation of the password (min 6 characters).
  Response:
    - token (string): JWT token for authenticated access.

## User Sign In
- **POST /signin**  
  Description: Authenticate a user.
  Body Parameters:
    - email (string, required): The email address of the user.
    - password (string, required): The password for the user account.
  Response:
    - token (string): JWT token for authenticated access.

## Update User Password
- **PUT /updatePassword**  
  Description: Update user password.
  Body Parameters:
    - currentPassword (string, required): The current password of the user.
    - password (string, required): The new password for the user account (min 6 characters).
    - confirmPassword (string, required): Confirmation of the new password (min 6 characters).
  Response:
    - message (string): Confirmation message indicating successful password update.


# Project Routes

## Get Projects
- **GET /project/**  
  Description: Retrieve all projects in which the authenticated user is a member.
  Middleware: authMiddleware

## Get Project by ID
- **GET /project/:id**  
  Description: Retrieve a specific project by ID if the authenticated user is a member.
  Middleware: authMiddleware

## Create Project
- **POST /project/**  
  Description: Create a new project.
  Middleware: authMiddleware
  Body Parameters:
    - name (string, required): The name of the project.
    - description (string): The description of the project.

## Update Project
- **PUT /project/:id**  
  Description: Update an existing project by ID if the authenticated user is a member.
  Middleware: authMiddleware
  Body Parameters:
    - name (string): The new name of the project.
    - description (string): The new description of the project.

## Update Project Members
- **PUT /project/members/:id**  
  Description: Add new members to an existing project if the authenticated user is a member.
  Middleware: authMiddleware
  Body Parameters:
    - members (array of strings, required): Array of user IDs to add as members.

## Delete Project
- **DELETE /project/:id**  
  Description: Delete a project by ID if the authenticated user is a member.
  Middleware: authMiddleware

# Task Routes

## Get Tasks by Assignee
- **GET /task/**  
  Description: Retrieve all tasks assigned to the authenticated user.
  Middleware: authMiddleware

## Get Tasks by Project ID
- **GET /task/:id**  
  Description: Retrieve all tasks associated with a specific project by project ID.
  Middleware: authMiddleware

## Create Task in Project
- **POST /task/**  
  Description: Create a new task within a project.
  Middleware: authMiddleware
  Body Parameters:
    - project (string, required): The ID of the project the task belongs to.
    - title (string, required): The title of the task.
    - description (string): The description of the task.
    - dueDate (string): The due date of the task (format: "YYYY-MM-DD").

## Update Task
- **PUT /task/**  
  Description: Update an existing task.
  Middleware: authMiddleware
  Body Parameters:
    - _id (string, required): The ID of the task to update.
    - projectId (string, required): The ID of the project the task belongs to.
    - title (string): The new title of the task.
    - description (string): The new description of the task.
    - dueDate (string): The new due date of the task (format: "YYYY-MM-DD").

## Update Task Status
- **PUT /task/updatestatus**  
  Description: Update the status of a task.
  Middleware: authMiddleware
  Body Parameters:
    - taskId (string, required): The ID of the task to update.
    - status (string, required): The new status of the task.

## Delete Task
- **DELETE /task/**  
  Description: Delete a task.
  Middleware: authMiddleware
  Body Parameters:
    - taskId (string, required): The ID of the task to delete.
    - projectId (string, required): The ID of the project the task belongs to.
