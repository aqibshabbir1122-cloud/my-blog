'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  created_at: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  async function fetchMessages() {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  async function toggleReadStatus(id: string, currentStatus: boolean) {
    const nextStatus = !currentStatus

    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, is_read: nextStatus } : msg))
    )

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: nextStatus } : null))
    }

    const { error } = await supabase
      .from('messages')
      .update({ is_read: nextStatus })
      .eq('id', id)

    if (error) {
      console.error('Error updating read status:', error)
      fetchMessages()
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) return

    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    if (selectedMessage?.id === id) setSelectedMessage(null)

    const { error } = await supabase.from('messages').delete().eq('id', id)

    if (error) {
      console.error('Error deleting message:', error)
      fetchMessages()
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread') return !msg.is_read
    if (filter === 'read') return msg.is_read
    return true
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-tight text-amber-900"
            >
              Wanderline
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-700">Messages Inbox</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchMessages}
              className="text-xs uppercase tracking-wider font-semibold text-amber-800 hover:text-amber-950 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Messages List Column */}
          <div className="w-full md:w-5/12 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex gap-2">
                {(['all', 'unread', 'read'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                      filter === tab
                        ? 'bg-amber-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab} {tab === 'unread' && unreadCount > 0 && `(${unreadCount})`}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {filteredMessages.length} inquiries
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Loading dispatches...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500 bg-white rounded-xl border border-gray-200/60 p-6">
                No messages found in this view.
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id

                  return (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg)
                        if (!msg.is_read) toggleReadStatus(msg.id, false)
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50/60 border-amber-800/40 shadow-sm'
                          : msg.is_read
                          ? 'bg-white border-gray-200 hover:border-gray-300'
                          : 'bg-white border-amber-600/40 shadow-sm ring-1 ring-amber-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-amber-700 shrink-0" />
                          )}
                          <span
                            className={`text-sm truncate ${
                              !msg.is_read ? 'font-bold text-gray-950' : 'font-medium text-gray-800'
                            }`}
                          >
                            {msg.name}
                          </span>
                        </div>
                        <time className="text-[11px] text-gray-500 font-mono shrink-0">
                          {new Date(msg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>

                      <div className="text-xs font-semibold text-gray-800 line-clamp-1 mb-1">
                        {msg.subject || 'General Inquiry'}
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Detailed Message View Column */}
          <div className="w-full md:w-7/12">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between min-h-[480px]">
                <div>
                  <div className="flex items-start justify-between border-b border-gray-100 pb-6 mb-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block mb-1">
                        Contact Dispatch
                      </span>
                      <h2 className="text-2xl font-serif font-bold text-gray-950 leading-snug">
                        {selectedMessage.subject || 'General Inquiry'}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleReadStatus(selectedMessage.id, selectedMessage.is_read)
                        }
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Mark as {selectedMessage.is_read ? 'Unread' : 'Read'}
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-6 bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                    <div>
                      <span className="text-gray-400">From: </span>
                      <span className="font-semibold text-gray-800">{selectedMessage.name}</span>
                      <span className="mx-2">•</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-amber-800 underline hover:text-amber-950"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <time>
                      {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>

                  <div className="prose prose-amber font-serif text-gray-800 leading-relaxed max-w-none whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || 'Wanderline Inquiry'
                    )}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-xl transition"
                  >
                    Reply via Email &rarr;
                  </a>
                  <span className="text-[11px] text-gray-400 font-mono">
                    ID: {selectedMessage.id}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[480px] bg-white/50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-800 font-serif text-xl mb-3">
                  ✉
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">No Message Selected</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Select an inquiry from the list on the left to read the full body, reply, or toggle read status.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}