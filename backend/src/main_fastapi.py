from contextlib import asynccontextmanager
from typing import Dict, Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for FastAPI application"""
    # Startup
    logger.info("Starting Personal Library Catalog API...")
    setup_routes()
    logger.info("Routes configured successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Personal Library Catalog API...")
    try:
        from database_async import close_db
        await close_db()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database: {e}")


app = FastAPI(
    title="ছোটপাতা পাঠাগার API",
    description="A comprehensive library management system with multilingual support",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoints
@app.get("/", tags=["Health"])
async def root() -> Dict[str, Any]:
    """Root endpoint for health check"""
    return {
        "message": "ছোটপাতা পাঠাগার API",
        "message_en": "Chotopata Pathagar API",
        "status": "running",
        "version": "2.0.0"
    }


@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "library-catalog-api",
        "version": "2.0.0"
    }


# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle 404 errors"""
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle 500 errors"""
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


def setup_routes() -> None:
    """Setup all API routes"""
    try:
        # Import routers
        from .routes.book_async import router as book_router
    except ImportError:
        from routes.book_async import router as book_router
    
    app.include_router(book_router, prefix="/api/books", tags=["Books"])
    
    try:
        from .routes.borrower_async import router as borrower_router
    except ImportError:
        from routes.borrower_async import router as borrower_router
    
    app.include_router(borrower_router, prefix="/api/borrowers", tags=["Borrowers"])
    
    try:
        from .routes.auth_async import router as auth_router
    except ImportError:
        from routes.auth_async import router as auth_router
    
    app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
    
    try:
        from .routes.lending_async import router as lending_router
    except ImportError:
        from routes.lending_async import router as lending_router
    
    app.include_router(lending_router, prefix="/api/lending", tags=["Lending"])
    
    try:
        from .routes.user_async import router as user_router
    except ImportError:
        from routes.user_async import router as user_router
    
    app.include_router(user_router, prefix="/api/users", tags=["Users"])
    
    try:
        from .routes.export import router as export_router
    except ImportError:
        from routes.export import router as export_router
    
    app.include_router(export_router, prefix="/api/export", tags=["Export"])


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    uvicorn.run(
        "main_fastapi:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info" if debug else "warning"
    )
