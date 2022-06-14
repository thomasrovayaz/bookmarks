import { createContext, ReactNode, useContext, useEffect, useReducer } from "react"
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

enum BookmarkActionTypes {
    ADD = "ADD",
    LOAD = "LOAD"
}

type BookmarkAction =
    | {
    type: BookmarkActionTypes.ADD;
    bookmark: BookmarkType
}
    | {
    type: BookmarkActionTypes.LOAD
    bookmarks: BookmarkType[]
}

function reducer (state: { photos: BookmarkPhotoType[]; videos: BookmarkVideoType[] }, action: BookmarkAction) {
    switch (action.type) {
    case BookmarkActionTypes.ADD: {
        if (action.bookmark.type === "photo") {
            return {
                ...state,
                photos: [...state.photos, action.bookmark]
            }
        } else if (action.bookmark.type === "video") {
            return {
                ...state,
                videos: [...state.videos, action.bookmark]
            }
        }
        return state
    }
    case BookmarkActionTypes.LOAD: {
        const bookmarkPhotos = action.bookmarks.filter((item): item is BookmarkPhotoType => item.type === "photo")
        const bookmarkVideos = action.bookmarks.filter((item): item is BookmarkVideoType => item.type === "video")
        return {
            photos: bookmarkPhotos,
            videos: bookmarkVideos
        }
    }
    }
}

const BookmarksProvider = ({ children }: {
    children?: ReactNode;
}) => {
    const { enqueueSnackbar } = useSnackbar()
    const [{
        photos,
        videos
    }, dispatch] = useReducer(reducer, {
        photos: [],
        videos: []
    })

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const bookmarks = await getBookmarksRequest()
                dispatch({
                    type: BookmarkActionTypes.LOAD,
                    bookmarks
                })
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
            dispatch({
                type: BookmarkActionTypes.ADD,
                bookmark
            })
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
            const bookmarks = await deleteBookmarkRequest(id)
            dispatch({
                type: BookmarkActionTypes.LOAD,
                bookmarks
            })
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
