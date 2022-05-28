import Knex from 'knex'
import { Model } from 'objection'
import config from '../../knexfile'
import request from 'supertest'
import app from '../../src'
import fetch from 'node-fetch'
import omit from 'lodash/omit'

jest.mock('node-fetch', () => jest.fn())

describe('bookmarks', () => {
    let knex: any
    const seededBookmarks = [{
        url: 'https://vimeo.com/565486457',
        type: 'video',
        title: 'Sylvain Lhommée @ Nation Entreprenante - Episode #5',
        thumbnail: 'https://i.vimeocdn.com/video/1169280957-6513b97be812eac51f6ba090b2f34ab5a63bfc220076c0118950fcf4c227fdce-d_295x166',
        author: 'BARTERLINK',
        createdAt: new Date().toISOString(),
        duration: 1070,
        width: 426,
        height: 240
    }, {
        url: 'https://www.flickr.com/photos/feuilllu/45771361701/',
        type: 'photo',
        title: '2018 Visite de Klaxoon',
        thumbnail: 'https://live.staticflickr.com/4817/45771361701_2678123510_q.jpg',
        author: 'Pierre Metivier',
        createdAt: new Date().toISOString(),
        width: 1024,
        height: 685,
        duration: null
    }]

    beforeAll(async () => {
        knex = Knex(config)
        Model.knex(knex)

        jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2000-01-01T00:00:00.000Z')
    })
    beforeEach(async () => {
        // Seed anything
        await knex('bookmarks').del()
        await knex('bookmarks')
            .insert(seededBookmarks)
    })
    afterAll(() => {
        jest.restoreAllMocks()
        knex.destroy()
    })
    describe('GET /bookmarks', () => {
        it('should return the bookmarks', async () => {
            const response = await request(app)
                .get('/api/bookmarks')
            expect(response.status).toEqual(200)
            expect(response.body.map(bookmark => omit(bookmark, 'id'))).toEqual(seededBookmarks)
        })
    })
    describe('POST /bookmarks', () => {
        it('should add a bookmark', async () => {
            fetch.mockImplementation(() => ({
                ok: true,
                status: 200,
                json: () => {
                    return {
                        license: 'Attribution-NonCommercial License',
                        web_page: 'https://www.flickr.com/photos/feuilllu/31899892028/',
                        version: '1.0',
                        license_url: 'https://creativecommons.org/licenses/by-nc/2.0/',
                        width: 1024,
                        provider_name: 'Flickr',
                        html: '<a data-flickr-embed="true" href="https://www.flickr.com/photos/feuilllu/31899892028/" title="2018 Visite de Klaxoon by Pierre Metivier, on Flickr"><img alt="2018 Visite de Klaxoon" height="768" src="https://noembed.com/i/https://live.staticflickr.com/1922/31899892028_6f105415d9_b.jpg" width="1024"></a><script async src="https://embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>',
                        cache_age: 3600,
                        author_url: 'https://www.flickr.com/photos/feuilllu/',
                        thumbnail_url: 'https://live.staticflickr.com/1922/31899892028_6f105415d9_q.jpg',
                        web_page_short_url: 'https://flic.kr/p/QAThwq',
                        title: '2018 Visite de Klaxoon',
                        media_url: 'https://live.staticflickr.com/1922/31899892028_6f105415d9_b.jpg',
                        license_id: '2',
                        thumbnail_height: 150,
                        flickr_type: 'photo',
                        url: 'https://www.flickr.com/photos/feuilllu/31899892028/in/photostream/',
                        thumbnail_width: 150,
                        type: 'photo',
                        provider_url: 'https://www.flickr.com/',
                        height: 768,
                        author_name: 'Pierre Metivier'
                    }
                }
            }))
            const response = await request(app)
                .post('/api/bookmarks').send({ url: 'https://www.flickr.com/photos/feuilllu/31899892028/in/photostream/' })
            expect(response.status).toEqual(201)
            expect(omit(response.body, 'id')).toEqual({
                author: 'Pierre Metivier',
                createdAt: '2000-01-01T00:00:00.000Z',
                height: 768,
                thumbnail: 'https://live.staticflickr.com/1922/31899892028_6f105415d9_q.jpg',
                title: '2018 Visite de Klaxoon',
                type: 'photo',
                url: 'https://www.flickr.com/photos/feuilllu/31899892028/in/photostream/',
                width: 1024
            })
            expect(response.body.id).toBeDefined()
        })
        it('should not add an existing bookmark', async () => {
            const response = await request(app)
                .post('/api/bookmarks').send({ url: seededBookmarks[0].url })
            expect(response.status).toEqual(400)
            expect(response.text).toEqual('Le bookmark existe déjà')
        })
        it('should not add an empty url', async () => {
            const response = await request(app)
                .post('/api/bookmarks').send()
            expect(response.status).toEqual(400)
            expect(response.text).toEqual('Une URL est requise')
        })
        it('should not add an invalid url', async () => {
            const response = await request(app)
                .post('/api/bookmarks').send({ url: 'https://google.com/test/' })
            expect(response.status).toEqual(400)
            expect(response.text).toEqual("L'URL est invalide")
        })
    })
    describe('DELETE /bookmarks', () => {
        it('should delete a bookmark', async () => {
            const { body: bookmarks } = await request(app)
                .get('/api/bookmarks')
            const response = await request(app)
                .delete(`/api/bookmarks/${bookmarks[0].id}`)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual(bookmarks.slice(1))
        })
        it('should not delete a non-existing bookmark', async () => {
            const response = await request(app)
                .delete('/api/bookmarks/1000')
            expect(response.status).toEqual(404)
            expect(response.text).toEqual("Le bookmark n'existe pas")
        })
    })
})
