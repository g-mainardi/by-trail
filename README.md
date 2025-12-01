# by-trail

## Setup and Run

1. Set up Docker secrets for MongoDB URI by creating a file named `mongo_atlas_uri.txt` in a directory named `secrets/` with the following content:

    ```text
   mongodb+srv://<username>:<password>@cluster0.s5pavkk.mongodb.net/by_trail?appName=Cluster0    
   ```

2. Start MongoDB server and Express application using Docker Compose:

    ```bash
    docker compose up -d
    ```

3. Access:
   - Local Database structure at [http://localhost:8081](http://localhost:8081).
   - Main Application at [http://localhost:3000](http://localhost:3000).

4. To stop the services, run:

    ```bash
    docker compose down
    ```
