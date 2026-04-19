export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Loading FlowZen AI</h2>
          <p className="text-slate-400">Preparing your smart crowd management experience...</p>
        </div>
      </div>
    </div>
  )
}