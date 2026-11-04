import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { LiquidGlassVideo } from './LiquidGlassVideo';
import { defaultVideoConfig, type VideoConfigProps } from './config/videoConfig';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Terminal,
  Layers,
  Github,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

const SCENES = [
  { id: 'all', name: 'Full Video (00:20)', frame: 0, desc: 'Complete 20s promo video (1200 frames)' },
  { id: 'scene1', name: '1. Liquid Orb (0–4s)', frame: 60, desc: 'Glass sphere drop assembly & circular tachometer' },
  { id: 'scene2', name: '2. Linear Capsule (4–9s)', frame: 380, desc: 'Viscous wave liquid fill & 10 segment indicators' },
  { id: 'scene3', name: '3. Cyber Matrix (9–14s)', frame: 680, desc: '24-node hexagonal progression & buffer status' },
  { id: 'scene4', name: '4. Shockwave Burst (14–18.5s)', frame: 920, desc: '100% sync shockwave & monolithic glass emblem' },
  { id: 'scene5', name: '5. Outro Fade (18.5–20s)', frame: 1140, desc: 'Soft glass defocus & fade to graphite black' },
];

export default function App() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'scenes' | 'sfx' | 'github'>('controls');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic configuration state
  const [config, setConfig] = useState<VideoConfigProps>(defaultVideoConfig);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener('frameupdate', onFrameUpdate);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);
    player.addEventListener('seeked', onFrameUpdate);

    return () => {
      player.removeEventListener('frameupdate', onFrameUpdate);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
      player.removeEventListener('seeked', onFrameUpdate);
    };
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const jumpToFrame = (frame: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      setCurrentFrame(frame);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const playSfx = (filename: string) => {
    try {
      const audio = new Audio(`/audio/${filename}`);
      audio.volume = 0.8;
      audio.play();
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };

  const formattedTime = useMemo(() => {
    const totalSecs = currentFrame / 60;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const millis = Math.floor((totalSecs % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  }, [currentFrame]);

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Top Cyberpunk Header */}
      <header className="border-b border-white/10 bg-[#0d0d12]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_12px_#ff5500] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-extrabold tracking-wider text-white">
                REMOTION // LIQUID GLASS CYBERPUNK
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                1080p60 • 1200 FRAMES
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Autonomous Video Renderer & Interactive Studio
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('github')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-orange-400" />
            <span>GitHub Actions Setup</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={() => copyToClipboard('npm run render', 'render-cli')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-black font-mono font-bold text-xs transition-colors shadow-[0_0_15px_rgba(255,85,0,0.4)]"
          >
            {copiedCode === 'render-cli' ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
            <span>Render MP4 CLI</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: 16:9 Remotion Player Stage */}
        <div className="flex-1 bg-black/80 flex flex-col items-center justify-center p-4 lg:p-8 relative">
          {/* Ambient player back-glow */}
          <div className="absolute w-[600px] h-[350px] bg-orange-600/10 blur-[100px] pointer-events-none rounded-full" />

          {/* Player Wrapper Container */}
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,85,0,0.15)] bg-[#050505]">
            <Player
              ref={playerRef}
              component={LiquidGlassVideo}
              durationInFrames={1200}
              fps={60}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
              }}
              inputProps={{
                config,
              }}
              controls={false}
              autoPlay={false}
              loop
              spaceKeyToPlayOrPause
              acknowledgeRemotionLicense
            />

            {/* Specular corner accents on player */}
            <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
            <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
            <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
            <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
          </div>

          {/* Interactive Scrub Timeline & Player Controls */}
          <div className="w-full max-w-5xl mt-4 bg-[#111116]/80 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col gap-2">
            {/* Scrubber slider */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-orange-400 font-bold min-w-[70px]">
                {formattedTime}
              </span>
              <input
                type="range"
                min={0}
                max={1199}
                value={currentFrame}
                onChange={(e) => jumpToFrame(Number(e.target.value))}
                className="flex-1 accent-orange-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs text-zinc-500 min-w-[80px] text-right">
                {currentFrame} / 1200 F
              </span>
            </div>

            {/* Playback action bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black transition-colors"
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                </button>
                <button
                  onClick={() => jumpToFrame(0)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                  title="Reset to frame 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (playerRef.current) {
                      if (isMuted) playerRef.current.unmute();
                      else playerRef.current.mute();
                    }
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Scene Jump Pills */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1">
                {SCENES.slice(1).map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => jumpToFrame(scene.frame)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                      currentFrame >= scene.frame && (idx === 4 || currentFrame < SCENES[idx + 2]?.frame)
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-[0_0_8px_rgba(255,85,0,0.3)]'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {idx + 1}. {scene.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Inspector & Configuration Drawer */}
        <div className="w-full lg:w-[420px] border-l border-white/10 bg-[#0c0c11] flex flex-col h-auto lg:h-full">
          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-black/40">
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'controls'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Config</span>
            </button>
            <button
              onClick={() => setActiveTab('scenes')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'scenes'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setActiveTab('sfx')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'sfx'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>SFX</span>
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'github'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>CI/CD</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Tab 1: Live Video Configuration */}
            {activeTab === 'controls' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Video Typography & Branding
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={config.brandName}
                        onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        System Protocol Tag
                      </label>
                      <input
                        type="text"
                        value={config.systemTag}
                        onChange={(e) => setConfig({ ...config, systemTag: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Completion Emblem Title
                      </label>
                      <input
                        type="text"
                        value={config.completionTitle}
                        onChange={(e) => setConfig({ ...config, completionTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Completion Subtitle
                      </label>
                      <input
                        type="text"
                        value={config.completionSubtitle}
                        onChange={(e) => setConfig({ ...config, completionSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Neon Palette & Lighting
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="font-mono text-xs">{config.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Highlight Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.highlightColor}
                          onChange={(e) => setConfig({ ...config, highlightColor: e.target.value })}
                          className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="font-mono text-xs">{config.highlightColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setConfig(defaultVideoConfig)}
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Scene Breakdown */}
            {activeTab === 'scenes' && (
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Timeline Chapters (60 FPS = 1200 F)
                </h3>
                {SCENES.map((scene) => (
                  <div
                    key={scene.id}
                    onClick={() => jumpToFrame(scene.frame)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      currentFrame >= scene.frame && currentFrame < scene.frame + 240
                        ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(255,85,0,0.15)]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs font-bold text-white">{scene.name}</h4>
                      <span className="text-[10px] font-mono text-orange-400">Frame {scene.frame}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{scene.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Procedural SFX Audio */}
            {activeTab === 'sfx' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <h4 className="font-mono text-xs font-bold text-orange-300">
                    100% Procedural Synthesis
                  </h4>
                  <p className="mt-1 text-xs text-zinc-300">
                    No external stock assets needed. Synthesized via Node.js Buffer PCM 44.1kHz WAV. Guaranteed to build autonomously on GitHub Actions!
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'whoosh.wav', title: 'Cinematic Sub-Bass Whoosh', desc: 'Frequency dive 160Hz -> 45Hz with filtered noise', time: '1.0s' },
                    { name: 'glass_tick.wav', title: 'Crystalline Glass Tick', desc: 'High modal crystal contact click at 2640Hz/4180Hz', time: '0.2s' },
                    { name: 'charge.wav', title: 'Cyberpunk Rising Charge', desc: 'Accelerating cyber ramp 90Hz -> 680Hz with FM glitch', time: '1.4s' },
                    { name: 'success_chime.wav', title: 'Celestial Glass Chime', desc: 'Harmonic chords E5, G#5, B5, E6 with warm sub bloom', time: '2.2s' },
                  ].map((sfx) => (
                    <div key={sfx.name} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{sfx.title}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{sfx.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{sfx.desc}</p>
                      </div>
                      <button
                        onClick={() => playSfx(sfx.name)}
                        className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-mono text-xs flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Test</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => copyToClipboard('npm run generate-audio', 'gen-sfx')}
                    className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 font-mono text-xs text-white flex items-center justify-center gap-2"
                  >
                    {copiedCode === 'gen-sfx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy `npm run generate-audio`</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: GitHub Actions & Render Guide */}
            {activeTab === 'github' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-4 h-4 text-orange-400" />
                    <h4 className="font-mono text-xs font-bold text-white">
                      Automated GitHub Actions Render
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Workflow file <code className="text-orange-300">.github/workflows/render-video.yml</code> is configured to render 1080p60 MP4 with hardware ANGLE/OpenGL and upload it to Actions artifacts (30 days retention).
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Local Terminal Commands
                  </label>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 flex items-center justify-between">
                      <code>npm run render</code>
                      <button
                        onClick={() => copyToClipboard('npm run render', 'cmd1')}
                        className="p-1 hover:text-orange-400"
                      >
                        {copiedCode === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 flex items-center justify-between">
                      <code>npx remotion preview src/remotion-index.ts</code>
                      <button
                        onClick={() => copyToClipboard('npx remotion preview src/remotion-index.ts', 'cmd2')}
                        className="p-1 hover:text-orange-400"
                      >
                        {copiedCode === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-zinc-300">
                    <strong className="text-emerald-300 font-mono block">Zero External CDN Dependencies</strong>
                    Remotion, fonts, animations, and SFX are completely bundle-safe and headless-ready.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
