import { BookmarkType, useBookmarks } from "../context/BookmarksProvider"
import { ReactComponent as DeleteIcon } from "./delete.svg"

const DeleteBookmarkButton = ({ item }: { item: BookmarkType }) => {
    const { deleteBookmark } = useBookmarks()
    const { id } = item

    return (
        <button
            className={"delete-bookmark-button"}
            data-test={`delete-bookmark-${id}`}
            onClick={(e) => {
                e.preventDefault()
                deleteBookmark(id)
            }}>
            <DeleteIcon />
        </button>
    )
}

export default DeleteBookmarkButton
