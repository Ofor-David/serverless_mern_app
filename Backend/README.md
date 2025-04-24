# Backend Setup

This contains information on the backend setup for this project. It is built using modern serverless architecture principles and is designed to be scalable, efficient, and easy to deploy.

## Features
- **Serverless Architecture**: Built using AWS Lambda and API Gateway.
- **Database**: Integrated with MongoDB for fast and scalable data storage.
- **Authentication**: Secure user authentication using JWT Tokens.
- **Logging and Monitoring**: Integrated with AWS CloudWatch for logs and metrics.


## Prerequisites
- Node.js (v18 or later)
- AWS CLI (v2 or later)
- An AWS account with permissions to deploy serverless applications
- MongoDB cluster

## Setup Instructions

1. **Install Dependencies**:
    ```bash
    npm install
    ```

2. **Configure AWS CLI**:
    ```bash
    aws configure
    ```
3. **Authenticate to serverless**
    ```bash
    serverless login
    ```

## Development Server

To start the development server, run:
```bash
npm run dev
```
your backend is deployed locally and you can call it using the url provided to you.

## Build for Production

Deploys your project to aws lambda, configures API gateway and launches an s3 bucket on aws
```bash
npm start
```
The Backend infrastructure is complete from here and you can now call your backend using the endpoint url provided to you after running `npm start`.

## Frontend Integration
- Take your url provided after deploying the api and plug it into the **API_URL** field in the frontend located at `/Frontend/src/tasksapp.tsx`

- Now run `npm run build` in the `/Frontend` directory to build the new frontend code.
- Upload the new contents of the `dist/` folder to your s3 bucket.

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task for the authenticated user
- `GET /api/tasks/:id` - Get an authenticated user's task by ID
- `PUT /api/tasks/:id` - Update an authenticated user's task by ID
- `DELETE /api/tasks/:id` - Delete an authenticated user's task by ID

### Users

- `POST /api/users/register` - Create a new user
- `POST /api/users/login` - Login as an existing user
- `GET /api/users/profile` - Get your user profile
- `DELETE /api/users/profile` - Delete your user

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## Contact

For questions or feedback, please contact [davidoforincloud@gmail.com](mailto:davidoforincloud@gmail.com)
