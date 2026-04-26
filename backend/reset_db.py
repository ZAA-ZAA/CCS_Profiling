import argparse

from app import app
from models import db
from seeds import seed_demo_data

CONFIRM_PHRASE = "RESET"


def reset_database(seed: bool = True) -> None:
    """Drop all collections, recreate indexes, and optionally reseed demo data."""
    with app.app_context():
        db_name = app.config.get("MONGO_DB_NAME") or "default database from MONGO_URI"
        try:
            print(f"Resetting MongoDB database: {db_name}")
            db.drop_all()
            db.create_all()

            if seed:
                seed_demo_data()

            db.session.commit()

            if seed:
                print("MongoDB database reset and demo data seeded successfully.")
                print("Demo accounts (password: admin123):")
                print("- admin@example.com (DEAN)")
                print("- chair@example.com (CHAIR)")
                print("- faculty@example.com (FACULTY)")
                print("- secretary@example.com (SECRETARY)")
            else:
                print("MongoDB database reset successfully. No demo data was seeded.")
        except Exception as exc:
            db.session.rollback()
            print(f"Error resetting database: {exc}")
            print("Make sure MongoDB is running and the configured credentials are correct.")
            raise


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Drop all MongoDB collections and optionally reseed demo data."
    )
    parser.add_argument(
        "--confirm",
        required=True,
        help=f"Type {CONFIRM_PHRASE} to confirm the destructive reset.",
    )
    parser.add_argument(
        "--no-seed",
        action="store_true",
        help="Reset the database without seeding demo data afterward.",
    )
    args = parser.parse_args()

    if args.confirm != CONFIRM_PHRASE:
        parser.error(f'Confirmation phrase mismatch. Re-run with --confirm {CONFIRM_PHRASE}')

    reset_database(seed=not args.no_seed)


if __name__ == "__main__":
    main()
