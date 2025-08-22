# Next.js Frontend

This is the frontend of the Quasar chatbot application, built using Next.js and TypeScript.

## Features

- Responsive design with Tailwind CSS
- Chat interface for interacting with the chatbot
- API integration for authentication and chat functionality
- Modular components for scalability

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (preferred package manager)

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

### Build

To build the application for production:

```bash
npm run build
```

## Project Structure

- `app/`: Contains the Next.js app directory structure.
- `components/`: Reusable React components.
- `styles/`: Global and component-specific styles.
- `public/`: Static assets.

## Environment Variables

Create a `.env` file in the `frontend` directory and add the following variables:

```
BACKEND_API_URL=<backend_api_url>
NEXT_API_URL=<frontend_api_url>
```

## License

This project is licensed under the MIT License.
