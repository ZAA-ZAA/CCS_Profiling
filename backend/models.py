from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication with multitenant support"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # DEAN, CHAIR, FACULTY, SECRETARY
    tenant_id = db.Column(db.String(100), nullable=True, index=True)  # For multitenant support
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password is correct"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'tenant_id': self.tenant_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def to_dict_safe(self):
        """Return user dict without sensitive info"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'tenant_id': self.tenant_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Student(db.Model):
    """Student records model"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), nullable=False, index=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    middle_name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    contact_number = db.Column(db.String(20))
    course = db.Column(db.String(100))
    year_level = db.Column(db.String(50))
    enrollment_status = db.Column(db.String(50), default='Enrolled')
    tenant_id = db.Column(db.String(100), nullable=True, index=True)  # For multitenant support
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Related student data (skills, activities, violations, affiliations, etc.)
    skills = db.relationship('StudentSkill', backref='student', cascade='all, delete-orphan', lazy='selectin')
    academic_history = db.relationship('StudentAcademicHistory', backref='student', cascade='all, delete-orphan', lazy='selectin')
    activities = db.relationship('StudentNonAcademicActivity', backref='student', cascade='all, delete-orphan', lazy='selectin')
    violations = db.relationship('StudentViolation', backref='student', cascade='all, delete-orphan', lazy='selectin')
    affiliations = db.relationship('StudentAffiliation', backref='student', cascade='all, delete-orphan', lazy='selectin')
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'middle_name': self.middle_name,
            'email': self.email,
            'contact_number': self.contact_number,
            'course': self.course,
            'year_level': self.year_level,
            'enrollment_status': self.enrollment_status,
            'skills': [
                {
                    'id': s.id,
                    'skill_name': s.skill_name,
                    'level': s.level,
                }
                for s in (self.skills or [])
            ],
            'academic_history': [
                {
                    'id': h.id,
                    'academic_year': h.academic_year,
                    'course': h.course,
                    'details': h.details,
                }
                for h in (self.academic_history or [])
            ],
            'activities': [
                {
                    'id': a.id,
                    'activity_type': a.activity_type,
                    'activity_name': a.activity_name,
                    'details': a.details,
                }
                for a in (self.activities or [])
            ],
            'violations': [
                {
                    'id': v.id,
                    'violation_name': v.violation_name,
                    'severity': v.severity,
                    'date': v.date.isoformat() if v.date else None,
                    'details': v.details,
                }
                for v in (self.violations or [])
            ],
            'affiliations': [
                {
                    'id': af.id,
                    'name': af.name,
                    'category': af.category,
                    'role': af.role,
                }
                for af in (self.affiliations or [])
            ],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudentSkill(db.Model):
    """Student skills model"""
    __tablename__ = 'student_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    skill_name = db.Column(db.String(120), nullable=False, index=True)
    level = db.Column(db.String(50), nullable=True)  # e.g., Beginner/Intermediate/Advanced
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    

class StudentAcademicHistory(db.Model):
    """Student academic history model"""
    __tablename__ = 'student_academic_history'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    academic_year = db.Column(db.String(50), nullable=True, index=True)
    course = db.Column(db.String(100), nullable=True, index=True)
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    

class StudentNonAcademicActivity(db.Model):
    """Non-academic activities model"""
    __tablename__ = 'student_non_academic_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    activity_type = db.Column(db.String(100), nullable=True, index=True)  # e.g., Club, Volunteer, Sports
    activity_name = db.Column(db.String(150), nullable=False, index=True)  # e.g., Debate Club, Basketball League
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    

class StudentViolation(db.Model):
    """Violations model"""
    __tablename__ = 'student_violations'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    violation_name = db.Column(db.String(150), nullable=False, index=True)
    severity = db.Column(db.String(50), nullable=True, index=True)  # e.g., Low/Medium/High
    date = db.Column(db.Date, nullable=True, index=True)
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    

