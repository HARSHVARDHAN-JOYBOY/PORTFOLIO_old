# Flask Portfolio - Vercel Deployment & Permanent Data Guide

This project is a high-performance **Flask (Python) Portfolio** with modern styling, full responsiveness, dynamic animations, and an embedded admin management panel.

---

## 🚀 1. How to Run Locally

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask development server:
   ```bash
   python app.py
   ```

3. Open `http://localhost:5000` in your web browser.

---

## 🌐 2. Deploying to Vercel

1. Push this repository to your **GitHub** account.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** → **"Project"**.
3. Select your repository.
4. Keep all default settings (Vercel automatically detects `vercel.json` and `@vercel/python`).
5. Click **Deploy**!

### Enable the contact form

The contact form sends mail through [Resend](https://resend.com). In the Vercel project, add these environment variables for **Production**, **Preview**, and **Development**, then redeploy:

- `RESEND_API_KEY` — create this in your Resend account.
- `CONTACT_FROM_EMAIL` — a sender address on a domain you have verified in Resend, such as `Portfolio <contact@yourdomain.com>`.
- `CONTACT_RECIPIENT_EMAIL` *(optional)* — defaults to `bhusareharshvardhana2122004@gmail.com`.

Never put `RESEND_API_KEY` in the frontend JavaScript or commit it to the repository.

---

## 🔒 3. Permanent Updates on Vercel (Visible to Everyone)

> [!IMPORTANT]
> **Why do changes need to be in `data.json`?**
> Serverless platforms like Vercel do not have permanent writable disk drives. If you edit files directly in a web browser on Vercel, the changes reset when serverless lambdas restart.

### How to make permanent updates visible to everyone:
1. **Method A (Direct JSON / Code Edit)**:
   - Edit `data.json` directly in your code editor or GitHub.
   - Commit and push to GitHub (`git commit -am "Update portfolio" && git push`).
   - Vercel automatically deploys your new version instantly!

2. **Method B (Admin Panel Export)**:
   - Open your portfolio on Vercel or localhost.
   - Click the gear icon (`⚙`) in the footer and log in with your admin password.
   - Make any edits to your bio, skills, projects, achievements, or contact info.
   - Go to the **Settings** tab and click **"Export data.json"**.
   - Save the downloaded `data.json` into your project directory, commit, and push to GitHub!

---

## 📂 Project Structure

```
PORTFOLIO/
├── app.py              # Main Flask application & API routes
├── data.json           # Permanent portfolio data store
├── requirements.txt    # Python package dependencies
├── vercel.json         # Vercel serverless deployment routing
├── api/
│   └── index.py        # Vercel Python entrypoint
├── templates/
│   └── index.html      # Jinja2 HTML layout
└── static/
    ├── css/
    │   └── style.css   # Main design system & responsive CSS
    └── js/
        └── main.js     # Frontend animations & API sync logic
```
