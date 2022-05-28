import { useBookmarks } from "../context/BookmarksProvider"
import { useState } from "react"
import "./BookmarkInput.css"

const BookmarkInput = () => {
    const { addBookmark } = useBookmarks()
    const [url, setUrl] = useState("")

    return (
        <div className={"bookmark-input"}>
            <input
                type="text"
                value={url}
                placeholder={"Copiez votre URL Viméo ou Flickr ici"}
                onChange={e => setUrl(e.target.value)}
                data-test={"bookmark-input"}
            />
            <button
                onClick={() => {
                    addBookmark(url)
                    setUrl("")
                }}
                data-test={"bookmark-add-button"}>
                Ajouter
            </button>
        </div>
    )
}

export default BookmarkInput
