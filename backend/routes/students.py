from flask import Blueprint, request, jsonify
import sys
import os
# Add parent directory to path for imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
from datetime import datetime
from models import (
    db,
    Student,
    StudentSkill,
    StudentAcademicHistory,
    StudentNonAcademicActivity,
    StudentViolation,
    StudentAffiliation,
)

students_bp = Blueprint('students', __name__, url_prefix='/api/students')

@students_bp.route('', methods=['GET'])
def get_students():
    """Get all students (optional filters: tenant_id, skill)"""
    tenant_id = request.args.get('tenant_id')
    skill = request.args.get('skill')
    query = Student.query
    
    if tenant_id:
        query = query.filter_by(tenant_id=tenant_id)
    
    if skill:
        # Filter students that have a skill matching the provided term
        query = (
            query.join(StudentSkill)
            .filter(StudentSkill.skill_name.ilike(f'%{skill}%'))
            .distinct()
        )
    
    students = query.all()
    return jsonify({
        'success': True,
        'data': [student.to_dict() for student in students]
    })

@students_bp.route('', methods=['POST'])
def create_student():
    """Create a new student"""
    try:
        data = request.get_json()
        student = Student(
            student_id=data.get('student_id'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            middle_name=data.get('middle_name'),
            email=data.get('email'),
            contact_number=data.get('contact_number'),
            course=data.get('course'),
            year_level=data.get('year_level'),
            enrollment_status=data.get('enrollment_status', 'Enrolled'),
            tenant_id=data.get('tenant_id')
        )
        db.session.add(student)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Student created successfully',
            'data': student.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create student: {str(e)}'
        }), 500

@students_bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get a specific student"""
    student = Student.query.get_or_404(student_id)
    return jsonify({
        'success': True,
        'data': student.to_dict()
    })

@students_bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Update a student"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json()
    
    student.first_name = data.get('first_name', student.first_name)
    student.last_name = data.get('last_name', student.last_name)
    student.email = data.get('email', student.email)
    student.course = data.get('course', student.course)
    student.year_level = data.get('year_level', student.year_level)
    
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Student updated successfully',
        'data': student.to_dict()
    })

@students_bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student"""
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Student deleted successfully'
    })


# -------------------------
# Student Skills Endpoints
# -------------------------

@students_bp.route('/<int:student_id>/skills', methods=['POST'])
def add_skill(student_id):
    """Add a skill to a student"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json() or {}
    skill_name = (data.get('skill_name') or '').strip()
    level = (data.get('level') or '').strip() or None

    if not skill_name:
        return jsonify({'success': False, 'message': 'skill_name is required'}), 400

    item = StudentSkill(student_id=student.id, skill_name=skill_name, level=level)
    db.session.add(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Skill added successfully', 'data': item.id}), 201


@students_bp.route('/<int:student_id>/skills/<int:skill_id>', methods=['DELETE'])
def delete_skill(student_id, skill_id):
    """Delete a skill from a student"""
    item = StudentSkill.query.filter_by(id=skill_id, student_id=student_id).first()
    if not item:
        return jsonify({'success': False, 'message': 'Skill not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Skill deleted successfully'})


# -------------------------
# Student Academic History
# -------------------------

@students_bp.route('/<int:student_id>/academic-history', methods=['POST'])
def add_academic_history(student_id):
    """Add academic history record to a student"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json() or {}

    academic_year = (data.get('academic_year') or '').strip() or None
    course = (data.get('course') or '').strip() or None
    details = (data.get('details') or '').strip() or None

    item = StudentAcademicHistory(
        student_id=student.id,
        academic_year=academic_year,
        course=course,
        details=details,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Academic history added successfully', 'data': item.id}), 201


@students_bp.route('/<int:student_id>/academic-history/<int:history_id>', methods=['DELETE'])
def delete_academic_history(student_id, history_id):
    """Delete academic history record"""
    item = StudentAcademicHistory.query.filter_by(id=history_id, student_id=student_id).first()
    if not item:
        return jsonify({'success': False, 'message': 'Academic history not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Academic history deleted successfully'})


# -------------------------
# Non-Academic Activities
# -------------------------

@students_bp.route('/<int:student_id>/activities', methods=['POST'])
def add_activity(student_id):
    """Add a non-academic activity"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json() or {}

    activity_type = (data.get('activity_type') or '').strip() or None
    activity_name = (data.get('activity_name') or '').strip()
    details = (data.get('details') or '').strip() or None

    if not activity_name:
        return jsonify({'success': False, 'message': 'activity_name is required'}), 400

    item = StudentNonAcademicActivity(
        student_id=student.id,
        activity_type=activity_type,
        activity_name=activity_name,
        details=details,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Activity added successfully', 'data': item.id}), 201


@students_bp.route('/<int:student_id>/activities/<int:activity_id>', methods=['DELETE'])
def delete_activity(student_id, activity_id):
    """Delete a non-academic activity"""
    item = StudentNonAcademicActivity.query.filter_by(id=activity_id, student_id=student_id).first()
    if not item:
        return jsonify({'success': False, 'message': 'Activity not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Activity deleted successfully'})


# -------------------------
# Violations
# -------------------------

@students_bp.route('/<int:student_id>/violations', methods=['POST'])
def add_violation(student_id):
    """Add a violation record"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json() or {}

    violation_name = (data.get('violation_name') or '').strip()
    severity = (data.get('severity') or '').strip() or None
    date_str = (data.get('date') or '').strip() or None
    details = (data.get('details') or '').strip() or None

    if not violation_name:
        return jsonify({'success': False, 'message': 'violation_name is required'}), 400

    violation_date = None
    if date_str:
        try:
            violation_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'success': False, 'message': 'date must be YYYY-MM-DD'}), 400

    item = StudentViolation(
        student_id=student.id,
        violation_name=violation_name,
        severity=severity,
        date=violation_date,
        details=details,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Violation added successfully', 'data': item.id}), 201


@students_bp.route('/<int:student_id>/violations/<int:violation_id>', methods=['DELETE'])
def delete_violation(student_id, violation_id):
    """Delete a violation record"""
    item = StudentViolation.query.filter_by(id=violation_id, student_id=student_id).first()
    if not item:
        return jsonify({'success': False, 'message': 'Violation not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Violation deleted successfully'})


# -------------------------
# Affiliations
# -------------------------

@students_bp.route('/<int:student_id>/affiliations', methods=['POST'])
def add_affiliation(student_id):
    """Add an affiliation record"""
    student = Student.query.get_or_404(student_id)
    data = request.get_json() or {}

    name = (data.get('name') or '').strip()
    category = (data.get('category') or '').strip() or None
    role = (data.get('role') or '').strip() or None

    if not name:
        return jsonify({'success': False, 'message': 'name is required'}), 400

    item = StudentAffiliation(
        student_id=student.id,
        name=name,
        category=category,
        role=role,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Affiliation added successfully', 'data': item.id}), 201


@students_bp.route('/<int:student_id>/affiliations/<int:affiliation_id>', methods=['DELETE'])
def delete_affiliation(student_id, affiliation_id):
    """Delete an affiliation record"""
    item = StudentAffiliation.query.filter_by(id=affiliation_id, student_id=student_id).first()
    if not item:
        return jsonify({'success': False, 'message': 'Affiliation not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Affiliation deleted successfully'})

