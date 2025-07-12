"""
Book-Tag association table
"""
from sqlalchemy import Table, Column, Integer, ForeignKey
from ..database_async import Base

# Many-to-Many relationship table between books and tags
book_tags = Table(
    'book_tags',
    Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)
