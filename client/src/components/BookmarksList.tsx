import { useBookmarks } from "../context/BookmarksProvider"
import BookmarkVideo from "./BookmarkVideo"
import BookmarkPhoto from "./BookmarkPhoto"
import "./BookmarksList.css"
import "./Bookmark.css"

const BookmarksList = () => {
    const {
        photos,
        videos
    } = useBookmarks()

    return (
        <div>
            {photos.length > 0 && (
                <div className={"photos"}>
                    <h2>Photos</h2>
                    <div className={"bookmarks-scroller"}>
                        {photos.map(item => (
                            <BookmarkPhoto key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            )}
            {videos.length > 0 && (
                <div className={"videos"}>
                    <h2>Videos</h2>
                    <div className={"bookmarks-scroller"}>
                        {videos.map(item => (
                            <BookmarkVideo key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookmarksList
