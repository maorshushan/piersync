import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react'
import { useProfilesStore } from '../store/useProfilesStore'

export default function ProfileSelector({ className = '' }) {
  const {
    profiles,
    activeProfileId,
    activeProfile,
    setActiveProfile,
    addProfile,
    updateProfile,
    removeProfile
  } = useProfilesStore()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setEditingId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const startEdit = (profile) => {
    setEditingId(profile.id)
    setEditName(profile.name)
  }

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateProfile(editingId, { name: editName.trim() })
      setEditingId(null)
    }
  }

  const handleRemove = (e, id) => {
    e.stopPropagation()
    if (profiles.length <= 1) return
    removeProfile(id)
    setOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-purple/40 bg-purple-light/80 px-3 py-2 text-sm font-medium text-bg-dark hover:bg-purple-light"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select profile"
      >
        <span className="max-w-[120px] truncate">
          {activeProfile?.name ?? 'Profile'}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-purple/30 bg-purple-light py-1 shadow-lg"
          role="listbox"
        >
          {profiles.map((profile) => (
            <li
              key={profile.id}
              role="option"
              aria-selected={profile.id === activeProfileId}
              className="group flex items-center gap-2 px-3 py-2 text-sm"
            >
              {editingId === profile.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="min-w-0 flex-1 rounded border-0 bg-white/80 px-2 py-1 text-bg-dark focus:ring-1 focus:ring-purple"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProfile(profile.id)
                      setOpen(false)
                    }}
                    className="min-w-0 flex-1 truncate text-left font-medium text-bg-dark hover:underline"
                  >
                    {profile.name}
                  </button>
                  <div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEdit(profile)
                      }}
                      className="rounded p-1 text-bg-dark/60 hover:bg-purple/30 hover:text-bg-dark"
                      aria-label="Rename profile"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, profile.id)}
                      disabled={profiles.length <= 1}
                      className="rounded p-1 text-bg-dark/60 hover:bg-pink/30 hover:text-bg-dark disabled:opacity-40"
                      aria-label="Delete profile"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          <li className="border-t border-purple/20 pt-1">
            <button
              type="button"
              onClick={() => {
                addProfile()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-bg-dark/80 hover:bg-purple/20"
            >
              <Plus className="h-4 w-4" />
              New profile
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
