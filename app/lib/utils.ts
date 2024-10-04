export function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24; // 하루동안 밀리초
    const time = new Date(date).getTime(); // 기준점
    const now = new Date().getTime(); // 지금
    const diff = Math.round((time - now) / dayInMs);
    const formatter = new Intl.RelativeTimeFormat("ko");
    return formatter.format(diff, "days");
}

export function formatToWon(price: number): string {
    return price.toLocaleString("ko-KR");
}
