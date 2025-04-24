# Backend Setup

This document outlines the backend setup for this project. It follows modern serverless architecture principles and is designed to be scalable, efficient, and easy to deploy.

## Features
- **Serverless Architecture**: Built using AWS Lambda and API Gateway.
- **Database**: Integrated with MongoDB for fast and scalable data storage.
- **Authentication**: Secure user authentication using JWT Tokens.
- **Logging and Monitoring**: Integrated with AWS CloudWatch for logs and metrics.


## Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)(v2 or later)
- An AWS account with permissions to deploy serverless applications
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

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
4. **Configure environment variables**
    Make sure to modify the environment variables in the serverlesss.yaml file.

## Development Server

To start the development server locally, run:
```bash
npm run dev
```
Your backend will be deployed locally, and a local endpoint will be provided for testing.

## Build for Production

To deploy your project to AWS (Lambda, API Gateway, and S3), run:
```bash
npm start
```
After successful deployment, your backend will be accessible via the endpoint URL provided in the terminal output.

## Frontend Integration
- Copy the API endpoint URL returned after backend deployment.

- Open `/Frontend/src/taskapp.tsx` and replace the *API_URL* constant with your deployed backend URL.

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
