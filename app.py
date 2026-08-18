import os
import json
import base64
import time
import secrets
import html
import urllib.error
import urllib.request
from flask import Flask, render_template, jsonify, request, send_from_directory

app = Flask(__name__, template_folder='templates', static_folder='static')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data.json')
UPLOADS_DIR = os.path.join(BASE_DIR, 'static', 'uploads')

DEFAULT_DATA = {
    "pw": "9270209244@Kkw",
    "profile": {
        "firstName": "HARSHVARDHAN",
        "lastName": "BHUSARE",
        "bioShort": "Enthusiastic MCA Student & Python/Flask Developer building real-world solutions.",
        "bio": "Enthusiastic and analytical individual with a strong interest in solving real-world problems. Pursuing MCA at K. K. Wagh Institute of Engineering Education and Research (KKWIEER, SGPA: 8.86) after completing BBA CA (CGPA: 9.22). Possesses strong communication, problem-solving, and teamwork skills with adaptability to dynamic environments.",
        "roles": [
            "Python Developer",
            "Flask Developer",
            "MCA Student",
            "Full Stack Developer",
            "Problem Solver",
            "Prompt Engineer"
        ],
        "avatar": "/static/images/profile.jpg"
    },
    "skills": [
        { "id": 1, "name": "Python", "level": 92, "category": "Programming" },
        { "id": 2, "name": "Flask", "level": 88, "category": "Framework" },
        { "id": 3, "name": "MySQL & Database Management", "level": 85, "category": "Database" },
        { "id": 4, "name": "HTML & CSS", "level": 90, "category": "Web" },
        { "id": 5, "name": "JavaScript", "level": 82, "category": "Web" },
        { "id": 6, "name": "Bootstrap", "level": 80, "category": "Web" },
        { "id": 7, "name": "REST APIs", "level": 85, "category": "Backend" },
        { "id": 8, "name": "Data Structures & Algorithms", "level": 80, "category": "Core" },
        { "id": 9, "name": "Prompt Engineering & AI Tools", "level": 85, "category": "AI" },
        { "id": 10, "name": "Teamwork & Leadership", "level": 90, "category": "Soft Skills" }
    ],
    "projects": [
        {
            "id": 1,
            "title": "The WorkVerse",
            "description": "Interactive web-based platform helping students improve professional skills through job role simulations, quizzes, assignments, certificates, and performance tracking.",
            "tags": ["Python", "Flask", "HTML/CSS", "Bootstrap", "JavaScript", "MySQL", "Render"],
            "link": "https://workverse-8.onrender.com",
            "github": "https://github.com/HARSHVARDHAN-JOYBOY/WorkVerse.git"
        },
        {
            "id": 2,
            "title": "TRENDIFY News Explorer Pro",
            "description": "Sophisticated news web application aggregating real-time news from credible global sources into a single navigable interface using REST APIs.",
            "tags": ["Python", "Flask", "REST API", "MySQL", "HTML/CSS"],
            "link": "#",
            "github": "https://github.com/HARSHVARDHAN-JOYBOY/TRENDIFY_PROJECT_API.git"
        },
        {
            "id": 3,
            "title": "INTERNHUB — Smart Internship Portal",
            "description": "Comprehensive web-based application designed to streamline and automate the entire internship management process.",
            "tags": ["Web Development", "MySQL", "PHP", "HTML/CSS"],
            "link": "http://internhub-portal.infinityfreeapp.com",
            "github": "https://github.com/HARSHVARDHAN-JOYBOY/Internship_Portal.git"
        }
    ],
    "achievements": [
        {
            "id": 1,
            "title": "1st Rank — Project Presentation",
            "description": "Organized by ABACUS CLUB KKWIEER 2026",
            "year": "2026",
            "icon": "🏆"
        },
        {
            "id": 2,
            "title": "3rd Rank — LogicHunt DSA Competition",
            "description": "Data Structures & Algorithms edition by Abacus Club KKWIEER 2025",
            "year": "2025",
            "icon": "⚡"
        },
        {
            "id": 3,
            "title": "1st Rank in TYBBA (CA)",
            "description": "Achieved 1st Rank in Bachelor of Business Administration (Computer Applications) 2025",
            "year": "2025",
            "icon": "🎓"
        },
        {
            "id": 4,
            "title": "Programmer of the Year 2023–24",
            "description": "Awarded the title of Programmer of the Year at NVPM",
            "year": "2024",
            "icon": "⭐"
        }
    ],
    "gallery": [],
    "contact": {
        "email": "bhusareharshvardhana2122004@gmail.com",
        "phone": "+91 9270209244",
        "location": "Nashik, Maharashtra",
        "github": "https://github.com/HARSHVARDHAN-JOYBOY",
        "linkedin": "https://github.com/HARSHVARDHAN-JOYBOY",
        "twitter": "#",
        "instagram": "#"
    },
    "cv": None
}

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for k, v in DEFAULT_DATA.items():
                    if k not in data:
                        data[k] = v
                return data
        except Exception as e:
            print(f"Error loading data.json: {e}")
    return DEFAULT_DATA.copy()

