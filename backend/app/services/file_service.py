"""
File management service for FinClick.AI
"""

from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import logging
import os
import shutil
from pathlib import Path

from app.models.financial import UploadedFile
from app.core.config import settings
from app.core.security import validate_file_type, validate_file_size, sanitize_filename, generate_secure_filename

logger = logging.getLogger(__name__)

class FileService:
    """File management service class"""
    
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(exist_ok=True)
    
    def upload_files(self, files: List[Any], user_id: int) -> Optional[List[Dict[str, Any]]]:
        """Upload files for processing"""
        try:
            uploaded_files = []
            
            for file in files:
                # Validate file
                if not self._validate_file(file):
                    continue
                
                # Generate secure filename
                secure_filename = generate_secure_filename(file.filename)
                file_path = self.upload_dir / secure_filename
                
                # Save file to disk
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                
                # Create database record
                db_file = UploadedFile(
                    user_id=user_id,
                    filename=secure_filename,
                    original_filename=file.filename,
                    file_path=str(file_path),
                    file_size=file.size if hasattr(file, 'size') else 0,
                    file_type=file.filename.split('.')[-1] if '.' in file.filename else 'unknown',
                    mime_type=file.content_type,
                    is_processed=False,
                    processing_status="pending"
                )
                
                self.db.add(db_file)
                self.db.commit()
                self.db.refresh(db_file)
                
                uploaded_files.append({
                    "id": db_file.id,
                    "filename": db_file.filename,
                    "original_filename": db_file.original_filename,
                    "file_size": db_file.file_size,
                    "file_type": db_file.file_type,
                    "status": db_file.processing_status
                })
                
                logger.info(f"Uploaded file {file.filename} for user {user_id}")
            
            return uploaded_files if uploaded_files else None
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error uploading files: {e}")
            return None
    
    def get_user_files(self, user_id: int, skip: int = 0, limit: int = 100) -> List[UploadedFile]:
        """Get user's uploaded files"""
        return self.db.query(UploadedFile).filter(
            UploadedFile.user_id == user_id
        ).offset(skip).limit(limit).all()
    
    def get_file(self, file_id: int, user_id: int) -> Optional[UploadedFile]:
        """Get specific file information"""
        return self.db.query(UploadedFile).filter(
            UploadedFile.id == file_id,
            UploadedFile.user_id == user_id
        ).first()
    
    def delete_file(self, file_id: int, user_id: int) -> bool:
        """Delete uploaded file"""
        try:
            file_info = self.get_file(file_id, user_id)
            if not file_info:
                return False
            
            # Delete file from disk
            file_path = Path(file_info.file_path)
            if file_path.exists():
                file_path.unlink()
            
            # Delete database record
            self.db.delete(file_info)
            self.db.commit()
            
            logger.info(f"Deleted file {file_id} for user {user_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting file {file_id}: {e}")
            return False
    
    def process_file(self, file_id: int, user_id: int) -> bool:
        """Process uploaded file (extract data)"""
        try:
            file_info = self.get_file(file_id, user_id)
            if not file_info:
                return False
            
            # Update status to processing
            file_info.processing_status = "processing"
            file_info.updated_at = datetime.utcnow()
            self.db.commit()
            
            # Start file processing (in a real app, this would be async)
            # For now, we'll just simulate the process
            success = self._extract_file_data(file_info)
            
            if success:
                file_info.is_processed = True
                file_info.processing_status = "completed"
            else:
                file_info.processing_status = "failed"
            
            file_info.updated_at = datetime.utcnow()
            self.db.commit()
            
            logger.info(f"Processed file {file_id} for user {user_id}")
            return success
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error processing file {file_id}: {e}")
            return False
    
    def get_file_status(self, file_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """Get file processing status"""
        file_info = self.get_file(file_id, user_id)
        if not file_info:
            return None
        
        return {
            "id": file_info.id,
            "filename": file_info.filename,
            "original_filename": file_info.original_filename,
            "is_processed": file_info.is_processed,
            "processing_status": file_info.processing_status,
            "file_size": file_info.file_size,
            "file_type": file_info.file_type,
            "created_at": file_info.created_at,
            "updated_at": file_info.updated_at
        }
    
    def get_file_data(self, file_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """Get extracted data from file"""
        file_info = self.get_file(file_id, user_id)
        if not file_info or not file_info.is_processed:
            return None
        
        # In a real application, this would retrieve actual extracted data
        # For now, we'll return mock data
        mock_data = {
            "file_id": file_id,
            "filename": file_info.original_filename,
            "extracted_data": {
                "balance_sheet": {
                    "assets": {"total": 1000000, "current": 500000, "fixed": 500000},
                    "liabilities": {"total": 400000, "current": 200000, "long_term": 200000},
                    "equity": {"total": 600000, "paid_in": 500000, "retained": 100000}
                },
                "income_statement": {
                    "revenue": 2000000,
                    "cost_of_goods": 1200000,
                    "gross_profit": 800000,
                    "operating_expenses": 400000,
                    "operating_income": 400000,
                    "net_income": 300000
                },
                "cash_flow": {
                    "operating_cash_flow": 350000,
                    "investing_cash_flow": -100000,
                    "financing_cash_flow": -200000,
                    "net_cash_flow": 50000
                }
            },
            "metadata": {
                "currency": "SAR",
                "reporting_period": "2024",
                "reporting_standard": "IFRS",
                "extraction_method": "OCR + NLP"
            }
        }
        
        return mock_data
    
    def reprocess_file(self, file_id: int, user_id: int) -> bool:
        """Reprocess file (extract data again)"""
        try:
            file_info = self.get_file(file_id, user_id)
            if not file_info:
                return False
            
            # Reset processing status
            file_info.is_processed = False
            file_info.processing_status = "pending"
            file_info.updated_at = datetime.utcnow()
            self.db.commit()
            
            # Start reprocessing
            success = self.process_file(file_id, user_id)
            
            logger.info(f"Reprocessed file {file_id} for user {user_id}")
            return success
            
        except Exception as e:
            logger.error(f"Error reprocessing file {file_id}: {e}")
            return False
    
    def _validate_file(self, file: Any) -> bool:
        """Validate uploaded file"""
        try:
            # Check file type
            if not validate_file_type(file.filename):
                logger.warning(f"Unsupported file type: {file.filename}")
                return False
            
            # Check file size
            if hasattr(file, 'size') and not validate_file_size(file.size):
                logger.warning(f"File too large: {file.filename}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating file {file.filename}: {e}")
            return False
    
    def _extract_file_data(self, file_info: UploadedFile) -> bool:
        """Extract data from file"""
        try:
            # In a real application, this would:
            # 1. Use OCR for scanned documents
            # 2. Parse Excel/Word files
            # 3. Extract financial data using NLP
            # 4. Store extracted data in database
            
            # For now, we'll just simulate successful extraction
            logger.info(f"Extracting data from file {file_info.filename}")
            
            # Simulate processing time
            import time
            time.sleep(1)
            
            return True
            
        except Exception as e:
            logger.error(f"Error extracting data from file {file_info.filename}: {e}")
            return False
    
    def cleanup_old_files(self, days_old: int = 30) -> int:
        """Clean up old uploaded files"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days_old)
            
            # Find old files
            old_files = self.db.query(UploadedFile).filter(
                UploadedFile.created_at < cutoff_date
            ).all()
            
            deleted_count = 0
            for file_info in old_files:
                try:
                    # Delete file from disk
                    file_path = Path(file_info.file_path)
                    if file_path.exists():
                        file_path.unlink()
                    
                    # Delete database record
                    self.db.delete(file_info)
                    deleted_count += 1
                    
                except Exception as e:
                    logger.error(f"Error deleting old file {file_info.filename}: {e}")
            
            self.db.commit()
            logger.info(f"Cleaned up {deleted_count} old files")
            return deleted_count
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error cleaning up old files: {e}")
            return 0
