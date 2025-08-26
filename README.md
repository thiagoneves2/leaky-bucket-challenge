# leaky-bucket-challenge

## Introduction

The **Leaky Bucket** is a traffic shaping algorithm that controls the flow of data by using a fixed-rate output, similar to water leaking from a bucket with a small hole at the bottom. Incoming data is placed into a queue (the “bucket”), and it is transmitted at a constant rate, regardless of how fast it arrives. If the bucket becomes full, excess data is discarded. This ensures a smooth output rate, prevents network congestion, and limits burst traffic.

### Postman (Collection & Environment)

To run postman locally simply follow the steps:

1. Import collection located in /postman
2. Create token variable in enviroment (no value needed)
3. Run **Login** first (saves `{{token}}` through script) than **sendPix**.

## Project Organization

Inside the repository we have both the back and the front-end, located in pix-frontend (front-end) and server (back-end).

### How to run the back-end

fisrt go to the server folder through

```powershell
cd server
```

Once there import all the necessary files with

```powershell
npm i
```

#### Dev Testing

To run the server when trying to test it just run

```powershell
npm run dev
```

#### Production

When in production, first run (it will compile the .js files in the dist folder)

```powershell
npm run build
```

than after that

```powershell
npm start
```

#### Testing with jest

This server has two tests defined in /server/src/**tests**/leakyBucket.spec.ts to run them just type

```powershell
npm test
```

Jest will then see if the requests are working, and if the leaky bucket refuses the 11th request in a row.

## How to run the front-end

fisrt go to the front-end folder through

```powershell
cd pix-frontend
```

Once there import all the necessary files with

```powershell
npm i
```

### Generate schema.graphql (PowerShell)

**This part should only be executed if the schema.graphql doesn't exist, or if there are changes in the mutations from graphql**, if so, open a terminal in /server/ than run

```powershell
npm run dev
```

to start the server in http://localhost:3000

1. with powershell open in /pix-frontend first we have to get the token, through

```powershell
$token = (Invoke-RestMethod `
  -Uri http://localhost:3000/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"email":"test@example.com","password":"password123"}').token
```

2. Than Download the schema (SDL) using

```powershell
npx get-graphql-schema http://localhost:3000/graphql `
  -h "Authorization=Bearer $token" > schema.graphql
```

3. Than normalize the attributes/permissions (if Windows locks the file)

```powershell
attrib -R -H .\schema.graphql
icacls .\schema.graphql /grant "$env:USERNAME:(R,W)" /T
(Get-Content .\schema.graphql) | Set-Content -Encoding utf8 .\schema.graphql
```

---

### Generate Relay Artifacts

Again **This part should only be run if there is a change in the schemas or mutations from graphql**.

check if the file is as follows.

relay.config.json

```json
{
  "src": "./src",
  "schema": "./schema.graphql",
  "language": "typescript",
  "artifactDirectory": "./src/__generated__"
}
```

**If the artifacts folder is not created** create it once:

```powershell
  mkdir .\src\__generated__ -Force
```

than compile artifacts (Windows uses no watch mode) with:

```powershell
  npm run relay
```

#### Dev run

To run the front-end in development just type

```powrshell
npm run dev
```

#### Production

In production run

```powrshell
npm run build
```

than

```powrshell
npm run preview
```

## Main Challenges

This project was a great opportunity to learn new skills such as typescript, using Koa as a cascade server, the leaky bucket strategy for handling a limit on requests, using vite as a typescript react and relay framework and graphql.

When developing the project the main challenges I faced were regarding to managin packkages and conflicts with typescript, understanding how the order of the middlewares would impact the code on the Koa server.

Another challenge I faced was learning on how to use postman, specially when the server needs first to generate the bearer token through the /login route.
