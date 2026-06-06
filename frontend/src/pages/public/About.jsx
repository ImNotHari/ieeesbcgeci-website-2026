export default function About() {
  return (
    <div className="flex-1 w-full bg-bg-dark">
      {/* Header */}
      <div className="bg-bg-card border-b border-border-subtle py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-50 z-0"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-4">Discover Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">About the Chapter</h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The IEEE Computer Society Student Branch Chapter at GECI is a vibrant community of aspiring technologists dedicated to advancing computer science education.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-20">
          {/* Mission */}
          <section className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold text-text-primary sticky top-24">Our Mission</h2>
              <div className="w-12 h-1 bg-accent-cyan mt-6 rounded-full"></div>
            </div>
            <div className="md:w-2/3">
              <p className="text-text-secondary text-lg leading-relaxed bg-bg-card p-8 rounded-2xl border border-border-subtle shadow-md">
                We are dedicated to advancing computer science education, fostering technical excellence, and building a vibrant community of innovators and problem-solvers. We believe in the power of knowledge-sharing, collaborative learning, and hands-on experience to shape the future leaders of the tech industry.
              </p>
            </div>
          </section>

          {/* Activities */}
          <section className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold text-text-primary sticky top-24">What We Do</h2>
              <div className="w-12 h-1 bg-accent-yellow mt-6 rounded-full"></div>
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '💻', title: 'Technical Workshops', desc: 'Hands-on training sessions on the latest technologies.' },
                  { icon: '🎤', title: 'Guest Talks', desc: 'Webinars from industry professionals and researchers.' },
                  { icon: '🚀', title: 'Hackathons', desc: 'Intense coding competitions to solve real-world problems.' },
                  { icon: '🤝', title: 'Mentorship', desc: 'Career development and guidance from seniors and alumni.' }
                ].map((item, i) => (
                  <div key={i} className="bg-bg-card p-6 rounded-2xl border border-border-subtle hover:border-accent-yellow/50 transition-colors">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-text-secondary text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold text-text-primary sticky top-24">Core Values</h2>
              <div className="w-12 h-1 bg-green-400 mt-6 rounded-full"></div>
            </div>
            <div className="md:w-2/3">
              <ul className="space-y-6">
                {[
                  { title: 'Excellence', desc: 'Striving for the highest standards in all our endeavors.' },
                  { title: 'Innovation', desc: 'Embracing new ideas and technologies that shape the future.' },
                  { title: 'Community', desc: 'Supporting each other and building lasting relationships.' },
                  { title: 'Integrity', desc: 'Acting with honesty and transparency in all interactions.' },
                ].map((v, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-bg-deeper border border-border-subtle flex items-center justify-center font-bold text-text-muted">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">{v.title}</h3>
                      <p className="text-text-secondary">{v.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
