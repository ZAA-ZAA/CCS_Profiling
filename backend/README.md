# Backend API

Flask backend for the CCS Comprehensive Profiling System.

## Setup

```bash
pip install -r requirements.txt
python init_db.py
python app.py
```

API URL: `http://localhost:5000`

## Environment Variables

Use [`backend/.env.example`](/c:/Users/zoen/Downloads/ITEW6/Test%201%20-%20Start/CCS-SYSTEM/backend/.env.example) as a reference.

Main database settings:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=itew6_user
MYSQL_PASSWORD=itew6_password
MYSQL_DATABASE=itew6_db
```

Optional local override:

```env
DATABASE_URL=sqlite:///ccs_system.db
```

## Seeded Demo Account

- Email: `admin@example.com`
- Password: `admin123`

## Main API Groups

- `/api/auth`
- `/api/students`
- `/api/faculty`
- `/api/schedules`
- `/api/reports`
- `/api/organizations`
- `/api/research`
- `/api/syllabus`
- `/api/curriculum`
- `/api/lessons`
- `/api/audit-logs`

## Student Query Support

`GET /api/students` supports:

- `search`
- `course`
- `year_level`
- `skill`
- `activity`
- `affiliation`

## Testing

```bash
python -m compileall .
python -m unittest discover -s tests
```
