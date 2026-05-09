import Parser from 'tree-sitter'
import JavaScript from 'tree-sitter-javascript'
import { glob } from 'glob'
import fs from 'fs/promises'
import path from 'path'

const parser = new Parser()

parser.setLanguage(JavaScript)

export async function indexRepository(repoId) {
  const repoPath = path.join('./repos', repoId)

  const files = await glob('**/*.{js,ts,tsx,jsx}', {
    cwd: repoPath,
    ignore: ['node_modules/**']
  })

  const indexed = []

  for (const file of files) {
    const fullPath = path.join(repoPath, file)

    const content = await fs.readFile(fullPath, 'utf8')

    const tree = parser.parse(content)

    indexed.push({
      file,
      ast: tree.rootNode.toString(),
      content
    })
  }

  return indexed
}
