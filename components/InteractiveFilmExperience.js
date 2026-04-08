'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function VideoPlaceholder({ title, body }) {
  return (
    <div className="video-placeholder">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

export default function InteractiveFilmExperience({ filmData }) {
  const mainVideoRef = useRef(null);
  const clipVideoRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [savedMainTime, setSavedMainTime] = useState(0);
  const [activeClipId, setActiveClipId] = useState(null);
  const [isMainLoaded, setIsMainLoaded] = useState(false);
  const [mainVideoError, setMainVideoError] = useState(false);
  const [clipVideoError, setClipVideoError] = useState(false);

  const activeClip = activeClipId ? filmData.clips[activeClipId] : null;

  const activeHotspots = useMemo(() => {
    return filmData.hotspots.filter(
      (hotspot) => currentTime >= hotspot.start && currentTime <= hotspot.end
    );
  }, [currentTime, filmData.hotspots]);

  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return undefined;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime || 0);
    const handleLoaded = () => setIsMainLoaded(true);
    const handleError = () => setMainVideoError(true);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (!activeClipId) {
      setClipVideoError(false);
    }
  }, [activeClipId]);

  const openClip = (clipId) => {
    const video = mainVideoRef.current;
    if (!video) return;

    setSavedMainTime(video.currentTime || 0);
    video.pause();
    setActiveClipId(clipId);
  };

  const closeClip = () => {
    const mainVideo = mainVideoRef.current;
    const clipVideo = clipVideoRef.current;

    if (clipVideo) {
      clipVideo.pause();
      clipVideo.currentTime = 0;
    }

    setActiveClipId(null);

    if (mainVideo) {
      mainVideo.currentTime = savedMainTime;
      const resume = async () => {
        try {
          await mainVideo.play();
        } catch {
          // User gesture rules may block autoplay; controls remain available.
        }
      };
      void resume();
    }
  };

  return (
    <section className="experience-shell">
      <div className="player-frame">
        <div className="player-head">
          <div>
            <h2>Main film</h2>
            <p>Current time: {formatTime(currentTime)}</p>
          </div>
          <div className="status-block">
            <span>{isMainLoaded ? 'Loaded' : 'Waiting for video...'}</span>
            <span>{activeHotspots.length ? 'Hotspot live' : 'No active hotspot'}</span>
          </div>
        </div>

        <div className="video-stage">
          <video
            ref={mainVideoRef}
            className="main-video"
            src={filmData.mainVideo.src}
            poster={filmData.mainVideo.poster}
            controls
            preload="metadata"
          />

          {mainVideoError && (
            <VideoPlaceholder
              title="Main video missing"
              body="Add your own MP4 at public/videos/main-film.mp4 to test the interaction."
            />
          )}

          {activeHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className="hotspot"
              style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
              onClick={() => openClip(hotspot.targetClipId)}
            >
              <span className="hotspot-dot" />
              <span className="hotspot-label">{hotspot.label}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="side-panel">
        <h3>Test notes</h3>
        <p>
          This is intentionally simple. It proves the one behavior that matters: timed overlay → side clip → return
          to the main film at the saved frame.
        </p>
        <ul>
          <li>Main hotspot window: 00:03–00:12</li>
          <li>Target clip: Warehouse Detail — Stainless Steel Clips</li>
          <li>Return mode: resume main film from saved time</li>
        </ul>
      </aside>

      {activeClip && (
        <div className="clip-modal-backdrop" onClick={closeClip}>
          <div className="clip-modal" onClick={(event) => event.stopPropagation()}>
            <div className="clip-header">
              <div>
                <p className="eyebrow">Side clip</p>
                <h3>{activeClip.title}</h3>
                <p>{activeClip.description}</p>
              </div>
              <button type="button" className="close-button" onClick={closeClip}>
                Close
              </button>
            </div>

            <video
              ref={clipVideoRef}
              className="clip-video"
              src={activeClip.src}
              controls
              autoPlay
              preload="metadata"
              onEnded={closeClip}
              onError={() => setClipVideoError(true)}
            />

            {clipVideoError && (
              <VideoPlaceholder
                title="Side clip missing"
                body="Add your own MP4 at public/videos/stainless-clips.mp4 to complete the round trip test."
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
