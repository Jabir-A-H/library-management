# Import all schemas
from .book import *
from .borrower import *
from .category import *
from .tag import *
from .lending_record import *
from .user import *

__all__ = [
    # Book schemas
    "BookBase", "BookCreate", "BookUpdate", "BookResponse", 
    "BookListResponse", "BookAvailabilityResponse",
    
    # Borrower schemas
    "BorrowerBase", "BorrowerCreate", "BorrowerUpdate", 
    "BorrowerResponse", "BorrowerListResponse",
    
    # Category schemas
    "CategoryBase", "CategoryCreate", "CategoryUpdate", 
    "CategoryResponse", "CategoryListResponse",
    
    # Tag schemas
    "TagBase", "TagCreate", "TagUpdate", 
    "TagResponse", "TagListResponse",
    
    # Lending Record schemas
    "LendingRecordBase", "LendingRecordCreate", "LendingRecordUpdate",
    "LendingRecordResponse", "LendingRecordListResponse",
    "BookSummary", "BorrowerSummary",
    
    # User schemas
    "UserBase", "UserCreate", "UserUpdate", "UserResponse", 
    "UserListResponse", "UserLogin", "Token", "TokenData"
]
