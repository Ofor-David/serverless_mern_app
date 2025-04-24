# Frontend Setup

This document provides instructions to set up and run the frontend.

## Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)

## Installation && Configuration

1. Install dependencies:
    ```bash
    npm install
    ```

2. Ensure to change the `API_URL` const in the **taskapp.tsx** file located at **ln 4** in `src/taskpp.tsx` to the url of your backend.

## Development Server

To start the development server, run:
```bash
npm run dev
```

## Build for Production

To create a production build, run:
```bash
npm run build
```
The production-ready files will be in the `dist/` directory.

## Deploy frontend on AWS using IaC

To deploy the frontend on AWS using Infrastructure as Code (IaC), follow these steps:

### Prerequisites:
- Ensure the AWS CLI is installed and configured with the appropriate credentials:
    ```bash
    aws configure
    ```
- Ensure Terraform is installed, check out the [Installation guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)


1. Navigate to the `Terraform/` directory:
```bash
cd Terraform
```
2. Preview the infrastructure changes:
```bash
terraform plan
```
3. To deploy the infrastructure to aws, run:
```bash
terraform apply --auto-approve
```
4. Log in to your AWS Management Console, navigate to the S3 bucket you just provisioned, click *Upload*, then drag and drop all contents inside the `dist/` folder. Click *Upload* to confirm.
5. Navigate to your CloudFront distribution dashboard, Copy the distribution domain name and plug it in the *frontend_url* field in the **serverless.yaml** file located at `/Backend/serverless.yaml`

## Cost saving
⚠ Ensure to destroy your unused aws infrastructure!! 
run:
```bash
terraform destroy
```

## Contributing

Feel free to submit issues or pull requests to improve the frontend.

## Contact

For questions or feedback, please contact [davidoforincloud@gmail.com](mailto:davidoforincloud@gmail.com)
