import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ThemeColors } from '../utils/theme'
import {
  getActiveAmbientLayers,
  setAmbientLayerVolume,
  setAmbientVolume,
  startAmbientLayer,
  stopAllAmbientLayers,
  stopAmbientLayer,
  type AmbientLayerId,
} from '../utils/audioEngine'
import {
  IconBolt,
  IconBrain,
  IconCity,
  IconHeadphones,
  IconMusic,
  IconPlay,
  IconRain,
  IconSave,
  IconShield,
} from './Icons'

interface Props {
  theme: ThemeColors
  hidden?: boolean
}

type AudioTab = 'ambient' | 'local' | 'spotify'

interface LocalTrack {
  id: string
  name: string
  url: string
  size: string
}

const AMBIENT_LAYERS: {
  id: AmbientLayerId
  title: string
  subtitle: string
  icon: React.ReactNode
}[] = [
  {
    id: 'rain',
    title: 'Cyber Rain & Thunder',
    subtitle: 'Soft rain · low-frequency swells',
    icon: <IconRain size={23} />,
  },
  {
    id: 'gamma',
    title: '40Hz Gamma Focus',
    subtitle: 'Headphones recommended',
    icon: <IconBrain size={23} />,
  },
  {
    id: 'lofi',
    title: 'Lofi Coffee House',
    subtitle: 'Warm tape noise · soft chords',
    icon: <IconCity size={23} />,
  },
  {
    id: 'brown',
    title: 'Deep Brown Noise',
    subtitle: 'Low rumble · distraction shield',
    icon: <IconShield size={23} />,
  },
]

const SPOTIFY_PLAYLISTS = [
  {
    title: 'Deep Focus',
    subtitle: 'Minimal electronic concentration',
    color: '#60A5FA',
    url: 'https://open.spotify.com/search/deep%20focus/playlists',
  },
  {
    title: 'Lofi Beats',
    subtitle: 'Beats to study and lock in',
    color: '#FFB800',
    url: 'https://open.spotify.com/search/lofi%20beats/playlists',
  },
  {
    title: 'Synthwave Study',
    subtitle: 'Neon energy without lyrics',
    color: '#BF7FFF',
    url: 'https://open.spotify.com/search/synthwave%20study/playlists',
  },
  {
    title: 'Brain Food',
    subtitle: 'Progressive focus instrumentals',
    color: '#C8FF00',
    url: 'https://open.spotify.com/search/brain%20food/playlists',
  },
]

function SpotifyMark({ size = 24 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#1ED760',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ display: 'grid', gap: 2, transform: 'rotate(7deg)' }}>
        {[11, 9, 7].map((width) => (
          <span
            key={width}
            style={{
              display: 'block',
              width: width * (size / 24),
              height: Math.max(1, size / 18),
              borderRadius: 10,
              background: '#07150C',
            }}
          />
        ))}
      </span>
    </span>
  )
}

