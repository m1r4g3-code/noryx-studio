export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-border border-t-gold rounded-full animate-spin" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-text-muted font-body">
          Loading
        </span>
      </div>
    </div>
  )
}
