import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePublicAPI } from '../../hooks/usePublicAPI'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchEvent } = usePublicAPI()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = await fetchEvent(id)
      if (result.success) {
        setEvent(result.data)
      } else {
        navigate('/events', { replace: true })
      }
      setLoading(false)
    }
    load()
  }, [id, fetchEvent, navigate])

  if (loading) {
    return (
      <div className="flex-1 w-full bg-bg-dark min-h-screen py-24 px-6 flex justify-center">
        <div className="max-w-4xl w-full animate-pulse space-y-8">
          <div className="w-32 h-4 bg-bg-card rounded"></div>
          <div className="w-full h-16 bg-bg-card rounded-2xl"></div>
          <div className="w-full h-96 bg-bg-card rounded-3xl"></div>
        </div>
      </div>
    )
  }
  
  if (!event) return null

  const isUpcoming = new Date(event.date_start) > new Date()

  return (
    <div className="flex-1 w-full bg-bg-dark min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/events" className="group inline-flex items-center gap-2 text-text-muted hover:text-accent-cyan text-sm font-mono tracking-wide mb-8 transition-colors">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Events Directory
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Main Content Column */}
          <div className="lg:w-2/3 w-full">
            <div className="flex flex-wrap gap-3 mb-6">
              {isUpcoming && (
                <span className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-mono font-bold tracking-widest uppercase rounded-full">
                  Upcoming Event
                </span>
              )}
              <span className="px-3 py-1 bg-bg-deeper border border-border-subtle text-text-secondary text-xs font-mono font-bold tracking-widest uppercase rounded-full">
                {event.mode}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8 leading-tight">{event.name}</h1>

            {event.poster_url && (
              <div className="w-full rounded-3xl overflow-hidden bg-bg-deeper border border-border-subtle shadow-2xl mb-12 relative group">
                <img
                  src={event.poster_url}
                  alt={event.name}
                  className="w-full h-auto max-h-[600px] object-contain group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            )}

            {/* Description */}
            {event.description && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-accent-cyan rounded-full"></span>
                  About This Event
                </h2>
                <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-4">
                  {event.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Files / Resources */}
            {event.event_files && event.event_files.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-accent-yellow rounded-full"></span>
                  Event Resources
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.event_files.map(file => {
                    const isPdf = file.file_type.includes('pdf') || file.file_type.includes('proceedings')
                    const icon = isPdf ? '📄' : '🖼️'
                    
                    return (
                      <a
                        key={file.file_type + file.file_name}
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 bg-bg-card border border-border-subtle rounded-2xl p-5 hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all duration-300"
                      >
                        <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</div>
                        <div className="overflow-hidden">
                          <p className="text-text-primary font-bold text-sm mb-1 truncate group-hover:text-accent-cyan transition-colors">{file.file_name}</p>
                          <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest">
                            {file.file_type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-1/3 w-full space-y-6 lg:sticky lg:top-28">
            {/* Essential Info Card */}
            <div className="bg-bg-card border border-border-subtle rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-bold text-text-primary mb-6 border-b border-border-subtle pb-4">Event Details</h3>
              
              <ul className="space-y-6">
                {event.date_start && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-cyan/10 text-accent-cyan flex items-center justify-center text-lg flex-shrink-0">📅</div>
                    <div>
                      <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest mb-1">Start Date</p>
                      <p className="text-text-primary font-bold text-sm">
                        {new Date(event.date_start).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </li>
                )}
                
                {event.date_end && event.date_end !== event.date_start && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg-deeper text-text-muted flex items-center justify-center text-lg flex-shrink-0">🏁</div>
                    <div>
                      <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest mb-1">End Date</p>
                      <p className="text-text-primary font-bold text-sm">
                        {new Date(event.date_end).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </li>
                )}

                {event.venue && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-yellow/10 text-accent-yellow flex items-center justify-center text-lg flex-shrink-0">📍</div>
                    <div>
                      <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest mb-1">Venue</p>
                      <p className="text-text-primary font-bold text-sm leading-snug">{event.venue}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Organizers Card */}
            <div className="bg-bg-card border border-border-subtle rounded-3xl p-8">
              <h3 className="text-lg font-bold text-text-primary mb-6 border-b border-border-subtle pb-4">Organized By</h3>
              
              {event.profiles && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-bg-deeper border border-border-subtle flex items-center justify-center text-text-primary font-bold">
                    {event.profiles.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-text-primary font-bold text-sm mb-0.5">{event.profiles.full_name}</p>
                    <p className="text-text-muted font-mono text-[10px] tracking-widest uppercase">Lead Organizer</p>
                  </div>
                </div>
              )}

              {event.event_collaborators && event.event_collaborators.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border-subtle/50">
                  <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest mb-3">In Collaboration With</p>
                  {event.event_collaborators.map((collab, i) => (
                    <div key={i} className="flex flex-col">
                      {collab.ou_name && (
                        <span className="text-text-primary text-sm font-semibold">{collab.ou_name}</span>
                      )}
                      {collab.ou_code && (
                        <span className="text-text-muted font-mono text-[10px]">{collab.ou_code}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Contact Support */}
            <div className="bg-gradient-to-br from-bg-deeper to-bg-card border border-border-subtle rounded-3xl p-8 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-text-primary font-bold text-sm mb-2">Have questions?</h3>
              <p className="text-text-secondary text-xs mb-4">Reach out to us regarding this event.</p>
              <Link to="/contact" className="inline-block px-6 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-gray-200 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
