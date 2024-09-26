"use server";

import { redirect } from "next/navigation";

export async function handleForm(prevState: any, formData: FormData) {
    const pw = formData.get("password");
    if (pw != "12345") {
        return {
            error: ["wrong password"],
        };
    } else {
        return {
            pass: ["pass"],
        };
    }
}
