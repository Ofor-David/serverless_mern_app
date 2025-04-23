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

## Folder Structure

- `src/`: Contains the source code.
- `dist/`: Contains the production build (generated after running `npm run build`).

## Contributing

Feel free to submit issues or pull requests to improve the frontend.

## Contact

For questions or feedback, please contact [davidoforincloud@gmail.com](mailto:davidoforincloud@gmail.com)
