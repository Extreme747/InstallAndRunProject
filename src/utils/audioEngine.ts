let audioContext: AudioContext | null = null
let masterGainNode: GainNode | null = null
let masterVolume = 0.65

export type AmbientLayerId = 'rain' | 'gamma' | 'lofi' | 'brown'

interface AmbientLayer {
  nodes: AudioNode[]
  gain: GainNode
  volume: number
}

const activeLayers = new Map<AmbientLayerId, AmbientLayer>()

export interface SoundPackPreset {
  id: string
  label: string
  icon: string
  desc: string
}

export const SOUND_PRESETS: SoundPackPreset[] = [
  { id: 'rain', label: 'Rain', icon: '🌧️', desc: 'Cyber Rain & Thunder' },
  { id: 'gamma', label: '40Hz', icon: '🧠', desc: 'Gamma Focus Binaural' },
  { id: 'lofi', label: 'Lofi', icon: '🎵', desc: 'Lofi Coffee House' },
  { id: 'brown', label: 'Brown', icon: '🛡️', desc: 'Deep Brown Noise' },
]

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new AudioContextClass()
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
  return audioContext
}

function getMasterGain(context: AudioContext) {
  if (!masterGainNode) {
    masterGainNode = context.createGain()
    masterGainNode.gain.setValueAtTime(masterVolume, context.currentTime)
    masterGainNode.connect(context.destination)
  }
  return masterGainNode
}

function createBrownNoise(context: AudioContext, intensity = 3.2) {
  const bufferSize = context.sampleRate * 2
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate)
  const output = noiseBuffer.getChannelData(0)
  let lastOutput = 0

  for (let index = 0; index < bufferSize; index += 1) {
    const white = Math.random() * 2 - 1
    output[index] = (lastOutput + 0.02 * white) / 1.02
    lastOutput = output[index]
    output[index] *= intensity
  }

  const source = context.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true
  return source
}

function connectRainLayer(context: AudioContext, gain: GainNode) {
  const noise = createBrownNoise(context, 3.5)
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(920, context.currentTime)

  const swell = context.createOscillator()
  const swellGain = context.createGain()
  swell.frequency.setValueAtTime(0.17, context.currentTime)
  swellGain.gain.setValueAtTime(280, context.currentTime)
  swell.connect(swellGain)
  swellGain.connect(filter.frequency)

  noise.connect(filter)
  filter.connect(gain)
  noise.start()
  swell.start()
  return [noise, swell, filter, swellGain]
}

function connectGammaLayer(context: AudioContext, gain: GainNode) {
  const left = context.createOscillator()
  const right = context.createOscillator()
  left.type = 'sine'
  right.type = 'sine'
  left.frequency.setValueAtTime(180, context.currentTime)
  right.frequency.setValueAtTime(220, context.currentTime)

  if (context.createStereoPanner) {
    const leftPanner = context.createStereoPanner()
    const rightPanner = context.createStereoPanner()
    leftPanner.pan.setValueAtTime(-1, context.currentTime)
    rightPanner.pan.setValueAtTime(1, context.currentTime)
    left.connect(leftPanner)
    right.connect(rightPanner)
    leftPanner.connect(gain)
    rightPanner.connect(gain)
    left.start()
    right.start()
    return [left, right, leftPanner, rightPanner]
  }

  left.connect(gain)
  right.connect(gain)
  left.start()
  right.start()
  return [left, right]
}

function connectLofiLayer(context: AudioContext, gain: GainNode) {
  const noise = createBrownNoise(context, 1.25)
  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(720, context.currentTime)
  filter.Q.setValueAtTime(0.55, context.currentTime)
  noise.connect(filter)
  filter.connect(gain)

  const chordFrequencies = [110, 138.59, 164.81]
  const chordNodes = chordFrequencies.map((frequency) => {
    const oscillator = context.createOscillator()
    const chordGain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    chordGain.gain.setValueAtTime(0.055, context.currentTime)
    oscillator.connect(chordGain)
    chordGain.connect(gain)
    oscillator.start()
    return [oscillator, chordGain] as AudioNode[]
  })

  noise.start()
  return [noise, filter, ...chordNodes.flat()]
}

function connectBrownLayer(context: AudioContext, gain: GainNode) {
  const noise = createBrownNoise(context, 4)
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(360, context.currentTime)
  noise.connect(filter)
  filter.connect(gain)
  noise.start()
  return [noise, filter]
}

export function startAmbientLayer(layerId: AmbientLayerId, volume = 0.45) {
  try {
    if (activeLayers.has(layerId)) {
      setAmbientLayerVolume(layerId, volume)
      return true
    }

    const context = getAudioContext()
    const layerGain = context.createGain()
    const safeVolume = Math.max(0, Math.min(1, volume))
    layerGain.gain.setValueAtTime(safeVolume, context.currentTime)
    layerGain.connect(getMasterGain(context))

    const nodes =
      layerId === 'rain'
        ? connectRainLayer(context, layerGain)
        : layerId === 'gamma'
          ? connectGammaLayer(context, layerGain)
          : layerId === 'lofi'
            ? connectLofiLayer(context, layerGain)
            : connectBrownLayer(context, layerGain)

    activeLayers.set(layerId, { nodes, gain: layerGain, volume: safeVolume })
    return true
  } catch (error) {
    console.warn('Ambient layer failed to start:', error)
    return false
  }
}

export function stopAmbientLayer(layerId: AmbientLayerId) {
  const layer = activeLayers.get(layerId)
  if (!layer) return

  layer.nodes.forEach((node) => {
    try {
      ;(node as AudioScheduledSourceNode).stop?.()
    } catch {}
    try {
      node.disconnect()
    } catch {}
  })
  try {
    layer.gain.disconnect()
  } catch {}
  activeLayers.delete(layerId)
}

export function setAmbientLayerVolume(layerId: AmbientLayerId, volume: number) {
  const layer = activeLayers.get(layerId)
  if (!layer || !audioContext) return
  const safeVolume = Math.max(0, Math.min(1, volume))
  layer.volume = safeVolume
  layer.gain.gain.setTargetAtTime(safeVolume, audioContext.currentTime, 0.025)
}

export function setAmbientVolume(volume: number) {
  masterVolume = Math.max(0, Math.min(1, volume))
  if (masterGainNode && audioContext) {
    masterGainNode.gain.setTargetAtTime(masterVolume, audioContext.currentTime, 0.025)
  }
}

export function getActiveAmbientLayers() {
  return Array.from(activeLayers.keys())
}

export function stopAllAmbientLayers() {
  Array.from(activeLayers.keys()).forEach(stopAmbientLayer)
}

function normalizeLegacyPackId(packId: string): AmbientLayerId {
  if (packId === 'binaural' || packId === 'alpha' || packId === 'white-noise') return 'gamma'
  if (packId === 'lo-fi-rain' || packId === 'ocean' || packId === 'ocean-waves') return 'rain'
  if (packId === 'cyberpunk' || packId === 'cyber-synth' || packId === '432hz') return 'lofi'
  if (packId === 'brown-noise') return 'brown'
  return packId as AmbientLayerId
}

export function playAmbientPack(packId: string) {
  stopAllAmbientLayers()
  return startAmbientLayer(normalizeLegacyPackId(packId), 0.55)
}

export function stopAmbientPack() {
  stopAllAmbientLayers()
}

export function getCurrentPlayingPackId() {
  return getActiveAmbientLayers()[0] || null
}
