import { renderHook } from "@testing-library/react-hooks"
import { ReactNode } from "react"
import BookmarksProvider, { useBookmarks } from "../BookmarksProvider"
import { SnackbarProvider } from "notistack"
import bookmarks from "../../../cypress/fixtures/bookmarks.json"

jest.mock("../../service/Bookmarks", () => ({
    getBookmarksRequest: () => Promise.resolve(require("../../../cypress/fixtures/bookmarks.json"))
}))

const renderUseBookmarksHook = () =>
    renderHook(() => useBookmarks(), {
        wrapper: ({ children }: { children: ReactNode }) => (
            <SnackbarProvider>
                <BookmarksProvider>{children}</BookmarksProvider>
            </SnackbarProvider>
        )
    })

describe("useBookmarks", () => {
    it("retrieve and parse bookmarks", async () => {
        const {
            result,
            waitForNextUpdate
        } = renderUseBookmarksHook()
        await waitForNextUpdate()

        console.log(result.current)
        expect(result.current.photos).toEqual(bookmarks.filter(item => item.type === "photo"))
        expect(result.current.videos).toEqual(bookmarks.filter(item => item.type === "video"))
    })
})
