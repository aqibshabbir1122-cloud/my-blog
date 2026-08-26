'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type NewsletterFormProps = {
  variant?: 'purple' | 'blue'
}

const styles = {
  purple: {
    wrapper: 'rounded-lg bg-purple-50/60 flex items-center justify-center p-5 text-center',
    heading: 'text-sm mb-2',
    input: 'border border-gray-300 rounded-full px-3 py-1.5 text-xs w-36',
    button: 'mt-2 text-xs px-3 py-1.5 rounded-full bg-purple-700 text-white hover:bg-purple-800 transition w-36',
  },
  blue: {
    wrapper: 'bg-blue-50 rounded-xl p-5 text-center mb-6',
    heading: 'text-sm text-blue-900 mb-3',
    input: 'border border-blue-200 rounded-full px-3 py-1.5 text-xs w-full',
    button: 'mt-2 text-xs px-3 py-1.5 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition w-full',
  },
}

export default function NewsletterForm({ variant = 'blue' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const s = styles[variant]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email.')
      return
    }
    setStatus('loading')
    const { error } = await supabase.from('subscribers').insert({ email })
    if (error) {
      setStatus('error')
      setMessage(error.code === '23505' ? "You're already subscribed." : 'Something went wrong. Try again.')
    } else {
      setStatus('success')
      setMessage("You're subscribed!")
      setEmail('')
    }
  }

  return (
    <div className={s.wrapper}>
      <div className={variant === 'blue' ? 'w-full' : ''}>
        <p className={s.heading}>
          {variant === 'purple' ? 'Get new stories in your inbox' : 'Get new stories weekly'}
        </p>
        {status === 'success' ? (
          <p className="text-xs text-green-700">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className={s.input}
              disabled={status === 'loading'}
            />
            <button type="submit" className={s.button} disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting...' : 'Subscribe'}
            </button>
            {status === 'error' && <p className="text-xs text-red-600">{message}</p>}
          </form>
        )}
      </div>
    </div>
  )
}