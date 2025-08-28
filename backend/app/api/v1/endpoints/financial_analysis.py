"""
Financial analysis endpoints for FinClick.AI
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Any, List
import logging

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.financial import (
    FinancialAnalysisCreate, 
    FinancialAnalysisResponse, 
    AnalysisResult,
    FileUploadResponse
)
from app.services.financial_analysis_service import FinancialAnalysisService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=FinancialAnalysisResponse)
async def create_financial_analysis(
    analysis_data: FinancialAnalysisCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new financial analysis
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        analysis = analysis_service.create_analysis(analysis_data, current_user.id)
        
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create analysis"
            )
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error creating analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/", response_model=List[FinancialAnalysisResponse])
async def get_user_analyses(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get user's financial analyses
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        analyses = analysis_service.get_user_analyses(current_user.id, skip, limit)
        return analyses
        
    except Exception as e:
        logger.error(f"Error getting analyses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{analysis_id}", response_model=FinancialAnalysisResponse)
async def get_analysis(
    analysis_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get specific financial analysis
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        analysis = analysis_service.get_analysis(analysis_id, current_user.id)
        
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analysis {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/{analysis_id}/start")
async def start_analysis(
    analysis_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Start financial analysis processing
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        success = analysis_service.start_analysis(analysis_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to start analysis"
            )
        
        return {"message": "Analysis started successfully", "analysis_id": analysis_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting analysis {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{analysis_id}/status")
async def get_analysis_status(
    analysis_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get analysis processing status
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        status_info = analysis_service.get_analysis_status(analysis_id, current_user.id)
        
        if not status_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        
        return status_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analysis status {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{analysis_id}/results", response_model=AnalysisResult)
async def get_analysis_results(
    analysis_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get analysis results
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        results = analysis_service.get_analysis_results(analysis_id, current_user.id)
        
        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis results not found"
            )
        
        return results
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analysis results {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/{analysis_id}/upload")
async def upload_analysis_files(
    analysis_id: int,
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Upload files for analysis
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        uploaded_files = analysis_service.upload_files(analysis_id, files, current_user.id)
        
        if not uploaded_files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to upload files"
            )
        
        return {"message": "Files uploaded successfully", "files": uploaded_files}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading files for analysis {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{analysis_id}/files", response_model=List[FileUploadResponse])
async def get_analysis_files(
    analysis_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get files uploaded for analysis
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        files = analysis_service.get_analysis_files(analysis_id, current_user.id)
        return files
        
    except Exception as e:
        logger.error(f"Error getting analysis files {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delete financial analysis
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        success = analysis_service.delete_analysis(analysis_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        
        return {"message": "Analysis deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting analysis {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/{analysis_id}/export")
async def export_analysis(
    analysis_id: int,
    format: str = "pdf",  # pdf, word, excel, powerpoint
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Export analysis results
    """
    try:
        analysis_service = FinancialAnalysisService(db)
        export_result = analysis_service.export_analysis(analysis_id, format, current_user.id)
        
        if not export_result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to export analysis"
            )
        
        return export_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting analysis {analysis_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/types/list")
async def get_analysis_types() -> Any:
    """
    Get list of available analysis types
    """
    from app.schemas.financial import AnalysisType, AnalysisLevel, Sector, LegalEntity, ComparisonLevel
    
    return {
        "analysis_types": [t.value for t in AnalysisType],
        "analysis_levels": [l.value for l in AnalysisLevel],
        "sectors": [s.value for s in Sector],
        "legal_entities": [l.value for l in LegalEntity],
        "comparison_levels": [c.value for c in ComparisonLevel]
    }
