import DeleteBookmarkButton from "./DeleteBookmarkButton"
import moment from "moment"
import { BookmarkVideoType } from "../context/BookmarksProvider"
import Moment from "react-moment"

const BookmarkVideo = ({ item }: { item: BookmarkVideoType }) => {
    const {
        id,
        url,
        thumbnail,
        title,
        duration,
        author,
        createdAt
    } = item
    return (
        <a
            href={url}
            target="_blank"
            className={"bookmark bookmark-video"}
            data-test={`bookmark-${id}`} rel="noreferrer">
            <img src={thumbnail} alt={title} />
            <div className={"bookmark-info"}>
                <div className={"bookmark-title"}>{title}</div>
                <div className={"bookmark-author"}>
                    {author}, <Moment fromNow>{createdAt}</Moment>
                </div>
                <div className={"bookmark-dimensions"}>{`${moment.utc(duration * 1000).format("HH:mm:ss")}`}</div>
            </div>
            <DeleteBookmarkButton item={item} />
        </a>
    )
}

export default BookmarkVideo
