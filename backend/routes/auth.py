from flask import Blueprint, request, jsonify
import sys
import os
import re
from datetime import datetime
# Add parent directory to path for imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        role = data.get('role', 'FACULTY').upper()
        tenant_id = data.get('tenant_id', '').strip() or None
        
        # Validation
        if not username:
            return jsonify({'success': False, 'message': 'Username is required'}), 400
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        if role not in ['DEAN', 'CHAIR', 'FACULTY', 'SECRETARY']:
            return jsonify({'success': False, 'message': 'Invalid role'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=username,
            email=email,
            role=role,
            tenant_id=tenant_id
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': user.to_dict_safe()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        tenant_id = (data.get('tenant_id') or data.get('tenantId') or '').strip() or None
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        # Find user by email (optionally tenant_id)
        if tenant_id:
            user = User.query.filter_by(email=email, tenant_id=tenant_id).first()
        else:
            user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'message': 'Account is deactivated'}), 401
        
        # Check password
        if not user.check_password(password):
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict_safe()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    return jsonify({
        'success': True,
        'message': 'Logout successful'
    })

