### Pix Frontend (React + Relay)

A minimal React + Relay UI that simulates initiating a Pix transfer against a Koa/GraphQL backend. This README focuses on **schema generation (PowerShell)**, **Relay artifacts**, and a clean **developer workflow** with brief notes recruiters care about.

---

### ✨ Tech Stack

- React + TypeScript (Vite)
- Relay (GraphQL client, compile-time artifacts)
- Tailwind CSS v4
- Vite dev server & build

---

### 📦 Project Structure

pix-frontend/ <br>
├─ relay.config.json # Relay compiler config<br>
├─ schema.graphql # GraphQL SDL (generated from backend)<br>
├─ src/<br>
│&nbsp; ├─ RelayEnvironment.ts # Relay network (Bearer token via localStorage)<br>
│&nbsp; ├─ api/auth.ts # login/logout helpers<br>
│&nbsp; ├─ mutations/SendPixMutation.ts # Relay mutation for sendPix<br>
│&nbsp; ├─ generated/ # Relay artifacts (generated)<br>
│&nbsp; ├─ App.tsx # UI (Login + Send Pix form)<br>
│&nbsp; ├─ main.tsx # Wraps App in Relay provider<br>
│&nbsp; └─ index.css # Tailwind entry<br>
├─ postcss.config.js # PostCSS using @tailwindcss/postcss<br>
├─ tailwind.config.js # (optional in v4)<br>
├─ index.html<br>
└─ package.json<br>

---

### 🔐 Generate schema.graphql (PowerShell)

run inside pix-frontend/

1. Login -> token

```powershell
$token = (Invoke-RestMethod `
  -Uri http://localhost:3000/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"email":"test@example.com","password":"password123"}').token
```

2. Download schema (SDL)

```powershell
npx get-graphql-schema http://localhost:3000/graphql `
  -h "Authorization=Bearer $token" > schema.graphql
```

3. Normalize attributes/permissions (if Windows locks the file)

```powershell
attrib -R -H .\schema.graphql
icacls .\schema.graphql /grant "$env:USERNAME:(R,W)" /T
(Get-Content .\schema.graphql) | Set-Content -Encoding utf8 .\schema.graphql
```

---

### 🧩 Generate Relay Artifacts

relay.config.json

```json
{
  "src": "./src",
  "schema": "./schema.graphql",
  "language": "typescript",
  "artifactDirectory": "./src/__generated__"
}
```

Create the artifacts dir once:

```powershell
  mkdir .\src\__generated__ -Force
```

Compile artifacts (Windows uses no watch mode):

```powershell
  npm run relay
```

When Graphql operations or shcema change has to be re-run

---

### 🔒 Security Notes (Backend)

In production don't forget to change backend CORS to a custom URL
