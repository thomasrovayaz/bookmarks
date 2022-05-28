import { Model } from 'objection'

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
