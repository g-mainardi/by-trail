# by-trail

## Setup and Run

1. Set up Docker secrets for MongoDB URI by creating a file named `mongo_atlas_uri.txt` in a directory named `secrets/` with the following content:

    ```text
   mongodb+srv://<username>:<password>@cluster0.s5pavkk.mongodb.net/by_trail?appName=Cluster0    
   ```

2. Copy `.env.example`, rename it to `.env` and modify it as needed, or else default values will be used.

3. Start the application using Docker Compose:

    ```bash
    docker compose up -d
    ```

4. Access:
   - Local Database structure at [http://localhost:8081](http://localhost:8081).
   - Main Application at the port you have specified (default is '5751') [http://localhost:5173](http://localhost:5173).

5. To stop the services, run:

    ```bash
    docker compose down
    ```
