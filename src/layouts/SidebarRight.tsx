import { ListCheck, Settings } from "lucide-react"

const SidebarRight: React.FC = () => {

    return (
        <div className="space-y-2 gap-1 px-1 py-2 border-l border-surface-500/30 h-full flex flex-col justify-start items-center">
            <ListCheck />
            <Settings />
        </div>
    )
}

export default SidebarRight;