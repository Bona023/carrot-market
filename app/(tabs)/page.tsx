import ListTweets from "@/components/list-tweet";
import db from "@/lib/db";

async function getTweets() {
    const tweets = db.tweet.findMany({
        select: {
            id: true,
            tweet: true,
            created_at: true,
            authorName: true,
        },
    });
    return tweets;
}

export default async function Home() {
    const tweets = await getTweets();
    return (
        <div className="p-5 flex flex-col gap-5">
            {tweets.map((tweet) => (
                <ListTweets
                    key={tweet.id}
                    {...tweet}
                />
            ))}
        </div>
    );
}
