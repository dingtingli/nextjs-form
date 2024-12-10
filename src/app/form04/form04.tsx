"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { schema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onSubmitAction } from "./formServerSubmit";
import { useActionState, useEffect, useRef } from "react";


type formSchema = z.output<typeof schema>;

export default function Form04() {

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

    const prevIssuesRef = useRef<Record<string, string> | undefined>(undefined);

    useEffect(() => {
        if (state?.issues && state.issues !== prevIssuesRef.current) {
            Object.entries(state.issues).forEach(([field, message]) => {
                form.setError(field as keyof formSchema, { message });
            });
        }
        prevIssuesRef.current = state.issues;
    }, [state?.issues, form]);

    return (
        <Form {...form}>

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
                                <FormMessage >
                                    {state?.issues?.first && <span>{state.issues.first}</span>}
                                </FormMessage>
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
                                <FormMessage >
                                    {state?.issues?.last && <span>{state.issues.last}</span>}
                                </FormMessage>
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
                            <FormMessage >
                                {state?.issues?.email && <span>{state.issues.email}</span>}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}