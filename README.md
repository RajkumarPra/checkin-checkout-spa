# Check-In/Check-Out SPA (React + Tailwind)

A single page application with a clean dashboard UI, digital timer, and Check-In/Check-Out actions.

## Tech Stack
- React 18
- Vite
- Tailwind CSS

## Development

1) Install dependencies
```bash
npm install
```

2) Start dev server
```bash
npm run dev
```

3) Build for production
```bash
npm run build
npm run preview
```

## Configuration
Update the placeholder endpoints in `src/App.jsx`:
- `CHECKIN_URL`
- `CHECKOUT_URL`

The timer starts on Check-In, updates every second, and stops on Check-Out while keeping the elapsed display.

## Deploy to GitHub Pages

1) Create a GitHub repository and push the code
```bash
git init
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git add .
git commit -m "Initial"
git push -u origin main
```

2) Enable Pages
- In GitHub: Repository → Settings → Pages → Set Source to "GitHub Actions".

3) Deploy
- Push to `main`. The bundled site will be built and deployed automatically to GitHub Pages using `.github/workflows/deploy.yml`.

Notes:
- Vite `base` is auto-detected in CI. For a repo named `USERNAME.github.io`, the site will be at `/`.
- For a regular repo, your site will be available at `https://USERNAME.github.io/REPO_NAME/`.

## What gets pushed vs ignored

Already ignored by `.gitignore`:
- `node_modules/`, build outputs like `dist/`, logs `*.log`, editor folders `.vscode/`, `.idea/`, OS files `.DS_Store`.
- `.env` and `.env.*` are ignored. Use `.env.example` (committed) as a template.

Environment variables (create a local `.env`):
```
VITE_CHECKIN_URL=your-checkin-url
VITE_ZOHO_CHECKOUT_URL=https://people.zoho.com/xebiacom/AttendanceAction.zp?mode=punchOut
VITE_ZOHO_CONREQCSR=  # leave blank (session-specific)
VITE_ZOHO_URL_MODE=myspace
VITE_ZOHO_LATITUDE=
VITE_ZOHO_LONGITUDE=
VITE_ZOHO_ACCURACY=
```
Do not commit your `.env` file.
