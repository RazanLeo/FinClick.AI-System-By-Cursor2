"""
Financial analysis service for FinClick.AI
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional, List, Dict, Any
from datetime import datetime
import logging
import json

from app.models.financial import FinancialAnalysis, UploadedFile, FinancialData
from app.schemas.financial import FinancialAnalysisCreate, AnalysisResult
from app.core.database import get_mongodb

logger = logging.getLogger(__name__)

class FinancialAnalysisService:
    """Financial analysis service class"""
    
    def __init__(self, db: Session):
        self.db = db
        self.mongodb = get_mongodb()
    
    def create_analysis(self, analysis_data: FinancialAnalysisCreate, user_id: int) -> Optional[FinancialAnalysis]:
        """Create new financial analysis"""
        try:
            # Create analysis for each type
            analyses = []
            for analysis_type in analysis_data.analysis_types:
                db_analysis = FinancialAnalysis(
                    user_id=user_id,
                    company_name=analysis_data.company_name,
                    sector=analysis_data.sector.value,
                    activity=analysis_data.activity,
                    legal_entity=analysis_data.legal_entity.value,
                    analysis_years=analysis_data.analysis_years,
                    comparison_level=analysis_data.comparison_level.value,
                    analysis_type=analysis_type,
                    analysis_level=analysis_data.analysis_level,
                    status="pending",
                    progress=0.0
                )
                
                self.db.add(db_analysis)
                analyses.append(db_analysis)
            
            self.db.commit()
            
            # Refresh all analyses
            for analysis in analyses:
                self.db.refresh(analysis)
            
            logger.info(f"Created {len(analyses)} analyses for user {user_id}")
            return analyses[0] if analyses else None
            
        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"Database integrity error while creating analysis: {e}")
            return None
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating analysis: {e}")
            return None
    
    def get_user_analyses(self, user_id: int, skip: int = 0, limit: int = 100) -> List[FinancialAnalysis]:
        """Get user's financial analyses"""
        return self.db.query(FinancialAnalysis).filter(
            FinancialAnalysis.user_id == user_id
        ).offset(skip).limit(limit).all()
    
    def get_analysis(self, analysis_id: int, user_id: int) -> Optional[FinancialAnalysis]:
        """Get specific financial analysis"""
        return self.db.query(FinancialAnalysis).filter(
            FinancialAnalysis.id == analysis_id,
            FinancialAnalysis.user_id == user_id
        ).first()
    
    def start_analysis(self, analysis_id: int, user_id: int) -> bool:
        """Start financial analysis processing"""
        try:
            analysis = self.get_analysis(analysis_id, user_id)
            if not analysis:
                return False
            
            # Update status to processing
            analysis.status = "processing"
            analysis.progress = 0.1
            analysis.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            # Start background processing (in a real app, this would be async)
            # For now, we'll just simulate the process
            logger.info(f"Started analysis {analysis_id} for user {user_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error starting analysis {analysis_id}: {e}")
            return False
    
    def get_analysis_status(self, analysis_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """Get analysis processing status"""
        analysis = self.get_analysis(analysis_id, user_id)
        if not analysis:
            return None
        
        return {
            "id": analysis.id,
            "status": analysis.status,
            "progress": analysis.progress,
            "created_at": analysis.created_at,
            "updated_at": analysis.updated_at
        }
    
    def get_analysis_results(self, analysis_id: int, user_id: int) -> Optional[AnalysisResult]:
        """Get analysis results"""
        analysis = self.get_analysis(analysis_id, user_id)
        if not analysis:
            return None
        
        # In a real application, this would retrieve actual analysis results
        # For now, we'll return a mock result
        mock_results = {
            "analysis_id": analysis_id,
            "analysis_type": analysis.analysis_type.value,
            "company_name": analysis.company_name,
            "results": {
                "summary": "تحليل مالي شامل للشركة",
                "key_metrics": {
                    "liquidity_ratio": 1.5,
                    "debt_ratio": 0.4,
                    "profitability": 0.15
                },
                "recommendations": [
                    "تحسين إدارة المخزون",
                    "زيادة رأس المال العامل",
                    "تحسين هيكل التكاليف"
                ]
            },
            "risk_assessment": {
                "overall_risk": "متوسط",
                "liquidity_risk": "منخفض",
                "solvency_risk": "متوسط",
                "profitability_risk": "منخفض"
            },
            "swot_analysis": {
                "strengths": ["مؤشرات سيولة جيدة", "هيكل ديون متوازن"],
                "weaknesses": ["معدل دوران مخزون منخفض", "تكاليف تشغيل عالية"],
                "opportunities": ["توسع في السوق", "تحسين الكفاءة"],
                "threats": ["منافسة شديدة", "تقلبات في أسعار المواد الخام"]
            },
            "charts_data": {
                "balance_sheet": {},
                "income_statement": {},
                "cash_flow": {}
            }
        }
        
        return AnalysisResult(
            analysis_id=analysis_id,
            analysis_type=analysis.analysis_type,
            results=mock_results["results"],
            recommendations=mock_results["results"]["recommendations"],
            risk_assessment=mock_results["risk_assessment"],
            swot_analysis=mock_results["swot_analysis"],
            charts_data=mock_results["charts_data"],
            created_at=datetime.utcnow()
        )
    
    def upload_files(self, analysis_id: int, files: List[Any], user_id: int) -> Optional[List[Dict[str, Any]]]:
        """Upload files for analysis"""
        try:
            analysis = self.get_analysis(analysis_id, user_id)
            if not analysis:
                return None
            
            uploaded_files = []
            for file in files:
                # In a real application, you would:
                # 1. Save the file to disk
                # 2. Extract file metadata
                # 3. Create database record
                
                db_file = UploadedFile(
                    user_id=user_id,
                    analysis_id=analysis_id,
                    filename=f"file_{len(uploaded_files) + 1}",
                    original_filename=file.filename,
                    file_path=f"/uploads/{file.filename}",
                    file_size=len(file.file.read()) if hasattr(file, 'file') else 0,
                    file_type=file.filename.split('.')[-1] if '.' in file.filename else 'unknown',
                    mime_type=file.content_type,
                    is_processed=False,
                    processing_status="pending"
                )
                
                self.db.add(db_file)
                uploaded_files.append({
                    "id": db_file.id,
                    "filename": db_file.filename,
                    "original_filename": db_file.original_filename,
                    "file_size": db_file.file_size,
                    "file_type": db_file.file_type,
                    "status": db_file.processing_status
                })
            
            self.db.commit()
            logger.info(f"Uploaded {len(uploaded_files)} files for analysis {analysis_id}")
            return uploaded_files
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error uploading files for analysis {analysis_id}: {e}")
            return None
    
    def get_analysis_files(self, analysis_id: int, user_id: int) -> List[UploadedFile]:
        """Get files uploaded for analysis"""
        return self.db.query(UploadedFile).filter(
            UploadedFile.analysis_id == analysis_id,
            UploadedFile.user_id == user_id
        ).all()
    
    def delete_analysis(self, analysis_id: int, user_id: int) -> bool:
        """Delete financial analysis"""
        try:
            analysis = self.get_analysis(analysis_id, user_id)
            if not analysis:
                return False
            
            # Delete associated files
            files = self.get_analysis_files(analysis_id, user_id)
            for file in files:
                self.db.delete(file)
            
            # Delete analysis
            self.db.delete(analysis)
            self.db.commit()
            
            logger.info(f"Deleted analysis {analysis_id} for user {user_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting analysis {analysis_id}: {e}")
            return False
    
    def export_analysis(self, analysis_id: int, format: str, user_id: int) -> Optional[Dict[str, Any]]:
        """Export analysis results"""
        try:
            analysis = self.get_analysis(analysis_id, user_id)
            if not analysis:
                return None
            
            # In a real application, this would generate actual export files
            # For now, we'll return mock export information
            
            export_info = {
                "analysis_id": analysis_id,
                "format": format,
                "filename": f"analysis_{analysis_id}_{format}",
                "download_url": f"/exports/analysis_{analysis_id}.{format}",
                "file_size": "2.5 MB",
                "generated_at": datetime.utcnow().isoformat()
            }
            
            logger.info(f"Exported analysis {analysis_id} in {format} format")
            return export_info
            
        except Exception as e:
            logger.error(f"Error exporting analysis {analysis_id}: {e}")
            return None
    
    def get_analysis_progress(self, analysis_id: int, user_id: int) -> Optional[float]:
        """Get analysis progress percentage"""
        analysis = self.get_analysis(analysis_id, user_id)
        if not analysis:
            return None
        
        return analysis.progress
    
    def update_analysis_progress(self, analysis_id: int, progress: float) -> bool:
        """Update analysis progress"""
        try:
            analysis = self.db.query(FinancialAnalysis).filter(
                FinancialAnalysis.id == analysis_id
            ).first()
            
            if not analysis:
                return False
            
            analysis.progress = min(progress, 1.0)
            analysis.updated_at = datetime.utcnow()
            
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating analysis progress {analysis_id}: {e}")
            return False
