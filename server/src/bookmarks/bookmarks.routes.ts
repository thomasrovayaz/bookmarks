import { Router } from 'express'
import {
    addBookmark,
    bookmarkExists,
    bookmarkUrlExists,
    deleteBookmark,
    getAllBookmarks,
    isValidURL
} from './bookmarks.controller'

const router = Router()

router.get('', async (req, res) => {
    res.status(200).send(await getAllBookmarks())
})
router.post('', async (req, res) => {
    const { url } = req.body
    if (!url) {
        return res
            .status(400)
            .send(
                'Une URL est requise'
            )
    }
    if (await bookmarkUrlExists(url)) {
        return res
            .status(400)
            .send(
                'Le bookmark existe déjà'
            )
    }
    if (!isValidURL(url)) {
        return res
            .status(400)
            .send(
                'L\'URL est invalide'
            )
    }
    try {
        const bookmark = await addBookmark(url)
        res.status(201).send(bookmark)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    if (!await bookmarkExists(id)) {
        return res
            .status(404)
            .send(
                'Le bookmark n\'existe pas'
            )
    }
    await deleteBookmark(id)
    res.sendStatus(200)
})

export default router
