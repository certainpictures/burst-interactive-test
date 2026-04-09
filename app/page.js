import InteractiveFilmExperience from '../components/InteractiveFilmExperience';

const filmData = {
  title: 'The Burst Project — Interactive Test',
  subtitle:
    'A minimal proof of concept: a timed hotspot appears over the main video, opens a side clip, then returns the viewer to the saved point in the main film.',
  mainVideo: {
  	type: "local",
    src: '/videos/main-film.mp4',
    poster: '',
  },
  clips: {
    clipsUsed: {
      id: 'clipsUsed',
      title: 'Warehouse Detail — Stainless Steel Clips',
      description:
        'This is where a short architectural detail film would play. Closing or finishing the clip returns the viewer to the main film.',
      src: '/videos/stainless-clips.mp4',
    },
  },
  hotspots: [
    {
      id: 'clips-used-hotspot',
      label: 'See the clips used',
      targetClipId: 'clipsUsed',
      start: 3,
      end: 12,
      xPercent: 67,
      yPercent: 58,
    },
  ],
};

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Next.js / Vercel Prototype</p>
        <h1>{filmData.title}</h1>
        <p className="subtitle">{filmData.subtitle}</p>
      </section>

      <InteractiveFilmExperience filmData={filmData} />

      <section className="notes">
        <h2>How this test works</h2>
        <ol>
          <li>Replace the files in <code>public/videos</code> with your own MP4s.</li>
          <li>The hotspot appears from 00:03 to 00:12 of the main film.</li>
          <li>Clicking it pauses the main film, opens the side clip, and stores the return time.</li>
          <li>Closing the side clip resumes the main film from that saved position.</li>
        </ol>
      </section>
    </main>
  );
}
