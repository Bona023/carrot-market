export default function Loading() {
    return (
        <div className="p-5 animate-pulse flex flex-col gap-8">
            {[...Array(10)].map((_, index) => (
                <div
                    key={index}
                    className="*:rounded-md flex flex-col gap-5 "
                >
                    <div className="bg-neutral-700 h-10 w-full" />
                    <div className="w-full flex *:rounded-md justify-between">
                        <div className="bg-neutral-700 h-5 w-32" />
                        <div className="bg-neutral-700 h-5 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}
