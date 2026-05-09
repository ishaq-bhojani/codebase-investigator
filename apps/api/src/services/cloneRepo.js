import simpleGit from 'simple-git'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

export async function cloneRepo(url) {
  const repoId = crypto.randomUUID()

  const repoPath = path.join('./repos', repoId)

  await fs.mkdir(repoPath, {
    recursive: true
  })

  const git = simpleGit()

  await git.clone(url, repoPath)

  return repoId
}
