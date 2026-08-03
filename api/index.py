import sys
import os

# Add root directory to sys.path so app can be imported cleanly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Export app for Vercel Serverless Function handler
__all__ = ['app']
