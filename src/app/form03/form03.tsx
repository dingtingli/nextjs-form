"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { schema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onSubmitAction } from "./formServerSubmit";
import { useActionState, useRef } from "react";
import { X } from "lucide-react";

type formSchema = z.output<typeof schema>;

export default function Form03() {

    // disabled js , also can invoke the server side function
    const [state, formAction] = useActionState(onSubmitAction, {
        message: "",
    });

    const form = useForm<formSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            first: "",
            last: "",
            email: "",
            ...(state?.fields ?? {}),
        },
    });

    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Form {...form}>
            {state?.message !== "" && !state.issues
                && (<div className="text-red-500">{state.message}</div>)}
            {state?.issues && (
                <div className="text-red-500">
                    <ul>
                        {state.issues.map((issue) => (
                            <li key={issue} className="flex gap-1">
                                <X fill="red" />
                                {issue}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <form className="space-y-8"
                ref={formRef}
                action={formAction}
                onSubmit={form.handleSubmit(() => formRef.current?.submit())}
            >
                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="first"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="First Name" />
                                </FormControl>
                                <FormDescription>Your First Name</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Last Name" />
                                </FormControl>
                                <FormDescription>Your Last Name</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Last Name" />
                            </FormControl>
                            <FormDescription>Your Email address</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}