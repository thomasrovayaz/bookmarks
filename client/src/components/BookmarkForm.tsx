import { useBookmarks } from "../context/BookmarksProvider"
import { FormEventHandler, useState } from "react"
import "./BookmarkInput.css"

const BookmarkForm = () => {
    const { addBookmark } = useBookmarks()
    const [submitting, setSubmitting] = useState(false)

    const onSubmit: FormEventHandler = async event => {
        event.preventDefault()
        setSubmitting(true)
        const form = event.currentTarget as HTMLFormElement
        const formData = new FormData(form)
        await addBookmark(`${formData.get("url")}`)
        form.reset()
        setSubmitting(false)
    }

    return (
        <form className={"bookmark-input"} onSubmit={onSubmit}>
            <input
                type="url"
                placeholder={"Copiez votre URL Viméo ou Flickr ici"}
                name={"url"}
                data-test={"bookmark-input"}
            />
            <button disabled={submitting}
                    data-test={"bookmark-add-button"}>
                Ajouter
            </button>
        </form>
    )
}

export default BookmarkForm
