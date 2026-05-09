export async function retrieveRelevantChunks({
  repoId,
  question,
  state
}) {
  return [
    {
      file: 'src/auth.ts',
      startLine: 12,
      endLine: 44,
      text: 'Example retrieved chunk'
    }
  ]
}
