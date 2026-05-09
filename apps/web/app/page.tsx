'use client'

import { useState } from 'react'

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)

  async function investigate() {
    const repoRes = await fetch('http://localhost:3001/repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        githubUrl: repoUrl
      })
    })

    const repoData = await repoRes.json()

    const response = await fetch(
      'http://localhost:3001/investigate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repoId: repoData.repoId,
          question,
          conversationId: 'demo'
        })
      }
    )

    const data = await response.json()

    setAnswer(data)
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Codebase Investigator</h1>

      <input
        style={{ width: '100%', marginBottom: 12 }}
        placeholder="GitHub URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      <textarea
        style={{ width: '100%', height: 120 }}
        placeholder="Ask a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={investigate}>
        Investigate
      </button>

      {answer && (
        <div style={{ marginTop: 40 }}>
          <h2>Answer</h2>

          <pre>
            {JSON.stringify(answer, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
