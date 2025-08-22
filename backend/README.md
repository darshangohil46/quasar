# Django Backend

This is the backend of the Quasar chatbot application, built using Python and Django.

## Features

- REST API for chat functionality
- User authentication and session management
- SQLite database for development
- Modular app structure

## Getting Started

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Development

To start the development server:

```bash
python manage.py runserver
```

### Database Migrations

To apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Project Structure

- `accounts/`: Handles user authentication.
- `chat/`: Contains chat-related functionality.
- `quasar/`: Project settings and configurations.

## Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```
GROQ_API_KEY=<your_groq_api_key>
GROQ_AI_MODEL=<your_groq_ai_model>
```

## License

This project is licensed under the MIT License.
