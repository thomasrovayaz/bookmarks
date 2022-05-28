import { BookmarksModel } from './bookmarks.model'
import fetch from 'node-fetch'

export const isValidURL = (urlStr: string) => {
    try {
        const url = new URL(urlStr)
        const vimeoRegex = /https?:\/\/(www\.)?vimeo\.com\/(\d+)(\/.*)?/g
        const flickrRegex =
            /https?:\/\/(www\.)?flickr\.com\/photos\/\w+\/(\d+)(\/.*)?/g
        if (vimeoRegex.test(url.href)) {
            return true
        }

        if (flickrRegex.test(url.href)) {
            return true
        }
        return false
    } catch {
        return false
    }
}

export const bookmarkUrlExists = async (url: string) => {
    const bookmark = await BookmarksModel.query().where('url', url)
    return bookmark.length > 0
}
export const bookmarkExists = async (id: string) => {
    const bookmark = await BookmarksModel.query().findById(id)
    return !!bookmark
}

export const getAllBookmarks = async () => {
    return BookmarksModel.query()
}

export const deleteBookmark = async (url: string) => {
    await BookmarksModel.query().deleteById(url)
}

type NoembedResponse = {
    width: number;
    author_name: string;
    author_url: string;
    provider_url: string;
    thumbnail_url: string;
    height?: number;
    duration?: number;
    html: string;
    url: string;
    type: 'photo' | 'video';
    title: string;
};
const getBookmarkInfoFromNoembed = async (url: string) => {
    const response = await fetch(`https://noembed.com/embed?url=${url}`)
    return response.json() as Promise<NoembedResponse>
}

export const addBookmark = async (url: string) => {
    const bookmarkInfos = await getBookmarkInfoFromNoembed(url)
    return BookmarksModel.query().insert({
        url,
        createdAt: new Date().toISOString(),
        title: bookmarkInfos.title,
        type: bookmarkInfos.type,
        thumbnail: bookmarkInfos.thumbnail_url,
        author: bookmarkInfos.author_name,
        width: bookmarkInfos.width,
        height: bookmarkInfos.height,
        duration: bookmarkInfos.duration
    })
}
