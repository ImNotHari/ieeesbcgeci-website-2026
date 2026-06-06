import { useState } from 'react'
import { usePublicAPI } from '../../hooks/usePublicAPI'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Contact() {
  const { submitContact } = usePublicAPI()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name = 'Name is required.'
    if (!form.email.trim())   e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address.'
    if (!form.message.trim()) e.message = 'Message is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const result = await submitContact(form.name, form.email, form.message)
    setLoading(false)

    if (result.success) {
      setForm({ name: '', email: '', message: '' })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 8000)
    }
  }

  return (
    <div className="flex-1 w-full bg-bg-dark">
      <div className="bg-bg-card border-b border-border-subtle py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-accent-cyan/5 to-transparent z-0"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Get In Touch</h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Have a question, proposal, or want to collaborate? We'd love to hear from you. Drop us a message below.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Chapter Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg-deeper border border-border-subtle flex items-center justify-center text-text-primary flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <p className="text-text-muted font-mono text-[10px] tracking-widest uppercase mb-1">Email Us</p>
                    <a href="mailto:contact@ieeesbcgeci.org" className="text-accent-cyan hover:underline text-sm font-mono font-bold block">
                      contact@ieeesbcgeci.org
                    </a>
                    <a href="mailto:info@ieeesbcgeci.org" className="text-text-secondary hover:text-white transition-colors text-sm font-mono block mt-1">
                      info@ieeesbcgeci.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg-deeper border border-border-subtle flex items-center justify-center text-text-primary flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="text-text-muted font-mono text-[10px] tracking-widest uppercase mb-1">Location</p>
                    <p className="text-text-primary text-sm leading-relaxed">
                      Department of Computer Science<br />
                      Govt. Engineering College, Idukki (GECI)<br />
                      Painavu, Idukki, Kerala, India - 685603
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-border-subtle">
              <h2 className="text-xl font-bold text-text-primary mb-6">Connect Socially</h2>
              <div className="flex gap-4">
                {[
                  { label: 'LinkedIn', icon: 'in', url: '#' },
                  { label: 'GitHub', icon: 'gh', url: '#' },
                  { label: 'Instagram', icon: 'ig', url: '#' },
                  { label: 'X (Twitter)', icon: 'x', url: '#' },
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-bg-deeper border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <span className="font-mono text-xs font-bold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-bg-card border border-border-subtle rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Success Overlay */}
            <div className={`absolute inset-0 bg-bg-card z-20 flex flex-col items-center justify-center text-center p-8 transition-all duration-500 transform ${submitted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Message Sent!</h3>
              <p className="text-text-secondary max-w-xs mx-auto">
                Thank you for reaching out. We have received your message and will get back to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-accent-cyan text-sm font-mono hover:underline"
              >
                Send another message
              </button>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-8">Send us a message</h2>
            
            <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  label="Your Name"
                  value={form.name}
                  onChange={set('name')}
                  error={errors.name}
                  placeholder="John Doe"
                  required
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-text-secondary font-mono text-xs tracking-widest uppercase mb-2">
                  Your Message<span className="text-accent-cyan ml-1">*</span>
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="How can we help you?"
                  rows={6}
                  aria-invalid={!!errors.message}
                  className={`
                    w-full bg-bg-deeper border rounded-input px-4 py-3 text-text-primary
                    placeholder-text-muted text-sm focus:outline-none transition-all duration-300 resize-none
                    ${errors.message
                      ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_10px_rgba(248,113,113,0.2)]'
                      : 'border-border-subtle focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,217,255,0.15)]'
                    }
                  `}
                />
                {errors.message && (
                  <p className="mt-2 text-red-400 text-xs font-mono animate-fade-in">{errors.message}</p>
                )}
              </div>

              <div className="pt-4">
                <Button variant="primary" type="submit" disabled={loading} className="w-full py-4 text-sm font-bold tracking-wide flex justify-center items-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message <span>→</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-text-muted font-mono text-[10px] uppercase tracking-widest mt-4">
                  We typically reply within 24-48 hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
