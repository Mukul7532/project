# Contributing to the Client

## Branch workflow
- Work on frontend-dev, not main
- Before starting work each day, run:

git checkout frontend-dev
git pull origin frontend-dev

- After finishing, run:

git add .
git commit -m "Describe what changed"
git push origin frontend-dev

## Running locally

cd client
npm install
npm run dev

## Notes
- Mock data lives in src/data/ and is used as a fallback when the backend isn't reachable.
- See the main README.md for page structure and API details.