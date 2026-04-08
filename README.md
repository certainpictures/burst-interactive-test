# Burst Interactive Test Site

A small Next.js prototype for an interactive film microsite.

## What it proves

- Timed hotspot overlay on a main video
- Click-through to a side clip
- Return to the main film at the saved time
- Vercel-friendly deployment path

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Add your own videos

Drop your files into:

- `public/videos/main-film.mp4`
- `public/videos/stainless-clips.mp4`

## Deploy to Vercel

1. Create a GitHub repo and push this folder.
2. In Vercel, click **Add New Project**.
3. Import the repo.
4. Vercel will detect Next.js automatically.
5. Deploy.

## Where to edit interaction timing

Open `app/page.js` and change the `filmData.hotspots` object.

Example:

```js
{
  id: 'clips-used-hotspot',
  label: 'See the clips used',
  targetClipId: 'clipsUsed',
  start: 3,
  end: 12,
  xPercent: 67,
  yPercent: 58,
}
```

## What to build next

- Multiple hotspots
- Chapters or timeline markers
- Better motion design
- JSON-driven project config
- CMS later, only if needed
