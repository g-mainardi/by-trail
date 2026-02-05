# by-trail

## Setup and Run

1. Setup secrets files by creating a directory named `secrets/` in the project root and adding the following files:
   - (to run with remote DB) `mongo_atlas_uri.txt` for MongoDB Atlas with a valid URI connection string:

     ```text
     mongodb+srv://<username>:<password>@cluster0.s5pavkk.mongodb.net/by_trail?appName=Cluster0
     ```

   - `jwt_secret.txt` for JWT with a strong secret key:

     ```text
     your_strong_jwt_secret_key_here
     ```

   - `thunderforest_map_key.txt` for Thunderforest Map with a valid API key:

     ```text
     your_thunderforest_map_api_key_here
     ```

2. Copy `.env.example`, rename it to `.env` and modify it as needed, or else default values will be used.

3. Start the application using Docker Compose:
   - Remote (with `USE_ATLAS=true`)

     ```bash
     docker compose up -d
     ```

   - Local (with `USE_ATLAS=false`)

     ```bash
     docker compose --profile local-db up -d
     ```

4. Access:
   - Local Database structure at [http://localhost:8081](http://localhost:8081).
   - Main Application at the port you have specified (default is '5173') [http://localhost:5173](http://localhost:5173).

5. To stop services and delete volumes, run:
   - Remote (with `USE_ATLAS=true`)

     ```bash
     docker compose down -v
     ```

   - Local (with `USE_ATLAS=false`)

     ```bash
     docker compose --profile local-db down -v
     ```

## Database Inizialization

This project uses a seeding script to populate the database with initial users and bivaccos. The script automatically detects whether to use Local MongoDB or MongoDB Atlas based on your `.env` configuration.

- Ensure your Docker containers are running

- Run the seeding script inside the server container:

  ```bash
  docker exec -it by-trail-server npx tsx seed.ts
  ```

## Production Deployment

For production deployment, you can use the provide `docker-compose.prod.yml` file. This setup uses MongoDB Atlas for the database and serves the client application using Nginx.

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Commit Message Linting

This project uses Commitlint to enforce conventional commit messages. Make sure to follow the commit message guidelines when making changes.

To enable commit message linting, use `npm install` to install the necessary dependencies.

Husky is set up to run Commitlint on each commit message. If your commit message does not follow the specified format, the commit will be rejected, the guidelines are as follows.

### Commit Message Format

```bash
<type>(<scope>): <description>
```

### Allowed Types

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `chore` - Maintenance tasks
- `test` - Adding or updating tests

### Allowed Scopes (optional)

- `client` - Client-side changes
- `server` - Server-side changes
- `repo` - Repository configuration
- `api` - API changes
- `ui` - User interface changes

### Rules

- Type must be lowercase and cannot be empty
- Description must not be empty
- If a scope is provided, it must be one of the allowed scopes

### Examples

```bash
feat(client): add user authentication
fix(api): resolve token expiration issue
docs: update README setup instructions
refactor(server): optimize database queries
chore(repo): update dependencies
test(ui): add unit tests for login component
```
