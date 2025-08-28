"""
File management endpoints for FinClick.AI
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Any, List
import logging

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.financial import FileUploadResponse
from app.services.file_service import FileService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/upload", response_model=List[FileUploadResponse])
async def upload_files(
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Upload files for processing
    """
    try:
        file_service = FileService(db)
        uploaded_files = file_service.upload_files(files, current_user.id)
        
        if not uploaded_files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to upload files"
            )
        
        return uploaded_files
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading files: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/", response_model=List[FileUploadResponse])
async def get_user_files(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get user's uploaded files
    """
    try:
        file_service = FileService(db)
        files = file_service.get_user_files(current_user.id, skip, limit)
        return files
        
    except Exception as e:
        logger.error(f"Error getting user files: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{file_id}", response_model=FileUploadResponse)
async def get_file(
    file_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get specific file information
    """
    try:
        file_service = FileService(db)
        file_info = file_service.get_file(file_id, current_user.id)
        
        if not file_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        return file_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file {file_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delete uploaded file
    """
    try:
        file_service = FileService(db)
        success = file_service.delete_file(file_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        return {"message": "File deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file {file_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/{file_id}/process")
async def process_file(
    file_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Process uploaded file (extract data)
    """
    try:
        file_service = FileService(db)
        success = file_service.process_file(file_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to process file"
            )
        
        return {"message": "File processing started successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file {file_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{file_id}/status")
async def get_file_status(
    file_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get file processing status
    """
    try:
        file_service = FileService(db)
        status_info = file_service.get_file_status(file_id, current_user.id)
        
        if not status_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        return status_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file status {file_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{file_id}/data")
async def get_file_data(
    file_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get extracted data from file
    """
    try:
        file_service = FileService(db)
        data = file_service.get_file_data(file_id, current_user.id)
        
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File data not found"
            )
        
        return data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file data {file_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/{file_id}/reprocess")
async def reprocess_file(
    file_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Reprocess file (extract data again)
    """
    try:
        file_service = FileService(db)
        success = file_service.reprocess_file(file_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to reprocess file"
            )
        
        return {"message": "File reprocessing started successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reprocessing file {file_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/types/supported")
async def get_supported_file_types() -> Any:
    """
    Get supported file types
    """
    from app.core.config import settings
    
    return {
        "supported_types": settings.ALLOWED_FILE_TYPES,
        "max_file_size": settings.MAX_FILE_SIZE,
        "max_files": 10
    }
