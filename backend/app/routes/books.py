from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate, BookResponse

router = APIRouter(prefix="/api/v1/books", tags=["Books"])


@router.get("", response_model=List[BookResponse], status_code=status.HTTP_200_OK)
def list_books(
    search: Optional[str] = Query(None, description="Search term for title or author"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=100, description="Max books to return"),
    db: Session = Depends(get_db),
):
    """Retrieve all books with optional search filtering and pagination."""
    query = db.query(Book)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Book.title.ilike(search_filter),
                Book.author.ilike(search_filter),
                Book.isbn.ilike(search_filter),
            )
        )
    if genre:
        query = query.filter(Book.genre.ilike(genre))

    return query.order_by(Book.id.desc()).offset(skip).limit(limit).all()


@router.get("/{book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def get_book(book_id: int, db: Session = Depends(get_db)):
    """Fetch details of a single book by ID."""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ID {book_id} not found",
        )
    return book


@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_in: BookCreate, db: Session = Depends(get_db)):
    """Add a new book to the catalog."""
    existing_book = db.query(Book).filter(Book.isbn == book_in.isbn).first()
    if existing_book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Book with ISBN '{book_in.isbn}' already exists",
        )

    book = Book(**book_in.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/{book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def update_book(book_id: int, book_in: BookUpdate, db: Session = Depends(get_db)):
    """Update details of an existing book."""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ID {book_id} not found",
        )

    update_data = book_in.model_dump(exclude_unset=True)
    if "isbn" in update_data and update_data["isbn"] != book.isbn:
        conflict = (
            db.query(Book)
            .filter(Book.isbn == update_data["isbn"], Book.id != book_id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Book with ISBN '{update_data['isbn']}' already exists",
            )

    for field, value in update_data.items():
        setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book from the catalog."""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with ID {book_id} not found",
        )

    db.delete(book)
    db.commit()
    return {"message": f"Book with ID {book_id} successfully deleted", "id": book_id}
