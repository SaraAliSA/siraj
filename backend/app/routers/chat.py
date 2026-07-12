import uuid
import json
import asyncio
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.chat import ChatSession, ChatMessage
from backend.app.schemas.chat import ChatSessionCreate, ChatSessionResponse, ChatMessageCreate, ChatMessageResponse
from backend.app.services.auth_service import get_current_user

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    session_in: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    title = session_in.title or "محادثة جديدة"
    new_session = ChatSession(
        user_id=current_user.id,
        title=title,
        context_snapshot={}
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session

@router.get("/sessions", response_model=List[ChatSessionResponse])
async def list_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    return result.scalars().all()

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
async def get_chat_history(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify session belongs to user
    session_result = await db.execute(
        select(ChatSession).where(
            and_(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        )
    )
    session = session_result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="جلسة المحادثة غير موجودة"
        )
        
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    return result.scalars().all()

@router.post("/sessions/{session_id}/messages")
async def send_message_stream(
    session_id: uuid.UUID,
    message_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify session belongs to user
    session_result = await db.execute(
        select(ChatSession).where(
            and_(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        )
    )
    session = session_result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="جلسة المحادثة غير موجودة"
        )
        
    # Save user message
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=message_in.content,
        tool_metadata={}
    )
    db.add(user_msg)
    await db.commit()
    
    # Simple rule-based mock responses in Saudi dialect
    user_text = message_in.content.lower()
    
    if "تمويل" in user_text:
        ai_text = (
            "أهلاً بك! لقد لاحظت استفسارك عن التمويل. بناءً على تحليلي لملفك المالي، "
            "يتوفر لدينا عدة خيارات للتمويل الإسلامي متوافقة مع أحكام الشريعة مثل التمويل الشخصي وتمويل السيارات بنسب أرباح تنافسية. "
            "هل تود أن أساعدك في تقديم طلب للتمويل الشخصي أم تريد استعراض حاسبة السداد؟"
        )
    elif "استثمار" in user_text or "سهم" in user_text or "صك" in user_text:
        ai_text = (
            "أهلاً بك! بالنظر إلى السوق حالياً، هناك صكوك الإنماء العقارية وهي ممتازة للمخاطر المنخفضة "
            "بعائد سنوي 6.25٪. كما يوجد صندوق الأسهم الواعدة إذا كنت تفضل العوائد الأعلى مع تقبل مخاطر السوق. "
            "بماذا تفضل البدء؟"
        )
    elif "ادخار" in user_text or "أوفر" in user_text or "هدف" in user_text:
        ai_text = (
            "أهلاً بك! للبدء في الادخار بشكل ذكي، أنصحك بإنشاء خطة ادخار مخصصة (مثل خطة طوارئ أو عمرة). "
            "يمكننا تخصيص جزء من راتبك تلقائياً شهرياً لنساعدك على تحقيق هدفك بدون أي مشقة. "
            "ما هو الهدف المالي الذي تود التخطيط له اليوم؟"
        )
    else:
        ai_text = (
            f"مرحباً بك يا {current_user.full_name}! أنا سراج، مستشارك المالي الذكي. "
            "لقد استلمت رسالتك: '" + message_in.content + "'. "
            "أنا هنا لمساعدتك في تحليل معاملاتك ومراقبة ميزانيتك وتقديم نصائح مالية مخصصة. "
            "كيف يمكنني دعمك اليوم؟"
        )
        
    # Save assistant message immediately to DB (mocking agent persistence)
    assistant_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=ai_text,
        tool_metadata={}
    )
    db.add(assistant_msg)
    await db.commit()
    
    # We will stream this response word-by-word
    words = ai_text.split(" ")
    
    async def event_generator():
        # First send message metadata (optional but nice for frontend UI)
        meta = {
            "session_id": str(session.id),
            "message_id": str(assistant_msg.id),
            "role": "assistant"
        }
        yield f"data: {json.dumps({'meta': meta})}\n\n"
        await asyncio.sleep(0.1)
        
        # Stream the words
        current_stream = ""
        for i, word in enumerate(words):
            current_stream += (word + " ")
            chunk = {
                "content": word + (" " if i < len(words) - 1 else ""),
                "done": i == len(words) - 1
            }
            yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
            await asyncio.sleep(0.08)  # simulate typing speed

    return StreamingResponse(event_generator(), media_type="text/event-stream")
