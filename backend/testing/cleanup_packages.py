#!/usr/bin/env python3
"""
Package cleanup script - Remove unnecessary packages
"""

# SAFE packages that can be removed (won't break functionality)
SAFE_REMOVABLE_PACKAGES = [
    "fastapi_cors",         # Redundant - FastAPI has built-in CORS
    "environs",             # Redundant - using python-dotenv
    "python-magic",         # File type detection (not currently used)
    "rignore",              # Git ignore patterns (development only)
]

# KEEP these packages for future features (DO NOT REMOVE)
KEEP_FOR_FUTURE = [
    "reportlab",            # PDF generation (future export feature)
    "fastapi-cloud-cli",    # Cloud deployment (future hosting)
    "sentry-sdk",           # Error monitoring (production)
    "rich",                 # Better logging/debugging
    "rich-toolkit",         # Enhanced console output
    "openpyxl",             # Excel export (future feature)
    "pandas",               # Data processing for reports
    "numpy",                # Data manipulation support
    "typer",                # CLI tools (cloud-cli dependency)
    "shellingham",          # Shell detection (cloud-cli dependency)
]

# DEPENDENCIES - Don't remove these unless you know what you're doing
DEPENDENCIES = [
    "marshmallow",          # Data serialization (used by other packages)
    "et_xmlfile",           # Excel file support (openpyxl dependency)
    "ecdsa",                # Cryptography (python-jose dependency)
    "pyasn1",               # ASN.1 library (cryptography dependency)
    "six",                  # Python 2/3 compatibility (legacy dependency)
    "iniconfig",            # INI file parsing (pytest dependency)
    "pluggy",               # Plugin system (pytest dependency)
    "win32_setctime",       # Windows-specific (auto-installed)
]

def generate_removal_command():
    """Generate pip uninstall command for SAFE packages only"""
    packages_str = " ".join(SAFE_REMOVABLE_PACKAGES)
    return f"pip uninstall {packages_str} -y"

if __name__ == "__main__":
    print("🧹 SAFE Package Cleanup Recommendations")
    print("=" * 50)
    print("\n✅ SAFE packages to remove (won't break functionality):")
    for i, package in enumerate(SAFE_REMOVABLE_PACKAGES, 1):
        print(f"  {i:2d}. {package}")
    
    print(f"\n🗑️  Total SAFE packages to remove: {len(SAFE_REMOVABLE_PACKAGES)}")
    
    print("\n�️  KEEPING these packages for future features:")
    for i, package in enumerate(KEEP_FOR_FUTURE, 1):
        print(f"  {i:2d}. {package}")
    
    print("\n�🚀 Run this command to remove ONLY the safe packages:")
    print(f"\n{generate_removal_command()}")
    
    print("\n⚠️  IMPORTANT:")
    print("   • Only removes 4 truly redundant packages")
    print("   • Keeps all packages needed for future Excel/PDF export")
    print("   • Keeps all packages needed for cloud deployment")
    print("   • Test your application after removal")
    print("\n📝 After removal, run: pip check")
