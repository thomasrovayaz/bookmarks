import React from "react"
import "./App.css"
import BookmarksProvider from "./context/BookmarksProvider"
import { SnackbarProvider } from "notistack"
import BookmarkForm from "./components/BookmarkForm"
import BookmarksList from "./components/BookmarksList"
import "moment/locale/fr"
import moment from "moment" // without this line it didn't work
moment.locale("fr")

function App () {
    return (
        <SnackbarProvider maxSnack={3}>
            <BookmarksProvider>
                <div className="App">
                    <h1>Bookmarks App</h1>
                    <BookmarkForm />
                    <BookmarksList />
                </div>
            </BookmarksProvider>
        </SnackbarProvider>
    )
}

export default App