class StudentAffiliation(db.Model):
    """Affiliations model (orgs, sports, teams, etc.)"""
    __tablename__ = 'student_affiliations'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False, index=True)  # Organization/Sports Team name
    category = db.Column(db.String(100), nullable=True, index=True)  # e.g., Org, Sports, Team
    role = db.Column(db.String(100), nullable=True)  # e.g., Member/Captain/Officer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Faculty(db.Model):
    """Faculty records model"""
    __tablename__ = 'faculty'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_number = db.Column(db.String(50), nullable=False, index=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    middle_name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    contact_number = db.Column(db.String(20))
    department = db.Column(db.String(100))
    position = db.Column(db.String(100))
    employment_start_date = db.Column(db.Date)
    employment_status = db.Column(db.String(50), default='Full-time')
    tenant_id = db.Column(db.String(100), nullable=True, index=True)  # For multitenant support
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_number': self.employee_number,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'middle_name': self.middle_name,
            'email': self.email,
            'contact_number': self.contact_number,
            'department': self.department,
            'position': self.position,
            'employment_start_date': self.employment_start_date.isoformat() if self.employment_start_date else None,
            'employment_status': self.employment_status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Schedule(db.Model):
    """Scheduling model"""
    __tablename__ = 'schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    instructor = db.Column(db.String(200), nullable=False)
    room = db.Column(db.String(100), nullable=False)
    day = db.Column(db.String(20), nullable=False)  # Monday, Tuesday, etc.
    start_time = db.Column(db.String(50), nullable=False)  # e.g., "9:00 AM"
    end_time = db.Column(db.String(50), nullable=False)  # e.g., "11:00 AM"
    students = db.Column(db.Integer, default=0)
    year_level = db.Column(db.String(50))
    section = db.Column(db.String(10))
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'course': self.course,
            'subject': self.subject,
            'instructor': self.instructor,
            'room': self.room,
            'day': self.day,
            'time': f'{self.start_time} - {self.end_time}',
            'start_time': self.start_time,
            'end_time': self.end_time,
            'students': self.students,
            'year_level': self.year_level,
            'section': self.section,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Research(db.Model):
    """College research model"""
    __tablename__ = 'research'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    authors = db.Column(db.Text)  # JSON string or comma-separated
    category = db.Column(db.String(100))
    status = db.Column(db.String(50), default='Ongoing')
    keywords = db.Column(db.Text)  # JSON string or comma-separated
    citations = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    downloads = db.Column(db.Integer, default=0)
    journal = db.Column(db.String(200))
    doi = db.Column(db.String(100))
    publication_date = db.Column(db.Date)
    year = db.Column(db.String(10))
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        # Parse authors and keywords from JSON or comma-separated
        authors_list = []
        if self.authors:
            try:
                import json
                authors_list = json.loads(self.authors)
            except:
                authors_list = [a.strip() for a in self.authors.split(',') if a.strip()]
        
        keywords_list = []
        if self.keywords:
            try:
                import json
                keywords_list = json.loads(self.keywords)
            except:
                keywords_list = [k.strip() for k in self.keywords.split(',') if k.strip()]
        
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'authors': authors_list,
            'category': self.category,
            'status': self.status,
            'keywords': keywords_list,
            'citations': self.citations,
            'views': self.views,
            'downloads': self.downloads,
            'journal': self.journal,
            'doi': self.doi,
            'date': self.publication_date.isoformat() if self.publication_date else None,
            'year': self.year,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Report(db.Model):
    """Organization and events reports model"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    report_type = db.Column(db.String(50))  # organization, event
    description = db.Column(db.Text)
    organization = db.Column(db.String(100))
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(50))
    venue = db.Column(db.String(200))
    status = db.Column(db.String(50), default='Upcoming')
    participants = db.Column(db.Integer, default=0)
    registered = db.Column(db.Integer, default=0)
    category = db.Column(db.String(50))
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'report_type': self.report_type,
            'description': self.description,
            'organization': self.organization,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'venue': self.venue,
            'status': self.status,
            'participants': self.participants,
            'registered': self.registered,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Organization(db.Model):
    """Organization model"""
    __tablename__ = 'organizations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    members = db.Column(db.Integer, default=0)
    events_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='Active')
    color = db.Column(db.String(50))
    description = db.Column(db.Text)
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'fullName': self.full_name,
            'full_name': self.full_name,
            'members': self.members,
            'events': self.events_count,
            'events_count': self.events_count,
            'status': self.status,
            'color': self.color,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Syllabus(db.Model):
    """Syllabus model"""
    __tablename__ = 'syllabus'
    
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(50), nullable=False)
    instructor = db.Column(db.String(200), nullable=False)
    semester = db.Column(db.String(50), nullable=False)
    academic_year = db.Column(db.String(20), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    hours = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    objectives = db.Column(db.Text)  # JSON array
    topics = db.Column(db.Text)  # JSON array
    requirements = db.Column(db.Text)  # JSON array
    status = db.Column(db.String(50), default='Active')
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        import json
        objectives_list = []
        topics_list = []
        requirements_list = []
        
        if self.objectives:
            try:
                objectives_list = json.loads(self.objectives)
            except:
                objectives_list = [o.strip() for o in self.objectives.split(',') if o.strip()]
        
        if self.topics:
            try:
                topics_list = json.loads(self.topics)
            except:
                topics_list = []
        
        if self.requirements:
            try:
                requirements_list = json.loads(self.requirements)
            except:
                requirements_list = []
        
        return {
            'id': self.id,
            'course': self.course,
            'subject': self.subject,
            'code': self.code,
            'instructor': self.instructor,
            'semester': self.semester,
            'academicYear': self.academic_year,
            'academic_year': self.academic_year,
            'units': self.units,
            'hours': self.hours,
            'description': self.description,
            'objectives': objectives_list,
            'topics': topics_list,
            'requirements': requirements_list,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Curriculum(db.Model):
    """Curriculum model"""
    __tablename__ = 'curriculum'
    
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(100), nullable=False)
    program = db.Column(db.String(200), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    total_units = db.Column(db.Integer, nullable=False)
    semesters = db.Column(db.Text, nullable=False)  # JSON array
    status = db.Column(db.String(50), default='Active')
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        import json
        semesters_list = []
        
        if self.semesters:
            try:
                semesters_list = json.loads(self.semesters)
            except:
                semesters_list = []
        
        return {
            'id': self.id,
            'course': self.course,
            'program': self.program,
            'year': self.year,
            'totalUnits': self.total_units,
            'total_units': self.total_units,
            'semesters': semesters_list,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Lesson(db.Model):
    """Lesson model"""
    __tablename__ = 'lessons'
    
    id = db.Column(db.Integer, primary_key=True)
    syllabus_id = db.Column(db.Integer, db.ForeignKey('syllabus.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    week = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.String(50))
    type = db.Column(db.String(50), default='Lecture')
    materials = db.Column(db.Text)  # JSON array
    activities = db.Column(db.Text)  # JSON array
    objectives = db.Column(db.Text)  # JSON array
    status = db.Column(db.String(50), default='Published')
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        import json
        materials_list = []
        activities_list = []
        objectives_list = []
        
        if self.materials:
            try:
                materials_list = json.loads(self.materials)
            except:
                materials_list = []
        
        if self.activities:
            try:
                activities_list = json.loads(self.activities)
            except:
                activities_list = []
        
        if self.objectives:
            try:
                objectives_list = json.loads(self.objectives)
            except:
                objectives_list = [o.strip() for o in self.objectives.split(',') if o.strip()]
        
        return {
            'id': self.id,
            'syllabus_id': self.syllabus_id,
            'title': self.title,
            'week': self.week,
            'duration': self.duration,
            'type': self.type,
            'materials': materials_list,
            'activities': activities_list,
            'objectives': objectives_list,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AuditLog(db.Model):
    """Audit logs model for tracking system activities"""
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    username = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(100), nullable=False)  # CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT
    entity_type = db.Column(db.String(50), nullable=False)  # STUDENT, FACULTY, SCHEDULE, etc.
    entity_id = db.Column(db.Integer, nullable=True)
    entity_name = db.Column(db.String(200), nullable=True)  # Name/description of the entity
    details = db.Column(db.Text)  # Additional details in JSON format
    ip_address = db.Column(db.String(50))
    tenant_id = db.Column(db.String(100), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.username,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'entity_name': self.entity_name,
            'details': self.details,
            'ip_address': self.ip_address,
            'tenant_id': self.tenant_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