function Equalizer({ active, accent }: { active: boolean; accent: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        height: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {[0, 1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={active ? 'audio-eq-bar is-active' : 'audio-eq-bar'}
          style={{ background: active ? accent : '#4A4A52' }}
        />
      ))}
    </span>
  )
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FocusAudioConsole({ theme, hidden = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AudioTab>('ambient')
  const [masterVolume, setMasterVolumeState] = useState(65)
  const [activeLayers, setActiveLayers] = useState<AmbientLayerId[]>(() =>
    getActiveAmbientLayers(),
  )
  const [layerVolumes, setLayerVolumes] = useState<Record<AmbientLayerId, number>>({
    rain: 45,
    gamma: 52,
    lofi: 34,
    brown: 42,
  })
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([])
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null)
  const [localPlaying, setLocalPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const localTracksRef = useRef<LocalTrack[]>([])

  const ambientPlaying = activeLayers.length > 0
  const isPlaying = ambientPlaying || localPlaying

  const activeTitle = useMemo(() => {
    if (localPlaying && activeTrackId) {
      return localTracks.find((track) => track.id === activeTrackId)?.name || 'Local Focus Track'
    }
    if (activeLayers.length > 0) {
      return (
        AMBIENT_LAYERS.find((layer) => layer.id === activeLayers[0])?.title ||
        'Ambient Focus Mix'
      )
    }
    return '40Hz Gamma Focus'
  }, [activeLayers, activeTrackId, localPlaying, localTracks])

  useEffect(() => {
    localTracksRef.current = localTracks
  }, [localTracks])

  useEffect(() => {
    return () => {
      stopAllAmbientLayers()
      audioRef.current?.pause()
      localTracksRef.current.forEach((track) => URL.revokeObjectURL(track.url))
    }
  }, [])

  const stopLocalPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setLocalPlaying(false)
  }

  const toggleLayer = (layerId: AmbientLayerId) => {
    stopLocalPlayback()
    if (activeLayers.includes(layerId)) {
      stopAmbientLayer(layerId)
      setActiveLayers((layers) => layers.filter((layer) => layer !== layerId))
      return
    }

    const started = startAmbientLayer(layerId, layerVolumes[layerId] / 100)
    if (started) {
      setActiveLayers((layers) => [...layers, layerId])
    }
  }

  const changeLayerVolume = (layerId: AmbientLayerId, value: number) => {
    setLayerVolumes((volumes) => ({ ...volumes, [layerId]: value }))
    if (activeLayers.includes(layerId)) {
      setAmbientLayerVolume(layerId, value / 100)
    }
  }

  const togglePrimaryPlayback = () => {
    if (isPlaying) {
      stopAllAmbientLayers()
      stopLocalPlayback()
      setActiveLayers([])
      return
    }
    setActiveTab('ambient')
    const started = startAmbientLayer('gamma', layerVolumes.gamma / 100)
    if (started) setActiveLayers(['gamma'])
  }

  const changeMasterVolume = (value: number) => {
    setMasterVolumeState(value)
    setAmbientVolume(value / 100)
    if (audioRef.current) {
      audioRef.current.volume = value / 100
    }
  }

  const importLocalFiles = (files: FileList | null) => {
    if (!files?.length) return
    const importedTracks = Array.from(files).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
    }))
    setLocalTracks((tracks) => [...tracks, ...importedTracks])
    setActiveTab('local')
  }

  const playLocalTrack = async (track: LocalTrack) => {
    stopAllAmbientLayers()
    setActiveLayers([])
    const audio = audioRef.current
    if (!audio) return

    if (activeTrackId === track.id && localPlaying) {
      audio.pause()
      setLocalPlaying(false)
      return
    }

    if (activeTrackId !== track.id) {
      audio.src = track.url
      setActiveTrackId(track.id)
    }
    audio.volume = masterVolume / 100
    try {
      await audio.play()
      setLocalPlaying(true)
    } catch {
      setLocalPlaying(false)
    }
  }

  const openSpotify = (url: string) => {
    const nativeBridge = (
      window as typeof window & {
        ReactNativeWebView?: { postMessage: (payload: string) => void }
      }
    ).ReactNativeWebView
    if (nativeBridge?.postMessage) {
      nativeBridge.postMessage(JSON.stringify({ type: 'OPEN_EXTERNAL_URL', url }))
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={() => setLocalPlaying(false)}
        onPause={() => setLocalPlaying(false)}
        onPlay={() => setLocalPlaying(true)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={(event) => {
          importLocalFiles(event.target.files)
          event.target.value = ''
        }}
        style={{ display: 'none' }}
      />

      <motion.div
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -8 : 0 }}
        style={{
          position: 'fixed',
          top: 'max(62px, calc(env(safe-area-inset-top, 12px) + 48px))',
          left: '50%',
          zIndex: 65,
          width: 260,
          height: 38,
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            border: `1px solid rgba(${theme.accentRgb}, 0.3)`,
            borderRadius: 20,
            background: 'rgba(10,10,12,0.9)',
            boxShadow: `0 8px 30px rgba(0,0,0,0.38), 0 0 18px rgba(${theme.accentRgb}, 0.08)`,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            transform: 'translateX(-50%)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="interactive-btn"
            aria-label="Open focus audio console"
            style={{
              flex: 1,
              minWidth: 0,
              height: '100%',
              padding: '0 5px 0 10px',
              border: 0,
              background: 'transparent',
              color: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <IconHeadphones size={16} />
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                fontFamily: "'DM Sans'",
                fontSize: 10,
                fontWeight: 600,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeTitle}
            </span>
            <Equalizer active={isPlaying} accent={theme.accent} />
          </button>

          <button
            type="button"
            onClick={togglePrimaryPlayback}
            className="interactive-btn"
            aria-label={isPlaying ? 'Pause focus audio' : 'Play focus audio'}
            style={{
              width: 34,
              height: 30,
              border: 0,
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent',
              color: theme.accent,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {isPlaying ? (
              <span style={{ display: 'flex', gap: 2 }}>
                <span style={{ width: 2, height: 10, borderRadius: 2, background: theme.accent }} />
                <span style={{ width: 2, height: 10, borderRadius: 2, background: theme.accent }} />
              </span>
            ) : (
              <IconPlay size={13} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="interactive-btn"
            aria-label="Expand focus audio console"
            style={{
              width: 29,
              height: 30,
              border: 0,
              background: 'transparent',
              color: '#6E6E77',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 9,
              flexShrink: 0,
            }}
          >
            ▾
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 150,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.78)',
              backdropFilter: 'blur(9px)',
            }}
          >
            <motion.section
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 390, damping: 38 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 540,
                maxHeight: '88dvh',
                padding: '10px 18px max(20px, env(safe-area-inset-bottom, 20px))',
                border: `1px solid rgba(${theme.accentRgb}, 0.22)`,
                borderBottom: 0,
                borderRadius: '25px 25px 0 0',
                background:
                  `radial-gradient(circle at 100% 0%, rgba(${theme.accentRgb}, 0.09), transparent 34%), #111115`,
                boxShadow: '0 -30px 90px rgba(0,0,0,0.62)',
                overflowY: 'auto',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 38,
                  height: 3,
                  margin: '0 auto 15px',
                  borderRadius: 10,
                  background: '#36363D',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <div
                    style={{
                      width: 39,
                      height: 39,
                      border: `1px solid rgba(${theme.accentRgb}, 0.25)`,
                      borderRadius: 12,
                      background: `rgba(${theme.accentRgb}, 0.09)`,
                      color: theme.accent,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconHeadphones size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: theme.accent,
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 7,
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Audio trinity
                    </div>
                    <div
                      style={{
                        overflow: 'hidden',
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 22,
                        fontWeight: 900,
                        lineHeight: 1,
                        textOverflow: 'ellipsis',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {activeTitle}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Equalizer active={isPlaying} accent={theme.accent} />
                  <button
                    type="button"
                    onClick={togglePrimaryPlayback}
                    className="interactive-btn"
                    aria-label={isPlaying ? 'Pause all audio' : 'Play focus audio'}
                    style={{
                      width: 38,
                      height: 38,
                      border: 0,
                      borderRadius: '50%',
                      background: theme.accent,
                      color: '#080808',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {isPlaying ? (
                      <span style={{ display: 'flex', gap: 3 }}>
                        <span style={{ width: 3, height: 12, borderRadius: 2, background: '#080808' }} />
                        <span style={{ width: 3, height: 12, borderRadius: 2, background: '#080808' }} />
                      </span>
                    ) : (
                      <IconPlay size={15} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="interactive-btn"
                    aria-label="Close audio console"
                    style={{
                      width: 34,
                      height: 34,
                      border: '1px solid #29292F',
                      borderRadius: 10,
                      background: '#19191D',
                      color: '#85858E',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      fontSize: 17,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 5,
                  marginTop: 18,
                  padding: 4,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  background: '#0A0A0D',
                }}
              >
                {[
                  { id: 'ambient' as const, label: 'Ambient', icon: <IconRain size={13} /> },
                  { id: 'local' as const, label: 'Local files', icon: <IconSave size={13} /> },
                  { id: 'spotify' as const, label: 'Spotify', icon: <SpotifyMark size={13} /> },
                ].map((tab) => {
                  const selected = activeTab === tab.id
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="interactive-btn"
                      style={{
                        height: 36,
                        border: selected
                          ? `1px solid rgba(${theme.accentRgb}, 0.26)`
                          : '1px solid transparent',
                        borderRadius: 9,
                        background: selected ? `rgba(${theme.accentRgb}, 0.1)` : 'transparent',
                        color: selected ? theme.accent : '#696972',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'ambient' && (
                  <motion.div
                    key="ambient"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    style={{ display: 'grid', gap: 8, marginTop: 14 }}
                  >
                    {AMBIENT_LAYERS.map((layer) => {
                      const active = activeLayers.includes(layer.id)
                      return (
                        <div
                          key={layer.id}
                          style={{
                            padding: 12,
                            border: active
                              ? `1px solid rgba(${theme.accentRgb}, 0.3)`
                              : '1px solid rgba(255,255,255,0.065)',
                            borderRadius: 13,
                            background: active
                              ? `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.075), #0D0D10 62%)`
                              : '#0D0D10',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button
                              type="button"
                              onClick={() => toggleLayer(layer.id)}
                              className="interactive-btn"
                              aria-label={`${active ? 'Pause' : 'Play'} ${layer.title}`}
                              style={{
                                width: 38,
                                height: 38,
                                border: active
                                  ? `1px solid rgba(${theme.accentRgb}, 0.35)`
                                  : '1px solid #27272D',
                                borderRadius: 11,
                                background: active ? theme.accent : '#18181C',
                                color: active ? '#080808' : '#777780',
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            >
                              {active ? (
                                <Equalizer active accent="#080808" />
                              ) : (
                                layer.icon
                              )}
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  overflow: 'hidden',
                                  color: active ? '#F5F5F5' : '#C2C2C7',
                                  fontFamily: "'Barlow Condensed'",
                                  fontSize: 15,
                                  fontWeight: 800,
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {layer.title}
                              </div>
                              <div style={{ marginTop: 2, color: '#5D5D66', fontSize: 8 }}>
                                {layer.subtitle}
                              </div>
                            </div>
                            <div
                              style={{
                                color: active ? theme.accent : '#5D5D66',
                                fontFamily: "'JetBrains Mono'",
                                fontSize: 8,
                                fontWeight: 700,
                              }}
                            >
                              {layerVolumes[layer.id]}%
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={layerVolumes[layer.id]}
                            aria-label={`${layer.title} volume`}
                            onChange={(event) =>
                              changeLayerVolume(layer.id, Number(event.target.value))
                            }
                            style={{
                              width: '100%',
                              marginTop: 10,
                              accentColor: theme.accent,
                              cursor: 'pointer',
                            }}
                          />
                        </div>
                      )
                    })}
                  </motion.div>
                )}

                {activeTab === 'local' && (
                  <motion.div
                    key="local"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    style={{ marginTop: 14 }}
                  >
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="interactive-btn"
                      style={{
                        width: '100%',
                        minHeight: 78,
                        border: `1px dashed rgba(${theme.accentRgb}, 0.3)`,
                        borderRadius: 14,
                        background: `rgba(${theme.accentRgb}, 0.035)`,
                        color: theme.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 9,
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      <IconSave size={20} />
                      Choose audio files from phone
                    </button>

                    <div style={{ display: 'grid', gap: 7, marginTop: 11 }}>
                      {localTracks.map((track, index) => {
                        const active = track.id === activeTrackId && localPlaying
                        return (
                          <button
                            type="button"
                            key={track.id}
                            onClick={() => void playLocalTrack(track)}
                            className="interactive-btn"
                            style={{
                              width: '100%',
                              padding: 11,
                              border: active
                                ? `1px solid rgba(${theme.accentRgb}, 0.3)`
                                : '1px solid rgba(255,255,255,0.065)',
                              borderRadius: 12,
                              background: active ? `rgba(${theme.accentRgb}, 0.065)` : '#0D0D10',
                              color: '#F5F5F5',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                background: active ? theme.accent : '#1A1A1F',
                                color: active ? '#080808' : '#73737C',
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {active ? (
                                <Equalizer active accent="#080808" />
                              ) : (
                                <IconMusic size={16} />
                              )}
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span
                                style={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  fontFamily: "'DM Sans'",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {track.name}
                              </span>
                              <span
                                style={{
                                  display: 'block',
                                  marginTop: 3,
                                  color: '#5D5D66',
                                  fontFamily: "'JetBrains Mono'",
                                  fontSize: 7,
                                }}
                              >
                                TRACK {String(index + 1).padStart(2, '0')} · {track.size}
                              </span>
                            </span>
                            <span style={{ color: active ? theme.accent : '#5D5D66' }}>
                              {active ? 'Ⅱ' : '▶'}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {localTracks.length === 0 && (
                      <div
                        style={{
                          padding: '35px 20px',
                          color: '#5D5D66',
                          textAlign: 'center',
                          fontSize: 9,
                          lineHeight: 1.6,
                        }}
                      >
                        Your selected tracks stay on this device and are never uploaded.
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'spotify' && (
                  <motion.div
                    key="spotify"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    style={{ marginTop: 14 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        padding: 13,
                        border: '1px solid rgba(30,215,96,0.2)',
                        borderRadius: 13,
                        background: 'rgba(30,215,96,0.055)',
                      }}
                    >
                      <SpotifyMark size={32} />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: "'Barlow Condensed'",
                            fontSize: 15,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}
                        >
                          Spotify handoff
                        </div>
                        <div style={{ marginTop: 2, color: '#68716B', fontSize: 8 }}>
                          Opens your selected focus playlist in Spotify.
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '4px 7px',
                          borderRadius: 7,
                          background: 'rgba(30,215,96,0.1)',
                          color: '#1ED760',
                          fontFamily: "'JetBrains Mono'",
                          fontSize: 7,
                          fontWeight: 900,
                          letterSpacing: '0.08em',
                        }}
                      >
                        READY
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                      {SPOTIFY_PLAYLISTS.map((playlist) => (
                        <button
                          type="button"
                          key={playlist.title}
                          onClick={() => openSpotify(playlist.url)}
                          className="interactive-btn"
                          style={{
                            minHeight: 91,
                            padding: 12,
                            border: `1px solid ${playlist.color}24`,
                            borderRadius: 13,
                            background: `linear-gradient(145deg, ${playlist.color}12, #0D0D10 65%)`,
                            color: '#F5F5F5',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 8,
                              background: `${playlist.color}1A`,
                              color: playlist.color,
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <IconBolt size={13} />
                          </span>
                          <span>
                            <span
                              style={{
                                display: 'block',
                                fontFamily: "'Barlow Condensed'",
                                fontSize: 13,
                                fontWeight: 800,
                              }}
                            >
                              {playlist.title}
                            </span>
                            <span
                              style={{
                                display: 'block',
                                marginTop: 2,
                                color: '#61616A',
                                fontSize: 7,
                                lineHeight: 1.4,
                              }}
                            >
                              {playlist.subtitle}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openSpotify('https://open.spotify.com/search/focus/playlists')}
                      className="interactive-btn"
                      style={{
                        width: '100%',
                        height: 47,
                        marginTop: 10,
                        border: 0,
                        borderRadius: 12,
                        background: '#1ED760',
                        color: '#07150C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 13,
                        fontWeight: 900,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      <SpotifyMark size={18} />
                      Open Spotify & lock in
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 15,
                  padding: '12px 13px',
                  border: '1px solid rgba(255,255,255,0.065)',
                  borderRadius: 13,
                  background: '#0B0B0E',
                }}
              >
                <IconHeadphones size={16} />
                <span
                  style={{
                    color: '#777780',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 7,
                    fontWeight: 800,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Master
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  aria-label="Master audio volume"
                  onChange={(event) => changeMasterVolume(Number(event.target.value))}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    accentColor: theme.accent,
                    cursor: 'pointer',
                  }}
                />
                <span
                  style={{
                    width: 27,
                    color: theme.accent,
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 8,
                    fontWeight: 800,
                    textAlign: 'right',
                  }}
                >
                  {masterVolume}%
                </span>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
