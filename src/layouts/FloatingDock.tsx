import { Rnd } from "react-rnd"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useDockStore } from "../stores/dock-store"
import { useEffect } from "react"
import DocumentDisplay from "./DocumentDisplay"

export function FloatingDock() {
  const {
    open,
    x,
    y,
    width,
    height,
    setPosition,
    setSize,
    closeDock,
    toggleDock,
  } = useDockStore()

  // keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "d") {
        e.preventDefault()
        toggleDock()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleDock])

  if (!open) return null

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(_, d) => setPosition(d.x, Math.max(0, d.y))}
      onResizeStop={(_, __, ref, ___, pos) => {
        setSize(parseFloat(ref.style.width), parseFloat(ref.style.height))
        setPosition(pos.x, pos.y)
      }}
      minWidth={450}
      minHeight={370}
      bounds="window"
      dragHandleClassName="dock-header"
      style={{ position: "fixed", zIndex: 9999 }}
      className="rounded-lg shadow-xl border border-surface-500/30 bg-surface-800"
    >
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="dock-header flex items-center justify-between px-3 py-1.5 border-b border-surface-500/30 cursor-grab active:cursor-grabbing select-none">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-200/80 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Documentation
          </span>

          <span className="ml-auto px-4 text-xs text-surface-500 truncate">
            Drag header to move · Resize from any edge · <span className="bg-black/10 px-1 py-0.5">Shift + Alt + D</span> to close
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              closeDock()
            }}
            className="h-6 w-6 inline-flex items-center justify-center rounded-md border border-surface-500/30 hover:bg-red-500/20 hover:text-red-200"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4">
          <DocumentDisplay /> 
        </div>
      </div>
    </Rnd>
  )
}
