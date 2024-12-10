"use server";

import { schema } from "./formSchema";

export type FormState = {
    message: string;
    fields?: Record<string, string>;
    issues?: string[];
};

export async function onSubmitAction(
    prevState: FormState,
    data: FormData): Promise<FormState> {
    "use server";
    const formData = Object.fromEntries(data);
    const parsed = schema.safeParse(formData);

    //test 
    console.log(parsed);

    if (!parsed.success) {
        const fields: Record<string, string> = {};
        for(const key of Object.keys(formData)){
            fields[key] = formData[key].toString();
        }
        return {
            message: "parsed.error.message",
            fields: fields,
            issues: parsed.error.issues.map((issue) => issue.message),
        };
    }

    if (parsed.data.email.includes("a")) {
        return {
            message: "Email address is not valid",
            fields: parsed.data,
        };
    }

    return {
        message: "Form submitted successfully",
    };
}