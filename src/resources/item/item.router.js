import { Router } from 'express'

const controller = (req, res) => {
  res.send({ message: 'Item API' })
}

const router = Router()

// This route will be mounted at api/item by the root router
router
  .route('/')
  .get(controller)
  .post(controller)

// api/item/:id
router
  .route('/:id')
  .get(controller)
  .put(controller)
  .delete(controller)

export default router
