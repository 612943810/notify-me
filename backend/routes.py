from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

# Simple data models
class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None

# In-memory storage for demo purposes
# In a real app, you'd use a database
items_db = []
next_id = 1

@router.get("/items", response_model=List[Item])
def get_items():
    """Get all items"""
    return items_db

@router.post("/items", response_model=Item)
def create_item(item: ItemCreate):
    """Create a new item"""
    global next_id
    new_item = Item(
        id=next_id,
        name=item.name,
        description=item.description,
        created_at=datetime.now()
    )
    items_db.append(new_item)
    next_id += 1
    return new_item

@router.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    """Get a specific item by ID"""
    for item in items_db:
        if item.id == item_id:
            return item
    return {"error": "Item not found"}

@router.delete("/items/{item_id}")
def delete_item(item_id: int):
    """Delete an item by ID"""
    global items_db
    items_db = [item for item in items_db if item.id != item_id]
    return {"message": "Item deleted"}