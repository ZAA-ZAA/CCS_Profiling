from app import app
from models import db
from seeds import seed_demo_data


def init_database():
    """Initialize the database schema and demo data."""
    with app.app_context():
        try:
            db.create_all()
            seed_demo_data()
            db.session.commit()
            print("Database tables created successfully.")
            print("Demo account: admin@example.com / admin123")
            print("Demo records seeded for students, faculty, schedules, events, research, and instructions.")
        except Exception as exc:
            db.session.rollback()
            print(f"Error initializing database: {exc}")
            print("Make sure MySQL is running and the configured credentials are correct.")


if __name__ == '__main__':
    init_database()
