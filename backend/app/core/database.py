"""
Database configuration and initialization
"""

from supabase import create_client, Client
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import asyncio
from typing import Optional
from .config import settings

# Supabase client
supabase: Optional[Client] = None

# MongoDB client
mongodb_client: Optional[AsyncIOMotorClient] = None
mongodb_db = None

async def init_supabase():
    """Initialize Supabase client"""
    global supabase
    try:
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY
        )
        print("✅ Supabase connected successfully")
        return supabase
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        return None

async def init_mongodb():
    """Initialize MongoDB client"""
    global mongodb_client, mongodb_db
    try:
        mongodb_client = AsyncIOMotorClient(settings.MONGODB_URI)
        mongodb_db = mongodb_client.finclick_ai
        print("✅ MongoDB connected successfully")
        return mongodb_db
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        return None

async def init_db():
    """Initialize all database connections"""
    print("🔄 Initializing database connections...")
    
    # Initialize Supabase
    await init_supabase()
    
    # Initialize MongoDB
    await init_mongodb()
    
    # Create indexes and collections if they don't exist
    if mongodb_db:
        await create_mongodb_indexes()
    
    print("✅ Database initialization completed")

async def create_mongodb_indexes():
    """Create necessary MongoDB indexes"""
    try:
        # Users collection
        await mongodb_db.users.create_index("email", unique=True)
        await mongodb_db.users.create_index("username", unique=True)
        
        # Analysis collection
        await mongodb_db.analyses.create_index("user_id")
        await mongodb_db.analyses.create_index("created_at")
        await mongodb_db.analyses.create_index("analysis_type")
        
        # Documents collection
        await mongodb_db.documents.create_index("user_id")
        await mongodb_db.documents.create_index("created_at")
        await mongodb_db.documents.create_index("file_type")
        
        # Subscriptions collection
        await mongodb_db.subscriptions.create_index("user_id", unique=True)
        await mongodb_db.subscriptions.create_index("status")
        
        # Payments collection
        await mongodb_db.payments.create_index("user_id")
        await mongodb_db.payments.create_index("created_at")
        await mongodb_db.payments.create_index("status")
        
        print("✅ MongoDB indexes created successfully")
    except Exception as e:
        print(f"❌ Failed to create MongoDB indexes: {e}")

def get_supabase() -> Client:
    """Get Supabase client"""
    if not supabase:
        raise RuntimeError("Supabase not initialized")
    return supabase

def get_mongodb():
    """Get MongoDB database"""
    if not mongodb_db:
        raise RuntimeError("MongoDB not initialized")
    return mongodb_db

async def close_db():
    """Close database connections"""
    global mongodb_client
    
    if mongodb_client:
        mongodb_client.close()
        print("✅ MongoDB connection closed")

# Database models for Supabase
class SupabaseTables:
    """Supabase table names"""
    USERS = "users"
    PROFILES = "profiles"
    SUBSCRIPTIONS = "subscriptions"
    PAYMENTS = "payments"
    ANALYSES = "analyses"
    DOCUMENTS = "documents"
    ANALYSIS_TYPES = "analysis_types"
    FINANCIAL_DATA = "financial_data"

# MongoDB collections
class MongoDBCollections:
    """MongoDB collection names"""
    USERS = "users"
    ANALYSES = "analyses"
    DOCUMENTS = "documents"
    SUBSCRIPTIONS = "subscriptions"
    PAYMENTS = "payments"
    ANALYSIS_RESULTS = "analysis_results"
    FINANCIAL_MODELS = "financial_models"
    AI_MODELS = "ai_models"
    CACHE = "cache"
    LOGS = "logs"

# Database utilities
class DatabaseUtils:
    """Database utility functions"""
    
    @staticmethod
    async def health_check():
        """Check database health"""
        health_status = {
            "supabase": False,
            "mongodb": False,
            "overall": False
        }
        
        try:
            # Check Supabase
            if supabase:
                # Try a simple query
                result = supabase.table("profiles").select("id").limit(1).execute()
                health_status["supabase"] = True
        except Exception as e:
            print(f"Supabase health check failed: {e}")
        
        try:
            # Check MongoDB
            if mongodb_db:
                # Try a simple query
                await mongodb_db.command("ping")
                health_status["mongodb"] = True
        except Exception as e:
            print(f"MongoDB health check failed: {e}")
        
        # Overall health
        health_status["overall"] = health_status["supabase"] and health_status["mongodb"]
        
        return health_status
    
    @staticmethod
    async def get_database_stats():
        """Get database statistics"""
        stats = {
            "mongodb": {},
            "supabase": {}
        }
        
        try:
            if mongodb_db:
                # Get collection stats
                collections = await mongodb_db.list_collection_names()
                for collection in collections:
                    count = await mongodb_db[collection].count_documents({})
                    stats["mongodb"][collection] = count
        except Exception as e:
            print(f"Failed to get MongoDB stats: {e}")
        
        try:
            if supabase:
                # Get table row counts (this is a simplified approach)
                stats["supabase"]["status"] = "connected"
        except Exception as e:
            print(f"Failed to get Supabase stats: {e}")
        
        return stats
