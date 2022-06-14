import { BookmarkPhotoType } from "../context/BookmarksProvider"
import DeleteBookmarkButton from "./DeleteBookmarkButton"
import Moment from "react-moment"

const BookmarkPhoto = ({ item }: { item: BookmarkPhotoType }) => {
    const {
        id,
        url,
        thumbnail,
        title,
        width,
        height,
        author,
        createdAt
    } =
        item
    return (
        <a
            href={url}
            target="_blank"
            className={"bookmark bookmark-photo"}
            data-test={`bookmark-${id}`} rel="noreferrer">
            <img src={thumbnail} alt={title} />
            <div className={"bookmark-info"}>
                <div className={"bookmark-title"}>{title}</div>
                <div className={"bookmark-author"}>
                    {author}, <Moment fromNow>{createdAt}</Moment>
                </div>
                <div
                    className={
                        "bookmark-dimensions"
                    }>{`${width}x${height}`}</div>
            </div>
            <DeleteBookmarkButton item={item} />
        </a>
    )
}

export default BookmarkPhoto
