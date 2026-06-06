import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicAPI } from '../../hooks/usePublicAPI'

export default function Events() {
  const { fetchPublishedEvents, loading } = usePublicAPI()
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('all') // all, upcoming, past

  useEffect(() => {
    const load = async () => {
      const result = await fetchPublishedEvents()
      if (result.success) setEvents(result.data)
    }
    load()
  }, [fetchPublishedEvents])

  const filteredEvents = events.filter(evt => {
    if (filter === 'all') return true
    const isUpcoming = new Date(evt.date_start) > new Date()
    return filter === 'upcoming' ? isUpcoming : !isUpcoming
  })

  return (
    <div className="flex-1 w-full bg-bg-dark min-h-screen">
      <div className="bg-bg-card border-b border-border-subtle py-16 px-6">
        <div className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Events Directory</h1>
            <p className="text-text-secondary text-lg max-w-xl">
              Browse our catalog of workshops, seminars, and technical gatherings.
            </p>
          </div>
          
          <div className="flex bg-bg-deeper p-1 rounded-btn border border-border-subtle">
            {['all', 'upcoming', 'past'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-btn text-sm font-mono tracking-wide transition-all ${
                  filter === f 
                    ? 'bg-bg-card text-text-primary shadow-sm border border-border-subtle' 
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="w-full h-48 bg-bg-card border border-border-subtle rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-24 bg-bg-card border border-border-subtle rounded-2xl">
            <p className="text-text-muted font-mono text-lg mb-2">No {filter !== 'all' ? filter : ''} events found.</p>
            <button onClick={() => setFilter('all')} className="text-accent-cyan hover:underline text-sm font-mono">
              View all events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map(event => {
              const isUpcoming = new Date(event.date_start) > new Date()
              
              return (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="list-item group block bg-bg-card border border-border-subtle rounded-2xl overflow-hidden hover:border-accent-cyan/40 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Poster Column */}
                    <div className="md:w-64 h-48 md:h-auto bg-bg-deeper relative flex-shrink-0 border-b md:border-b-0 md:border-r border-border-subtle overflow-hidden">
                      {event.poster_url ? (
                        <img
                          src={event.poster_url}
                          alt={event.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted opacity-30">
                          <span className="text-5xl mb-2">📅</span>
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        {isUpcoming && (
                          <span className="px-2.5 py-1 bg-accent-cyan/90 text-[#0a0e1a] text-[10px] font-bold font-mono tracking-widest uppercase rounded-full shadow-lg backdrop-blur-sm">
                            Upcoming
                          </span>
                        )}
                        <span className="px-2.5 py-1 bg-bg-dark/80 text-white border border-border-subtle text-[10px] font-bold font-mono tracking-widest uppercase rounded-full shadow-lg backdrop-blur-sm">
                          {event.mode}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Column */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted mb-3">
                        {event.date_start && (
                          <div className="flex items-center gap-1.5 text-accent-cyan">
                            <span>📅</span> {new Date(event.date_start).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center gap-1.5">
                            <span>📍</span> <span className="truncate max-w-[200px]">{event.venue}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-cyan transition-colors">{event.name}</h3>
                      <p className="text-text-secondary leading-relaxed line-clamp-2 mb-6 flex-1">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
                        <div className="text-sm font-mono text-text-muted">
                          Organized by {event.profiles?.full_name?.split(' ')[0] || 'Chapter'}
                        </div>
                        <div className="text-sm font-mono font-bold text-accent-cyan flex items-center gap-2 group-hover:gap-3 transition-all">
                          Read Details <span>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
