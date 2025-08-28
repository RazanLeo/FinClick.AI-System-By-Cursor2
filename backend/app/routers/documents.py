"""
FinClick.AI - Router لمعالجة المستندات
معالجة ذكية للمستندات (PDF, Excel, Word, صور)
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
import os
import uuid
from pathlib import Path

from ..core.security import get_current_user, get_current_active_user, check_subscription_status
from ..core.database import get_mongodb_client
from ..models.user import User
from ..processors.document_processor import DocumentProcessor

# إعداد التسجيل
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/documents", tags=["Document Processing"])

# إعداد معالج المستندات
document_processor = DocumentProcessor()

# أنواع الملفات المدعومة
SUPPORTED_FORMATS = {
    "pdf": ["application/pdf"],
    "excel": [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ],
    "word": [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ],
    "image": [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tiff"
    ]
}

# حجم الملف الأقصى (50MB)
MAX_FILE_SIZE = 50 * 1024 * 1024

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: Optional[str] = None,
    tags: Optional[List[str]] = None,
    current_user: User = Depends(get_current_active_user)
):
    """رفع مستند جديد"""
    try:
        # فحص الاشتراك
        subscription_status = await check_subscription_status(current_user.id)
        if not subscription_status["active"]:
            raise HTTPException(
                status_code=403, 
                detail="يجب أن يكون لديك اشتراك نشط لرفع المستندات"
            )
        
        # فحص حجم الملف
        if file.size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"حجم الملف يجب أن يكون أقل من {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # فحص نوع الملف
        if not _is_supported_format(file.content_type):
            raise HTTPException(
                status_code=400,
                detail=f"نوع الملف غير مدعوم. الأنواع المدعومة: {', '.join(SUPPORTED_FORMATS.keys())}"
            )
        
        # إنشاء معرف فريد للمستند
        document_id = str(uuid.uuid4())
        
        # تحديد نوع المستند تلقائياً إذا لم يتم تحديده
        if not document_type:
            document_type = _detect_document_type(file.content_type)
        
        # حفظ الملف في النظام
        file_path = await _save_uploaded_file(file, document_id)
        
        # معالجة المستند
        processing_result = await document_processor.process_document(
            file_path=file_path,
            document_type=document_type,
            user_id=current_user.id
        )
        
        # حفظ معلومات المستند في قاعدة البيانات
        document_info = await _save_document_info(
            document_id=document_id,
            user_id=current_user.id,
            filename=file.filename,
            document_type=document_type,
            file_path=file_path,
            file_size=file.size,
            content_type=file.content_type,
            tags=tags or [],
            processing_result=processing_result
        )
        
        return {
            "success": True,
            "message": "تم رفع المستند بنجاح",
            "document_id": document_id,
            "document_info": document_info,
            "processing_result": processing_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail="خطأ في رفع المستند")

@router.get("/", response_model=List[Dict[str, Any]])
async def get_user_documents(
    current_user: User = Depends(get_current_active_user),
    document_type: Optional[str] = Query(None, description="نوع المستند"),
    tags: Optional[List[str]] = Query(None, description="العلامات"),
    limit: int = Query(20, description="عدد المستندات"),
    offset: int = Query(0, description="الإزاحة")
):
    """الحصول على مستندات المستخدم"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        # بناء استعلام البحث
        query = {"user_id": current_user.id}
        
        if document_type:
            query["document_type"] = document_type
        
        if tags:
            query["tags"] = {"$in": tags}
        
        # تنفيذ الاستعلام
        cursor = collection.find(query).sort("uploaded_at", -1).skip(offset).limit(limit)
        documents = await cursor.to_list(length=limit)
        
        return documents
        
    except Exception as e:
        logger.error(f"Error getting user documents: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على المستندات")

@router.get("/{document_id}", response_model=Dict[str, Any])
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على مستند محدد"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        document = await collection.find_one({
            "document_id": document_id,
            "user_id": current_user.id
        })
        
        if not document:
            raise HTTPException(status_code=404, detail="المستند غير موجود")
        
        # إزالة _id من النتيجة
        document.pop("_id", None)
        return document
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting document: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على المستند")