def save_data(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error writing data.json: {e}")
        return False

@app.route('/')
def home():
    data = load_data()
    safe_data = {k: v for k, v in data.items() if k != 'pw'}
    return render_template('index.html', data=safe_data)

@app.route('/api/data', methods=['GET'])
def get_data():
    data = load_data()
    safe_data = {k: v for k, v in data.items() if k != 'pw'}
    return jsonify(safe_data)

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({
        'status': 'ok',
        'server': 'Flask (Python)',
        'data_file_exists': os.path.exists(DATA_FILE),
        'writable': os.access(BASE_DIR, os.W_OK)
    })

@app.route('/api/contact', methods=['POST'])
def send_contact_message():
    """Send a portfolio contact-form message through Resend."""
    req = request.get_json(silent=True) or {}
    name = str(req.get('name', '')).strip()
    sender_email = str(req.get('email', '')).strip()
    subject = str(req.get('subject', '')).strip()
    message = str(req.get('message', '')).strip()

    if not name or not sender_email or not message:
        return jsonify({'error': 'Name, email, and message are required.'}), 400
    if len(name) > 120 or len(sender_email) > 254 or len(subject) > 200 or len(message) > 5000:
        return jsonify({'error': 'One or more fields are too long.'}), 400
    if '@' not in sender_email or sender_email.startswith('@') or sender_email.endswith('@'):
        return jsonify({'error': 'Please enter a valid email address.'}), 400

    resend_api_key = os.environ.get('RESEND_API_KEY')
    from_email = os.environ.get('CONTACT_FROM_EMAIL')
    recipient = os.environ.get('CONTACT_RECIPIENT_EMAIL', 'bhusareharshvardhana2122004@gmail.com')
    if not resend_api_key or not from_email:
        app.logger.error('Contact email is not configured: missing RESEND_API_KEY or CONTACT_FROM_EMAIL')
        return jsonify({'error': 'The contact form is temporarily unavailable. Please email me directly.'}), 503

    safe_name = html.escape(name)
    safe_email = html.escape(sender_email)
    safe_subject = html.escape(subject or 'Portfolio contact form message')
    safe_message = html.escape(message).replace('\n', '<br>')
    payload = json.dumps({
        'from': from_email,
        'to': [recipient],
        'reply_to': sender_email,
        'subject': f'Portfolio: {subject or "New message from " + name}',
        'html': (
            f'<h2>New portfolio message</h2><p><strong>Name:</strong> {safe_name}</p>'
            f'<p><strong>Email:</strong> {safe_email}</p><p><strong>Subject:</strong> {safe_subject}</p>'
            f'<p><strong>Message:</strong><br>{safe_message}</p>'
        ),
    }).encode('utf-8')
    email_request = urllib.request.Request(
        'https://api.resend.com/emails', data=payload, method='POST',
        headers={
            'Authorization': f'Bearer {resend_api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'harshvardhan-portfolio-contact-form/1.0',
        }
    )
    try:
        with urllib.request.urlopen(email_request, timeout=10) as response:
            if response.status not in (200, 201):
                app.logger.error('Resend returned status %s', response.status)
                return jsonify({'error': 'Unable to send your message right now.'}), 502
    except urllib.error.HTTPError as error:
        error_body = error.read().decode('utf-8', errors='replace')
        app.logger.error('Resend rejected contact message: %s %s', error.code, error_body)
        return jsonify({'error': 'Unable to send your message right now.'}), 502
    except urllib.error.URLError:
        app.logger.exception('Could not reach Resend')
        return jsonify({'error': 'Unable to send your message right now.'}), 502

    return jsonify({'success': True, 'message': 'Message sent successfully.'})

@app.route('/api/verify', methods=['POST'])
def verify_pw():
    req = request.get_json(silent=True) or {}
    submitted_pw = req.get('pw', '')
    data = load_data()
    stored_pw = data.get('pw', '9270209244@Kkw')
    
    if submitted_pw == stored_pw:
        return jsonify({'valid': True})
    return jsonify({'valid': False, 'error': 'Wrong password'}), 403

@app.route('/api/save', methods=['POST'])
def save_portfolio():
    req = request.get_json(silent=True)
    if not req:
        return jsonify({'error': 'Invalid JSON body'}), 400
    
    submitted_pw = req.get('pw', '')
    new_data = req.get('data', {})
    
    current_data = load_data()
    stored_pw = current_data.get('pw', '9270209244@Kkw')
    
    if submitted_pw != stored_pw:
        return jsonify({'error': 'Invalid password — save rejected'}), 403
    
    merged = {**current_data, **new_data}
    if 'pw' in new_data and new_data['pw']:
        merged['pw'] = new_data['pw']
    else:
        merged['pw'] = stored_pw
        
    if save_data(merged):
        return jsonify({'success': True, 'message': 'Saved successfully!'})
    else:
        return jsonify({'error': 'Could not write to data.json on server disk'}), 500

@app.route('/api/upload', methods=['POST'])
def upload_avatar():
    submitted_pw = request.form.get('pw', '')
    current_data = load_data()
    stored_pw = current_data.get('pw', '9270209244@Kkw')
    
    if submitted_pw != stored_pw:
        return jsonify({'error': 'Invalid password'}), 403
    
    if 'photo' not in request.files:
        return jsonify({'error': 'No file received'}), 400
    
    file = request.files['photo']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        ext = os.path.splitext(file.filename)[1].lower() or '.png'
        filename = f"avatar_{int(time.time())}_{secrets.token_hex(4)}{ext}"
        dest_path = os.path.join(UPLOADS_DIR, filename)
        file.save(dest_path)
        
        public_url = f"/static/uploads/{filename}"
        current_data['profile']['avatar'] = public_url
        save_data(current_data)
        return jsonify({'success': True, 'url': public_url})
    except Exception:
        try:
            file.seek(0)
            file_bytes = file.read()
            mime = file.mimetype or 'image/png'
            b64_str = base64.b64encode(file_bytes).decode('utf-8')
            data_url = f"data:{mime};base64,{b64_str}"
            current_data['profile']['avatar'] = data_url
            save_data(current_data)
            return jsonify({'success': True, 'url': data_url})
        except Exception as ex:
            return jsonify({'error': f"Upload failed: {str(ex)}"}), 500

@app.route('/api/reset', methods=['POST'])
def reset_data():
    req = request.get_json(silent=True) or {}
    submitted_pw = req.get('pw', '')
    current_data = load_data()
    stored_pw = current_data.get('pw', '9270209244@Kkw')
    
    if submitted_pw != stored_pw:
        return jsonify({'error': 'Invalid password'}), 403
    
    if save_data(DEFAULT_DATA):
        return jsonify({'success': True})
    return jsonify({'error': 'Reset failed'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask Portfolio Server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
