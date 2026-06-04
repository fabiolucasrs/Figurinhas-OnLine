import React from 'react'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '📭',
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <span className="text-5xl">{emoji}</span>
    <div className="space-y-1">
      <h3 className="font-display font-bold text-white text-lg">{title}</h3>
      {description && <p className="text-sm text-slate-400 max-w-xs">{description}</p>}
    </div>
    {action}
  </div>
)
