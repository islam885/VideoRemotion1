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
  Layers,
  Terminal,
  Github,
  CheckCircle2,
  Copy,
  Check,
  Film,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

const SHOWCASE_STYLES = [
  {
    id: 'scene1',
    number: '01',
    title: 'Liquid Biosphere Orb',
    subtitle: 'Concentric Gyroscopic Glass Loader',
    frame: 80,
    time: '00:00 - 00:05',
    type: 'Circular Orb',
    desc: 'Molten incandescent liquid core rotating inside a dual-gimbal glass sphere with speedometer ticks.',
  },
  {
    id: 'scene2',
    number: '02',
    title: 'Dual-Chamber Fluid Capsule',
    subtitle: 'Horizontal Viscous Wave Progress Bar',
    frame: 420,
    time: '00:05 - 00:10',
    type: 'Linear Capsule',
    desc: 'Thick beveled cylindrical tube with fluid wave physics, buoyant micro-bubbles, and 10 segment lights.',
  },
  {
    id: 'scene3',
    number: '03',
    title: 'Honeycomb Cyber Hex Matrix',
    subtitle: '24-Node Volumetric Glass Grid',
    frame: 720,
    time: '00:10 - 00:15',
    type: 'Hexagonal Matrix',
    desc: 'Geometric glass cells lighting up with amber neon, trailing glow, and real-time buffer telemetry.',
  },
  {
    id: 'scene4',
    number: '04',
    title: 'Radial Audio-Wave Dial',
    subtitle: '48-Band Reactive Equalizer Arc',
    frame: 1020,
    time: '00:15 - 00:20',
    type: 'Equalizer Dial',
    desc: '360° sweeping luminous cursor needle activating radiating acoustic glass bars around a central hub.',
  },
  {
    id: 'scene5',
    number: '05',
    title: 'Segmented Glass Fuel Cell',
    subtitle: 'Modular Heavy-Bevel Power Bar',
    frame: 1320,
    time: '00:20 - 00:25',
    type: 'Fuel Cell Array',
    desc: '8 heavy angled glass chambers charging sequentially with vertical energy fluid levels and kV readouts.',
  },
  {
    id: 'scene6',
    number: '06',
    title: 'Quantum Double Helix',
    subtitle: 'Intertwined Molecular Light Strands',
    frame: 1620,
    time: '00:25 - 00:30',
    type: 'Double Helix',
    desc: 'Two counter-rotating liquid neon strands connected by glowing molecular glass nodes in a glass chamber.',
  },
  {
    id: 'scene7',
    number: '07',
    title: 'Grand Harmonization & Climax',
    subtitle: 'Shockwave Ring & Master Shield Emblem',
    frame: 1920,
    time: '00:30 - 00:35',
    type: '100% Complete',
    desc: 'Dual expanding shockwaves, 40 radial sparks, monolithic glass emblem «ALL SYSTEMS COMPLETE», and soft outro fade.',
  },
];

