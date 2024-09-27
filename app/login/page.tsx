"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./action";

export default function LogIn() {
    const [state, action] = useFormState(handleForm, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form
                action={action}
                className="flex flex-col gap-3"
            >
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={[]}
                />
                <FormInput
                    name="userName"
                    type="text"
                    placeholder="Username"
                    required
                    errors={[]}
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.error ?? []}
                />
                <FormButton text="Log in" />
                {state?.pass ? <div className="bg-green-500 text-white  font-medium  rounded-md text-center py-2">Welcome!!</div> : null}
            </form>
            <SocialLogin />
        </div>
    );
}
