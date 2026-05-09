import { investigateQuestion } from '../services/investigateQuestion.js'

export async function investigateRoute(app) {
  app.post('/investigate', async (req) => {
    const { repoId, question, conversationId } = req.body

    return investigateQuestion({
      repoId,
      question,
      conversationId
    })
  })
}
