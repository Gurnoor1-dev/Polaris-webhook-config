# Polaris Webhook Config

A lightweight web utility for configuring Polaris webhook settings.

## Run locally
This repository contains browser-side files. Clone it and open `index.html` in a browser, or serve the directory locally:

```bash
git clone https://github.com/Gurnoor1-dev/Polaris-webhook-config.git
cd Polaris-webhook-config
python -m http.server 8000
```

Visit `http://localhost:8000`.

## Deploy from a terminal
Publish the static files with any static web server. For example, after installing the Vercel CLI, run `vercel` from the project directory and follow the prompts.

## Deploy on Vercel
1. Import this repository in the Vercel dashboard, or install the CLI with `npm i -g vercel`.
2. Choose the project directory as the root.
3. Use the static-site defaults; no build command is needed unless one is added later.
4. Deploy with `vercel --prod`.

## Configuration & security
Never place private webhook secrets in frontend JavaScript. Browser code is public to every visitor. Store sensitive credentials in a backend or server-side environment variables.