import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsAuthor(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}

async function getTweet(id: number) {
    const tweet = await db.tweet.findUnique({
        where: {
            id,
        },
        include: {
            author: {
                select: {
                    username: true,
                    avatar: true,
                    id: true,
                },
            },
        },
    });
    return tweet;
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const tweet = await getTweet(id);
    if (!tweet) {
        return notFound();
    }
    const isOwner = await getIsAuthor(tweet.author?.id ?? 0);
    return (
        <div className="px-3 py-8">
            <div className="w-full px-4 py-2">
                <Link href={"/"}>
                    <ChevronLeftIcon className="size-6" />
                </Link>
            </div>
            <div className="text-2xl px-4 py-8">{tweet.tweet}</div>
            <div className="flex w-full justify-between items-center my-4 px-4">
                <div className="flex items-center gap-2">
                    <div className="size-9">
                        {tweet.author?.avatar ? (
                            <Image
                                src={tweet.author.avatar}
                                alt="avatar"
                            />
                        ) : (
                            <UserIcon className="border border-white rounded-full" />
                        )}
                    </div>
                    <span className="text-lg font-bold">{tweet.author?.username}</span>
                </div>

                <div className="text-sm">{formatToTimeAgo(tweet.created_at.toString())}</div>
            </div>
        </div>
    );
}
