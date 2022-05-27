import { Router } from 'express'
import bookmarksRoutes from './bookmarks/bookmarks.routes'

const router = Router()
router.use('/bookmarks', bookmarksRoutes)
export default router
