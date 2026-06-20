import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"

type LucideCardIconProps = {
  fallbackEmoji?: string
  name: string
}

const iconNameSet = new Set<string>(iconNames)

export function LucideCardIcon({ fallbackEmoji, name }: LucideCardIconProps) {
  const iconName = getLucideIconName(name)

  if (!iconName) {
    return fallbackEmoji ? (
      <span className="poster-card-emoji">{fallbackEmoji}</span>
    ) : null
  }

  return (
    <span className="poster-card-icon">
      <DynamicIcon name={iconName} />
    </span>
  )
}

function getLucideIconName(name: string): IconName | null {
  const normalized = name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()

  return iconNameSet.has(normalized) ? (normalized as IconName) : null
}
