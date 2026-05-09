import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream/promises'
import tar from 'tar'

export async function cloneRepo(url) {
  const repoId = crypto.randomUUID()
  const repoPath = path.join('/tmp', repoId)

  await fsPromises.mkdir(repoPath, { recursive: true })

  const match = url.match(/github\.com\/(.+?)\/(.+?)(\.git)?$/)
  if (!match) throw new Error("Only GitHub URLs supported")

  const [, owner, repo] = match

  const tarUrl = `https://codeload.github.com/${owner}/${repo}/tar.gz/refs/heads/main`

  const res = await fetch(tarUrl)

  const filePath = path.join(repoPath, 'repo.tar.gz')
  const fileStream = fs.createWriteStream(filePath)

  await pipeline(res.body, fileStream)

  await tar.x({
    file: filePath,
    cwd: repoPath,
    strip: 1
  })

  return repoId
}