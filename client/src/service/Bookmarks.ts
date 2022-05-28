import axios from "axios";
import {BookmarkType} from "../context/BookmarksProvider";

export const getBookmarksRequest = async (): Promise<BookmarkType[]> => {
    return (await axios.get('/api/bookmarks')).data
}
export const addBookmarkRequest = async (url: string): Promise<BookmarkType> => {
    return (await axios.post('/api/bookmarks', {url})).data
}
export const deleteBookmarkRequest = async (id: number): Promise<BookmarkType[]> => {
    return (await axios.delete(`/api/bookmarks/${id}`,)).data
}
