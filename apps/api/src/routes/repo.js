import { cloneRepo } from '../services/cloneRepo.js'
import { indexRepository } from '../services/indexRepository.js'

export async function repoRoute(app) {
  app.post('/repo', async (req) => {
    const { githubUrl } = req.body

    const repoId = await cloneRepo(githubUrl)

    await indexRepository(repoId)

    return {
      success: true,
      repoId
    }
  })
}
