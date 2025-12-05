# by-trail

## Setup and Run

1. Set up Docker secret for MongoDB URI by creating a file named `mongo_atlas_uri.txt` in a directory named `secrets/` with the following content:

    ```text
   mongodb+srv://<username>:<password>@cluster0.s5pavkk.mongodb.net/by_trail?appName=Cluster0    
   ```

2. Set up Docker secret for JWT secret by creating a file named `jwt_secret.txt` in the same `secrets/` directory with a strong secret key:

    ```text
   your_strong_jwt_secret_key_here
   ```

3. Copy `.env.example`, rename it to `.env` and modify it as needed, or else default values will be used.

4. Start the application using Docker Compose:

    ```bash
    docker compose up -d
    ```

5. Access:
   - Local Database structure at [http://localhost:8081](http://localhost:8081).
   - Main Application at the port you have specified (default is '5173') [http://localhost:5173](http://localhost:5173).

6. To stop the services, run:

    ```bash
    docker compose down
    ```
