import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { addBookmarkRequest, deleteBookmarkRequest, getBookmarksRequest } from "../service/Bookmarks"
import { useSnackbar } from "notistack"
import get from "lodash/get"

type BookmarkCommonType = {
    id: number;
    url: string
    title: string
    thumbnail: string
    author: string
    createdAt: string
    width: number
    height: number
}
export type BookmarkPhotoType = BookmarkCommonType & {
    type: "photo"
    duration: null
}
export type BookmarkVideoType = BookmarkCommonType & {
    type: "video"
    duration: number
}
export type BookmarkType = BookmarkPhotoType | BookmarkVideoType

type BookmarksContextType = {
    photos: BookmarkPhotoType[];
    videos: BookmarkVideoType[];
    addBookmark: (url: string) => void;
    deleteBookmark: (id: number) => void;
};

const BookmarksContext = createContext<BookmarksContextType | undefined>(
    undefined
)

const BookmarksProvider = ({ children }: {
    children?: ReactNode;
}) => {
    const { enqueueSnackbar } = useSnackbar()
    const [{
        photos,
        videos
    }, setBookmarks] = useState<{ photos: BookmarkPhotoType[]; videos: BookmarkVideoType[] }>({
        photos: [],
        videos: []
    })

    const parseBookmarks = (bookmarks: BookmarkType[]) => {
        const bookmarkPhotos = bookmarks.filter((item): item is BookmarkPhotoType => item.type === "photo")
        const bookmarkVideos = bookmarks.filter((item): item is BookmarkVideoType => item.type === "video")
        setBookmarks({
            photos: bookmarkPhotos,
            videos: bookmarkVideos
        })
    }

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                parseBookmarks(await getBookmarksRequest())
            } catch (e) {
                enqueueSnackbar(get(e, "response.data", "Impossible de récupérer les bookmarks"), {
                    variant: "error",
                    SnackbarProps: {
                        "data-test": "load-error"
                    }
                })
            }
        }
        loadBookmarks()
    }, [enqueueSnackbar])

    const addBookmark = async (url: string) => {
        try {
            const bookmark = await addBookmarkRequest(url)
            if (bookmark.type === "photo") {
                setBookmarks({
                    photos: [...photos, bookmark],
                    videos: videos
                })
            } else if (bookmark.type === "video") {
                setBookmarks({
                    photos: photos,
                    videos: [...videos, bookmark]
                })
            }
        } catch (e) {
            console.log(e)
            enqueueSnackbar(get(e, "response.data", "Impossible d'ajouter le bookmark"), {
                variant: "error",
                SnackbarProps: {
                    "data-test": "add-error"
                }
            })
        }
    }
    const deleteBookmark = async (id: number) => {
        try {
            parseBookmarks(await deleteBookmarkRequest(id))
        } catch (e) {
            enqueueSnackbar(get(e, "response.data", "Impossible de supprimer le bookmark"), {
                variant: "error",
                SnackbarProps: {
                    "data-test": "delete-error"
                }
            })
        }
    }

    return (
        <BookmarksContext.Provider
            value={{
                photos,
                videos,
                addBookmark,
                deleteBookmark
            }}>
            {children}
        </BookmarksContext.Provider>
    )
}

export function useBookmarks () {
    const bookmarksContext = useContext(BookmarksContext)
    if (bookmarksContext === undefined) {
        throw new Error(`useBookmarks must be used within a BookmarksProvider`)
    }
    return bookmarksContext
}

export default BookmarksProvider
