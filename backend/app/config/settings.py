import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name = "My API"
    debug = True
    supabase_url = os.getenv("SUPABASE_URL")


settings = Settings()