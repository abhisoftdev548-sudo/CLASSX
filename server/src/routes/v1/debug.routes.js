import express from 'express'

const debugRouter = express.Router()

// Simple cookie echo endpoint for debugging token/rotate flow
debugRouter.get('/cookies', (req, res) => {
  return res.status(200).json({ cookies: req.cookies || {} })
})

export default debugRouter
