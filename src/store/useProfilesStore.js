import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEY, DATA_VERSION } from '../constants'

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const defaultProfile = () => ({
  id: generateId(),
  name: 'Default',
  piercings: []
})

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const profile = defaultProfile()
      return {
        version: DATA_VERSION,
        profiles: [profile],
        activeProfileId: profile.id
      }
    }
    const parsed = JSON.parse(raw)
    if (parsed.profiles?.length) {
      const active =
        parsed.activeProfileId && parsed.profiles.some((p) => p.id === parsed.activeProfileId)
          ? parsed.activeProfileId
          : parsed.profiles[0].id
      return { ...parsed, activeProfileId: active }
    }
    const profile = defaultProfile()
    return {
      version: DATA_VERSION,
      profiles: [profile],
      activeProfileId: profile.id
    }
  } catch {
    const profile = defaultProfile()
    return {
      version: DATA_VERSION,
      profiles: [profile],
      activeProfileId: profile.id
    }
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Piersync: failed to persist', e)
  }
}

export function useProfilesStore() {
  const [state, setState] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  const { profiles, activeProfileId } = state
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0]
  const piercings = activeProfile?.piercings ?? []

  const updateActiveProfile = useCallback((updater) => {
    setState((prev) => {
      const next = { ...prev }
      next.profiles = prev.profiles.map((p) =>
        p.id === prev.activeProfileId ? updater(p) : p
      )
      return next
    })
  }, [])

  const addPiercing = useCallback((payload) => {
    const id = `p-${generateId()}`
    const piercing = {
      id,
      status: payload.status ?? 'wishlist',
      label: payload.label ?? '',
      type: payload.type ?? 'custom',
      style: payload.style ?? 'stud',
      x: payload.x ?? 0,
      y: payload.y ?? 0,
      rotation: payload.rotation ?? 0,
      size: payload.size ?? 3,
      fixed: payload.fixed ?? false,
      ear: payload.ear ?? 'left'
    }
    updateActiveProfile((p) => ({
      ...p,
      piercings: [...p.piercings, piercing]
    }))
    return id
  }, [updateActiveProfile])

  const updatePiercing = useCallback((id, updates) => {
    updateActiveProfile((p) => ({
      ...p,
      piercings: p.piercings.map((pi) => (pi.id === id ? { ...pi, ...updates } : pi))
    }))
  }, [updateActiveProfile])

  const removePiercing = useCallback((id) => {
    updateActiveProfile((p) => ({
      ...p,
      piercings: p.piercings.filter((pi) => pi.id !== id)
    }))
  }, [updateActiveProfile])

  const cycleStatus = useCallback((id) => {
    const order = ['owned', 'wishlist']
    updateActiveProfile((p) => ({
      ...p,
      piercings: p.piercings.map((pi) => {
        if (pi.id !== id) return pi
        const i = order.indexOf(pi.status)
        return { ...pi, status: order[(i + 1) % order.length] }
      })
    }))
  }, [updateActiveProfile])

  const addProfile = useCallback((name = 'New profile') => {
    const newProfile = { id: generateId(), name, piercings: [] }
    setState((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id
    }))
    return newProfile.id
  }, [])

  const setActiveProfile = useCallback((profileId) => {
    setState((prev) => {
      if (!prev.profiles.some((p) => p.id === profileId)) return prev
      return { ...prev, activeProfileId: profileId }
    })
  }, [])

  const updateProfile = useCallback((profileId, updates) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === profileId ? { ...p, ...updates } : p
      )
    }))
  }, [])

  const removeProfile = useCallback((profileId) => {
    setState((prev) => {
      if (prev.profiles.length <= 1) return prev
      const nextProfiles = prev.profiles.filter((p) => p.id !== profileId)
      const wasActive = prev.activeProfileId === profileId
      return {
        ...prev,
        profiles: nextProfiles,
        activeProfileId: wasActive ? nextProfiles[0].id : prev.activeProfileId
      }
    })
  }, [])

  return {
    profiles,
    activeProfile,
    activeProfileId,
    piercings,
    addPiercing,
    updatePiercing,
    removePiercing,
    cycleStatus,
    addProfile,
    setActiveProfile,
    updateProfile,
    removeProfile
  }
}