@router.put("/{document_id}")
async def update_document(
    document_id: str,
    tags: List[str],
    description: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """تحديث معلومات المستند"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        update_data = {
            "tags": tags,
            "updated_at": datetime.now()
        }
        
        if description is not None:
            update_data["description"] = description
        
        result = await collection.update_one(
            {
                "document_id": document_id,
                "user_id": current_user.id
            },
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="المستند غير موجود")
        
        return {
            "success": True,
            "message": "تم تحديث المستند بنجاح",
            "document_id": document_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating document: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحديث المستند")

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """حذف مستند"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        # الحصول على معلومات المستند
        document = await collection.find_one({
            "document_id": document_id,
            "user_id": current_user.id
        })
        
        if not document:
            raise HTTPException(status_code=404, detail="المستند غير موجود")
        
        # حذف الملف من النظام
        file_path = document.get("file_path")
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        
        # حذف المستند من قاعدة البيانات
        result = await collection.delete_one({
            "document_id": document_id,
            "user_id": current_user.id
        })
        
        return {
            "success": True,
            "message": "تم حذف المستند بنجاح",
            "document_id": document_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail="خطأ في حذف المستند")

@router.post("/{document_id}/extract")
async def extract_document_content(
    document_id: str,
    extraction_type: str = Query(..., description="نوع الاستخراج: text, tables, images"),
    current_user: User = Depends(get_current_active_user)
):
    """استخراج محتوى من المستند"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        # الحصول على معلومات المستند
        document = await collection.find_one({
            "document_id": document_id,
            "user_id": current_user.id
        })
        
        if not document:
            raise HTTPException(status_code=404, detail="المستند غير موجود")
        
        file_path = document.get("file_path")
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="ملف المستند غير موجود")
        
        # استخراج المحتوى
        if extraction_type == "text":
            content = await document_processor.extract_text(file_path, document["document_type"])
        elif extraction_type == "tables":
            content = await document_processor.extract_tables(file_path, document["document_type"])
        elif extraction_type == "images":
            content = await document_processor.extract_images(file_path, document["document_type"])
        else:
            raise HTTPException(
                status_code=400,
                detail="نوع الاستخراج غير صحيح. الأنواع المدعومة: text, tables, images"
            )
        
        # حفظ المحتوى المستخرج
        await collection.update_one(
            {"document_id": document_id},
            {
                "$set": {
                    f"extracted_content.{extraction_type}": content,
                    "last_extraction": datetime.now()
                }
            }
        )
        
        return {
            "success": True,
            "extraction_type": extraction_type,
            "content": content,
            "document_id": document_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting document content: {e}")
        raise HTTPException(status_code=500, detail="خطأ في استخراج محتوى المستند")

@router.post("/{document_id}/analyze")
async def analyze_document(
    document_id: str,
    analysis_types: List[str],
    current_user: User = Depends(get_current_active_user)
):
    """تحليل المستند باستخدام الذكاء الاصطناعي"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        # الحصول على معلومات المستند
        document = await collection.find_one({
            "document_id": document_id,
            "user_id": current_user.id
        })
        
        if not document:
            raise HTTPException(status_code=404, detail="المستند غير موجود")
        
        # فحص الاشتراك
        subscription_status = await check_subscription_status(current_user.id)
        if not subscription_status["active"]:
            raise HTTPException(
                status_code=403, 
                detail="يجب أن يكون لديك اشتراك نشط لتحليل المستندات"
            )
        
        # تحليل المستند
        analysis_result = await document_processor.analyze_document(
            document_id=document_id,
            document_type=document["document_type"],
            analysis_types=analysis_types,
            user_id=current_user.id
        )
        
        # حفظ نتيجة التحليل
        await collection.update_one(
            {"document_id": document_id},
            {
                "$set": {
                    "analysis_results": analysis_result,
                    "last_analysis": datetime.now()
                }
            }
        )
        
        return {
            "success": True,
            "analysis_result": analysis_result,
            "document_id": document_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing document: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحليل المستند")

@router.get("/{document_id}/download")
async def download_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """تحميل المستند"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        # الحصول على معلومات المستند
        document = await collection.find_one({
            "document_id": document_id,
            "user_id": current_user.id
        })
        
        if not document:
            raise HTTPException(status_code=404, detail="المستند غير موجود")
        
        file_path = document.get("file_path")
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="ملف المستند غير موجود")
        
        # قراءة الملف
        with open(file_path, "rb") as file:
            content = file.read()
        
        # إرجاع الملف للتحميل
        from fastapi.responses import Response
        
        return Response(
            content=content,
            media_type=document["content_type"],
            headers={
                "Content-Disposition": f"attachment; filename={document['filename']}"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading document: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحميل المستند")

@router.get("/stats/summary")
async def get_documents_summary(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على ملخص إحصائيات المستندات"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        # إحصائيات عامة
        total_documents = await collection.count_documents({"user_id": current_user.id})
        
        # إحصائيات حسب النوع
        type_stats = await collection.aggregate([
            {"$match": {"user_id": current_user.id}},
            {"$group": {"_id": "$document_type", "count": {"$sum": 1}}}
        ]).to_list(length=None)
        
        # إحصائيات حسب الحجم
        size_stats = await collection.aggregate([
            {"$match": {"user_id": current_user.id}},
            {"$group": {
                "_id": None,
                "total_size": {"$sum": "$file_size"},
                "avg_size": {"$avg": "$file_size"},
                "min_size": {"$min": "$file_size"},
                "max_size": {"$max": "$file_size"}
            }}
        ]).to_list(length=None)
        
        # إحصائيات الشهر الحالي
        current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_uploads = await collection.count_documents({
            "user_id": current_user.id,
            "uploaded_at": {"$gte": current_month}
        })
        
        return {
            "success": True,
            "total_documents": total_documents,
            "type_distribution": {item["_id"]: item["count"] for item in type_stats},
            "size_statistics": size_stats[0] if size_stats else {},
            "monthly_uploads": monthly_uploads,
            "current_month": current_month.strftime("%Y-%m")
        }
        
    except Exception as e:
        logger.error(f"Error getting documents summary: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على ملخص المستندات")

# الدوال المساعدة
def _is_supported_format(content_type: str) -> bool:
    """التحقق من أن نوع الملف مدعوم"""
    for formats in SUPPORTED_FORMATS.values():
        if content_type in formats:
            return True
    return False

def _detect_document_type(content_type: str) -> str:
    """تحديد نوع المستند تلقائياً"""
    for doc_type, formats in SUPPORTED_FORMATS.items():
        if content_type in formats:
            return doc_type
    return "unknown"

async def _save_uploaded_file(file: UploadFile, document_id: str) -> str:
    """حفظ الملف المرفوع في النظام"""
    try:
        # إنشاء مجلد المستندات إذا لم يكن موجوداً
        upload_dir = Path("uploads/documents")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # تحديد امتداد الملف
        file_extension = Path(file.filename).suffix if file.filename else ""
        if not file_extension:
            # تحديد الامتداد من نوع المحتوى
            if file.content_type in SUPPORTED_FORMATS["pdf"]:
                file_extension = ".pdf"
            elif file.content_type in SUPPORTED_FORMATS["excel"]:
                file_extension = ".xlsx"
            elif file.content_type in SUPPORTED_FORMATS["word"]:
                file_extension = ".docx"
            elif file.content_type in SUPPORTED_FORMATS["image"]:
                file_extension = ".jpg"
        
        # إنشاء اسم الملف
        filename = f"{document_id}{file_extension}"
        file_path = upload_dir / filename
        
        # حفظ الملف
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return str(file_path)
        
    except Exception as e:
        logger.error(f"Error saving uploaded file: {e}")
        raise HTTPException(status_code=500, detail="خطأ في حفظ الملف")

async def _save_document_info(
    document_id: str,
    user_id: str,
    filename: str,
    document_type: str,
    file_path: str,
    file_size: int,
    content_type: str,
    tags: List[str],
    processing_result: Dict[str, Any]
) -> Dict[str, Any]:
    """حفظ معلومات المستند في قاعدة البيانات"""
    try:
        db = await get_mongodb_client()
        collection = db.documents
        
        document_info = {
            "document_id": document_id,
            "user_id": user_id,
            "filename": filename,
            "document_type": document_type,
            "file_path": file_path,
            "file_size": file_size,
            "content_type": content_type,
            "tags": tags,
            "processing_result": processing_result,
            "uploaded_at": datetime.now(),
            "updated_at": datetime.now(),
            "status": "processed"
        }
        
        result = await collection.insert_one(document_info)
        
        if result.inserted_id:
            document_info["_id"] = str(result.inserted_id)
            return document_info
        else:
            raise HTTPException(status_code=500, detail="خطأ في حفظ معلومات المستند")
            
    except Exception as e:
        logger.error(f"Error saving document info: {e}")
        raise HTTPException(status_code=500, detail="خطأ في حفظ معلومات المستند")
