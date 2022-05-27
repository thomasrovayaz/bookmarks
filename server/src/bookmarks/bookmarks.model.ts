import { Model } from 'objection'

export type Bookmark = {
    id: number;
    url: string
    type: 'photo' | 'video'
    title: string
    thumbnail: string
    author: string
    createdAt: string
    duration?: number
    width: number
    height: number
}

export class BookmarksModel extends Model {
    static get tableName () {
        return 'bookmarks'
    };

    static get idColumn () {
        return 'id'
    }

    static get jsonSchema () {
        return {
            type: 'object',
            required: ['url', 'createdAt', 'title', 'type', 'thumbnail', 'author', 'width', 'height'],

            properties: {
                url: { type: 'string' },
                title: { type: 'string' },
                type: { type: 'string' },
                thumbnail: { type: 'string' },
                author: { type: 'string' },
                createdAt: { type: 'string' },
                duration: { type: 'integer' },
                width: { type: 'integer' },
                height: { type: 'integer' }
            }
        }
    }
}
