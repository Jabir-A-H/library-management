#!/usr/bin/env python3
"""
Test script to verify the dynamic import strategy works
"""
import os
import sys
import importlib.util
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_dynamic_import():
    """Test the dynamic import strategy"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    routes_dir = os.path.join(current_dir, "routes")
    
    # Add directories to path
    if routes_dir not in sys.path:
        sys.path.insert(0, routes_dir)
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    parent_dir = os.path.dirname(current_dir)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    
    print(f"Current directory: {current_dir}")
    print(f"Routes directory: {routes_dir}")
    print(f"Python path: {sys.path[:5]}...")  # Show first 5 entries
    
    # Test with book_async module
    module_name = "book_async"
    module_path = os.path.join(routes_dir, f"{module_name}.py")
    
    if os.path.exists(module_path):
        print(f"Found module at: {module_path}")
        
        # Read the file content
        with open(module_path, 'r', encoding='utf-8') as f:
            source_code = f.read()
        
        print("Original imports (first 10 lines):")
        for i, line in enumerate(source_code.split('\n')[:20]):
            if 'from' in line:
                print(f"  Line {i+1}: {line}")
        
        # Replace relative imports with absolute imports
        modified_code = source_code.replace('from ..database_async', 'from database_async')
        modified_code = modified_code.replace('from ..models.', 'from models.')
        modified_code = modified_code.replace('from ..schemas.', 'from schemas.')
        modified_code = modified_code.replace('from ..dependencies.', 'from dependencies.')
        
        print("\nModified imports:")
        for i, line in enumerate(modified_code.split('\n')[:20]):
            if 'from' in line and ('database_async' in line or 'models.' in line or 'schemas.' in line or 'dependencies.' in line):
                print(f"  Line {i+1}: {line}")
        
        # Try to execute the modified code
        try:
            unique_module_name = f"dynamic_routes_{module_name}"
            spec = importlib.util.spec_from_loader(unique_module_name, loader=None)
            module = importlib.util.module_from_spec(spec)
            
            # Execute the modified source code
            exec(modified_code, module.__dict__)
            
            # Check if router exists
            if hasattr(module, 'router'):
                print(f"✅ Successfully imported {module_name} router!")
                router = getattr(module, 'router')
                print(f"Router type: {type(router)}")
                print(f"Router routes: {len(router.routes)}")
                return True
            else:
                print(f"❌ Module {module_name} has no 'router' attribute")
                print(f"Available attributes: {[attr for attr in dir(module) if not attr.startswith('_')]}")
                
        except Exception as e:
            print(f"❌ Error executing modified code: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"❌ Module file not found: {module_path}")
    
    return False

if __name__ == "__main__":
    success = test_dynamic_import()
    if success:
        print("\n🎉 Dynamic import strategy works!")
    else:
        print("\n💥 Dynamic import strategy failed!")
