import React from "react"
import { DocumentIcon, HeadersIcon, VariableIcon } from "../svgs/svgs"
import { useDockStore } from "../stores/dock-store"

const SidebarRight: React.FC = () => {
  const toggleDock = useDockStore((state) => state.toggleDock)

  return (
    <div className="border-l border-surface-500/30 h-full flex flex-col justify-start items-center">

      {/* Document Panel Toggle */}
      <Button onClick={toggleDock} icon={<DocumentIcon />} />

      {/* Other icons (no action yet) */}
      <Button icon={<HeadersIcon />} />
      <Button icon={<VariableIcon />} />
    </div>
  )
}

export default SidebarRight


// ----------------------------
// Button Component
// ----------------------------
function Button({
  icon,
  onClick,
}: {
  icon?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full py-6 border-b border-surface-500/30 transition-colors flex justify-center items-center hover:bg-surface-800"
    >
      {icon}
    </button>
  )
}
