import { isValidURL } from '../../src/bookmarks/bookmarks.controller'

describe('bookmarks', () => {
    it('is url valid', () => {
        const validUrls = [
            'https://vimeo.com/565486457',
            'https://www.flickr.com/photos/feuilllu/45771361701/',
            'http://vimeo.com/565486457',
            'http://www.flickr.com/photos/feuilllu/45771361701',
            'http://www.vimeo.com/565486457',
            'http://flickr.com/photos/feuilllu/45771361701/',
            'https://www.flickr.com/photos/feuilllu/31899892028/in/photostream/'
        ]
        const invalidUrls = [
            'https://google.com/test/',
            'test',
            'https://vimeo.com/',
            'https://www.flickr.com/'
        ]
        validUrls.forEach(url => {
            expect(isValidURL(url)).toBe(true)
        })
        invalidUrls.forEach(url => {
            expect(isValidURL(url)).toBe(false)
        })
    })
})
