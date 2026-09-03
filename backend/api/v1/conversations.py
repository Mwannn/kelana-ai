from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.user import User
from models.conversation import Conversation, Message
from schemas.conversation_schema import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    ConversationDetailResponse,
    MessageCreate,
    MessageResponse
)
from services.chat_service import generate_chat_response, generate_conversation_title
from api.deps import get_current_user

router = APIRouter()

@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    payload: Optional[ConversationCreate] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Session 10 Part 3: Create a new conversation row and return its identifier.
    Returns 201 with conversation_id.
    """
    title = (payload.title.strip() if payload and payload.title else "Percakapan Baru")
    
    conversation = Conversation(
        user_id=current_user.id,
        title=title
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "conversation_id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at
    }


@router.get("", response_model=List[ConversationResponse])
@router.get("/", response_model=List[ConversationResponse])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Session 10 Part 3: List previous conversations for the authenticated user.
    """
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    return [
        {
            "id": conv.id,
            "conversation_id": conv.id,
            "title": conv.title,
            "created_at": conv.created_at
        }
        for conv in conversations
    ]


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation_detail(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Session 10 Part 7: Reload previous messages from DB for the selected conversation.
    """
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")
    if conv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return {
        "id": conv.id,
        "conversation_id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at,
        "messages": messages
    }


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(
    conversation_id: int,
    req: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Session 10 Part 4: Send Message API with end-to-end multi-turn orchestration:
    01 Receive User Message
    02 Save Message
    03 Load Previous Messages
    04 Build Prompt (Context)
    05 Amazon Bedrock Converse
    06 Save AI Response
    07 Return Response
    """
    content = req.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")
    if conv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to message this conversation")

    # Step 02: Save User Message
    user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=content
    )
    db.add(user_msg)

    # Auto-update conversation title if it's currently generic and this is first or early message
    existing_messages_count = db.query(Message).filter(Message.conversation_id == conversation_id).count()
    if existing_messages_count <= 1 and (conv.title in ["Percakapan Baru", "New Conversation"]):
        conv.title = generate_conversation_title(content)

    db.commit()

    # Step 03: Load all previous messages (including the newly added user message)
    all_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    history = [{"role": m.role, "content": m.content} for m in all_messages]

    # Step 04 & 05: Build context and call Amazon Bedrock
    ai_text = generate_chat_response(history)

    # Step 06: Save AI Response
    ai_msg = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=ai_text
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    # Step 07: Return Response
    return ai_msg


@router.patch("/{conversation_id}", response_model=ConversationResponse)
def rename_conversation(
    conversation_id: int,
    req: ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Session 10 Challenge Bonus: Rename conversations to something meaningful.
    """
    title = req.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")

    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")
    if conv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this conversation")

    conv.title = title
    db.commit()
    db.refresh(conv)

    return {
        "id": conv.id,
        "conversation_id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at
    }


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Remove a conversation and all cascading messages.
    """
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")
    if conv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this conversation")

    db.delete(conv)
    db.commit()
    return {"message": f"Conversation {conversation_id} deleted successfully"}
