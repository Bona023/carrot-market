import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface ListTweetsProps {
    id: number;
    tweet: string;
    created_at: Date;
    authorName: string | null;
}

export default function ListTweets({ id, tweet, authorName, created_at }: ListTweetsProps) {
    return (
        <Link
            href={`/tweets/${id}`}
            className="flex gap-5"
        >
            <div className="flex flex-col gap-2 *:text-white w-full px-2 py-3 border border-orange-800 rounded-lg">
                <span className="text-lg w-full">{tweet}</span>
                <div className="w-full flex gap-4 justify-end">
                    <span>{authorName}</span>
                    <span>{formatToTimeAgo(created_at.toString())}</span>
                </div>
            </div>
        </Link>
    );
}
