import React from 'react'

export const SkeletonCard: React.FC = () => (
  <div className="glass-card rounded-2xl p-4 animate-pulse space-y-3">
    <div className="h-48 bg-white/10 rounded-xl" />
    <div className="h-4 bg-white/10 rounded w-3/4" />
    <div className="h-4 bg-white/10 rounded w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-6 bg-white/10 rounded w-1/4" />
    </div>
    <div className="h-9 bg-white/10 rounded-xl" />
  </div>
)
