import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicAPI } from '../../hooks/usePublicAPI'

export default function Home() {
  const { fetchPublishedEvents } = usePublicAPI()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = await fetchPublishedEvents()
      if (result.success) setEvents(result.data.slice(0, 3))
      setLoading(false)
    }
    load()
  }, [fetchPublishedEvents])

  return (
    <div className="flex-1 w-full overflow-hidden">
      <section className="relative bg-gradient-to-br from-[#0a0e1a] via-[#101426] to-[#0a0e1a] py-32 px-6 overflow-hidden min-h-[85vh] flex items-center">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-cyan/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent-yellow/5 blur-[120px]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono font-bold tracking-widest uppercase mb-8 shadow-glow-cyan/20">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            Govt. Engineering College Idukki
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight tracking-tight">
            Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-yellow">Innovators</span>
          </h1>
          
          <p className="text-text-secondary text-lg md:text-xl mb-12 max-w-3xl leading-relaxed">
            Join the premier technical community for computer science students. Build your skills, network with industry leaders, and collaborate on projects that matter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
            <Link
              to="/events"
              className="px-8 py-4 bg-accent-cyan text-[#0a0e1a] font-bold text-lg rounded-btn hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex justify-center items-center gap-2"
            >
              Explore Events <span>→</span>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-border-subtle text-text-primary font-bold text-lg rounded-btn hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all duration-300 w-full sm:w-auto flex justify-center items-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-bg-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">Upcoming & Recent Events</h2>
              <p className="text-text-secondary text-lg">Discover workshops, hackathons, and tech talks curated for you.</p>
            </div>
            <Link to="/events" className="hidden md:flex text-accent-cyan hover:text-accent-yellow transition-colors items-center gap-2 font-mono text-sm tracking-wide group">
              View all calendar <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-bg-card rounded-2xl h-80 animate-pulse border border-border-subtle"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-12 text-center">
              <p className="text-text-muted font-mono mb-2">No published events found.</p>
              <p className="text-text-secondary text-sm">Our team is planning exciting things. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="list-item group bg-bg-card border border-border-subtle rounded-2xl overflow-hidden hover:border-accent-cyan/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-48 overflow-hidden bg-bg-deeper">
                    {event.poster_url ? (
                      <img
                        src={event.poster_url}
                        alt={event.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                        <span className="text-4xl mb-2">📅</span>
                        <span className="font-mono text-xs text-text-muted">No Poster</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-[#0a0e1a]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-subtle flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${new Date(event.date_start) > new Date() ? 'bg-accent-cyan' : 'bg-text-muted'}`}></span>
                      <span className="text-xs font-mono font-bold text-text-primary">
                        {new Date(event.date_start) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex gap-3 text-xs font-mono text-accent-cyan mb-3">
                      {event.date_start && (
                        <span>{new Date(event.date_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      )}
                      {event.mode && (
                        <span className="capitalize before:content-['•'] before:mr-3 before:text-text-muted text-text-secondary">{event.mode}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3 leading-snug group-hover:text-accent-cyan transition-colors">{event.name}</h3>
                    <p className="text-text-secondary text-sm line-clamp-2 mb-6 flex-1">{event.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
                      <div className="text-xs text-text-muted font-mono uppercase tracking-wider">
                        {event.venue && <span className="truncate max-w-[150px] inline-block">{event.venue}</span>}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-bg-deeper flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-[#0a0e1a] transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-10 md:hidden text-center">
            <Link to="/events" className="inline-block px-6 py-3 border border-border-subtle rounded-btn font-mono text-sm text-text-primary hover:bg-bg-card transition-colors">
              View all events
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0c101d] border-t border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bg-card to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-accent-cyan font-mono text-xs font-bold tracking-widest uppercase mb-4">Membership</div>
              <h2 className="text-4xl font-bold text-text-primary mb-6 leading-tight">Elevate Your Engineering Journey</h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Becoming a member of the IEEE Computer Society at GECI opens doors to exclusive resources, global networking opportunities, and a community dedicated to technological excellence.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Access to premium technical events and workshops',
                  'Networking with industry professionals and alumni',
                  'Leadership opportunities within the chapter',
                  'Global IEEE resources and digital library access'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-primary">
                    <span className="text-accent-cyan flex-shrink-0 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-btn hover:bg-gray-200 transition-colors">
                Join IEEE Globally <span>↗</span>
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 aspect-square flex flex-col justify-center transform translate-y-8">
                  <div className="text-4xl font-bold text-accent-cyan mb-2">50+</div>
                  <div className="text-text-secondary text-sm">Active Members</div>
                </div>
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 aspect-square flex flex-col justify-center">
                  <div className="text-4xl font-bold text-accent-yellow mb-2">12</div>
                  <div className="text-text-secondary text-sm">Events Annually</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 aspect-square flex flex-col justify-center">
                  <div className="text-4xl font-bold text-white mb-2">2015</div>
                  <div className="text-text-secondary text-sm">Year Established</div>
                </div>
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 aspect-square flex flex-col justify-center transform -translate-y-8">
                  <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
                  <div className="text-text-secondary text-sm">Lines of Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
