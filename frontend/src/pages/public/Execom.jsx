import { useEffect, useState } from 'react'
import { usePublicAPI } from '../../hooks/usePublicAPI'

export default function Execom() {
  const { fetchExecom, loading } = usePublicAPI()
  const [members, setMembers] = useState([])

  useEffect(() => {
    const load = async () => {
      const result = await fetchExecom()
      if (result.success) setMembers(result.data)
    }
    load()
  }, [fetchExecom])

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // Generate consistent colors based on string
  const getColor = (str) => {
    const colors = ['bg-blue-500/20 text-blue-400', 'bg-green-500/20 text-green-400', 'bg-purple-500/20 text-purple-400', 'bg-pink-500/20 text-pink-400', 'bg-yellow-500/20 text-yellow-400']
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="flex-1 w-full bg-bg-dark">
      <div className="bg-bg-card border-b border-border-subtle py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Leadership Team</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Meet the dedicated Executive Committee leading the chapter forward.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-bg-card rounded-2xl h-64 animate-pulse border border-border-subtle"></div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 bg-bg-card border border-border-subtle rounded-2xl">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-text-muted font-mono">No leadership records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map(member => (
              <div
                key={member.id}
                className="group bg-bg-card border border-border-subtle rounded-2xl p-8 text-center hover:border-accent-cyan/50 hover:shadow-glow-cyan/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-5 border border-white/5 ${getColor(member.full_name)}`}>
                  {getInitials(member.full_name)}
                </div>
                
                <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors">{member.full_name}</h3>
                
                {/* Fallback role display - in phase 6 we will add an explicit position field */}
                <p className="text-text-muted text-xs font-mono uppercase tracking-widest mb-4">Execom Member</p>
                
                <div className="space-y-2 pt-4 border-t border-border-subtle">
                  <div className="text-xs font-mono text-text-secondary flex justify-between">
                    <span>IEEE No:</span>
                    <span className="text-text-primary">{member.ieee_number || 'N/A'}</span>
                  </div>
                  <div className="text-xs font-mono text-text-secondary flex flex-col items-center pt-2">
                    <a href={`mailto:${member.email}`} className="text-accent-cyan hover:underline hover:text-accent-yellow transition-colors truncate max-w-full block">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
