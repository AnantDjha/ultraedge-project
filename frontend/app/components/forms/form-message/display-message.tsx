export function DisplayFormMessage({ message, success }: { message: string, success: boolean }) {

    if (message.length === 0) {
        return (
            <></>
        )
    }
    return (
        <div
            className={`w-full rounded-lg mb-3 text-center py-2 border ${success ? "border-green-600" : "border-red-600"}`}
        >
            <p className={`${success ? "text-green-600" : "text-red-600"}`}>
                {message}
            </p>
        </div>
    )
}