export default function App() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'showcase' | 'sfx' | 'render' | 'archive_fix'>('showcase');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [config] = useState<VideoConfigProps>(defaultVideoConfig);

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

  // Current active scene index
  const activeStyleIndex = Math.min(6, Math.floor(currentFrame / 300));

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-200 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0d0d12]/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_12px_#ff5500] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-extrabold tracking-wider text-white">
                LIQUID GLASS // PROGRESS SHOWCASE SHOWREEL
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                35 SEC • 7 ARCHETYPES • 1080p60
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Cyberpunk Glassmorphism Progress Loaders & Bars
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('archive_fix')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Архив / Скачивание MP4</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={() => copyToClipboard('npm run render', 'render-cli')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-black font-mono font-bold text-xs transition-colors shadow-[0_0_15px_rgba(255,85,0,0.4)]"
          >
            {copiedCode === 'render-cli' ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
            <span>Render 35s MP4</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: 16:9 Video Canvas Stage */}
        <div className="flex-1 bg-black/85 flex flex-col items-center justify-center p-4 lg:p-6 relative">
          <div className="absolute w-[700px] h-[400px] bg-orange-600/10 blur-[120px] pointer-events-none rounded-full" />

          {/* Player Wrapper Container */}
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,85,0,0.15)] bg-[#050505]">
            <Player
              ref={playerRef}
              component={LiquidGlassVideo}
              durationInFrames={2100}
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

            {/* Corner cyber markers */}
            <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
            <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
            <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
            <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
          </div>

          {/* Timeline & Controls */}
          <div className="w-full max-w-5xl mt-3.5 bg-[#101015]/90 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col gap-2">
            {/* Scrubber slider */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-orange-400 font-bold min-w-[70px]">
                {formattedTime}
              </span>
              <input
                type="range"
                min={0}
                max={2099}
                value={currentFrame}
                onChange={(e) => jumpToFrame(Number(e.target.value))}
                className="flex-1 accent-orange-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs text-zinc-400 min-w-[90px] text-right">
                {currentFrame} / 2100 F
              </span>
            </div>

            {/* Controls Bar & Style Navigation Pills */}
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
                  title="Reset to start"
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

              {/* 7 Style Jump Buttons */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1">
                {SHOWCASE_STYLES.map((style, idx) => (
                  <button
                    key={style.id}
                    onClick={() => jumpToFrame(style.frame)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                      activeStyleIndex === idx
                        ? 'bg-orange-500/25 text-orange-300 border-orange-500/60 shadow-[0_0_8px_rgba(255,85,0,0.3)]'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {style.number}. {style.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Showcase Director Drawer */}
        <div className="w-full lg:w-[440px] border-l border-white/10 bg-[#0c0c11] flex flex-col h-auto lg:h-full">
          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-black/40">
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'showcase'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>7 Styles</span>
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
              onClick={() => setActiveTab('render')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'render'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>CI/CD</span>
            </button>
            <button
              onClick={() => setActiveTab('archive_fix')}
              className={`flex-1 py-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'archive_fix'
                  ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Fix Archive</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Tab 1: 7 Distinct Showcase Archetypes */}
            {activeTab === 'showcase' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>7 Distinct Progress Archetypes (35s)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">Click to Preview</span>
                </div>

                {SHOWCASE_STYLES.map((style, idx) => {
                  const isActive = activeStyleIndex === idx;

                  return (
                    <div
                      key={style.id}
                      onClick={() => jumpToFrame(style.frame)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? 'bg-orange-500/15 border-orange-500/60 shadow-[0_0_15px_rgba(255,85,0,0.18)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-black px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-orange-500 text-black' : 'bg-white/10 text-orange-400'
                          }`}>
                            {style.number}
                          </span>
                          <h4 className="font-mono text-xs font-bold text-white">{style.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{style.time}</span>
                      </div>

                      <div className="mt-1 text-[11px] font-mono text-orange-300/80">
                        {style.subtitle}
                      </div>

                      <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                        {style.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: SFX Audio */}
            {activeTab === 'sfx' && (
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <h4 className="font-mono text-xs font-bold text-orange-300">
                    100% Procedural Pure Node.js Sound
                  </h4>
                  <p className="mt-1 text-xs text-zinc-300">
                    Все звуки синтезируются математически в PCM 16-bit 44.1kHz WAV. Никаких внешних ссылок и сбоев при сборке!
                  </p>
                </div>

                {[
                  { name: 'whoosh.wav', title: 'Sub-Bass Cinematic Whoosh', desc: 'Свип 160Hz -> 45Hz на смену каждой из 7 сцен', time: '1.0s' },
                  { name: 'glass_tick.wav', title: 'Crystalline Glass Tick', desc: 'Щелчок контакта стекла (моды 2640Hz и 4180Hz)', time: '0.2s' },
                  { name: 'charge.wav', title: 'Cyber Energy Charge', desc: 'Нарастающий заряд 90Hz -> 680Hz перед кульминацией', time: '1.4s' },
                  { name: 'success_chime.wav', title: 'Celestial Glass Chime', desc: 'Гармонический аккорд E5-G#5-B5-E6 при взрыве 100%', time: '2.2s' },
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
                      <span>Play</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: CI/CD & Local Render */}
            {activeTab === 'render' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Github className="w-4 h-4 text-orange-400" />
                    <h4 className="font-mono text-xs font-bold text-white">
                      GitHub Actions Render (35s @ 60 FPS)
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Workflow <code className="text-orange-300">.github/workflows/render-video.yml</code> настроен с флагами <code className="text-zinc-200">--pixel-format=yuv420p</code>, проверкой целостности FFmpeg и <code className="text-zinc-200">compression-level: 0</code> для защиты от битых архивов.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Terminal Commands
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
              </div>
            )}

            {/* Tab 4: Archive Fix & Troubleshooting */}
            {activeTab === 'archive_fix' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <h4 className="font-mono text-xs font-bold text-amber-300">
                    Почему архив мог показаться повреждённым?
                  </h4>
                  <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                    1. <strong>Pixel format:</strong> Без явного флага <code className="text-amber-200">--pixel-format=yuv420p</code> кодек H.264 на Linux может вывести профиль, не поддерживаемый стандартным плеером Windows Media или QuickTime (он выдаёт ошибку формата).
                    <br />
                    2. <strong>Zip Compression:</strong> GitHub Actions по умолчанию повторно сжимает уже упакованный H.264 MP4. Мы отключили сжатие контейнера (<code className="text-amber-200">compression-level: 0</code>), исключив битые архивы!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-emerald-300 font-mono block">Что исправлено в воркфлоу:</strong>
                    • Добавлен строгий флаг <code className="text-white">--pixel-format=yuv420p</code> (читается на 100% любых устройств).<br />
                    • Добавлена попиксельная верификация декодирования: <code className="text-white">ffmpeg -v error -i ... -f null -</code>.<br />
                    • Установлен <code className="text-white">compression-level: 0</code> в upload-artifact.<br />
                    • Для открытия используйте <strong>VLC Media Player</strong> или стандартный плеер.
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
