'use client'

import { useState } from 'react'

export type OcJoinFaqItem = {
  id: string
  question: string
  lead: string
  answer: string
}

const eyebrow = 'text-xs font-bold uppercase tracking-[0.12em] text-violet-600'
const sectionTitle = 'text-2xl md:text-3xl font-bold text-gray-900 tracking-tight'
const body = 'text-gray-600 leading-relaxed text-sm md:text-base'

export function OcJoinFaqAccordion({ items }: { items: OcJoinFaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="flex w-full max-w-4xl flex-col gap-4" aria-labelledby="faq-heading">
      <p className={eyebrow}>Questions</p>
      <h2 id="faq-heading" className={sectionTitle}>
        Frequently asked questions
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const open = openId === item.id
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-sm"
            >
              <button
                type="button"
                id={`faq-trigger-${item.id}`}
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-5"
                onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
              >
                <span className="font-bold text-gray-900 pr-2 text-base md:text-lg">{item.question}</span>
                <span
                  className={`shrink-0 text-violet-600 transition-transform duration-200 ${
                    open ? 'rotate-180' : ''
                  }`}
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {open ? (
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${item.id}`}
                  className="space-y-4 border-t border-gray-100 bg-violet-50/30 px-4 py-4 md:px-5 md:py-5"
                >
                  <p className={body}>{item.lead}</p>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-700">
                      The reality
                    </p>
                    <p className={body}>{item.answer}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
