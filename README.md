
form01 前端验证

form02 服务器段验证

ctrl+ shift+ p 快捷键 JavaScript 设置前端的JavaScript disabled/enabled

form01 在前端js disabled 时，无法实现验证；form02 在前端js disabled 时，接收不到数据。

form03 浏览器设置成 JavaScript disabled 后如何实现验证

#  Form 表单测试项目

本项目旨在演示如何在实际开发中集成并使用 shadcn/ui 提供的表单组件。

项目中同时引入了 React Hook Form 作为表单状态管理工具，以及 Zod 作为表单数据的类型校验方案。

项目不仅仅使用客户端验证，而且同时使用服务器端验证，当客户端浏览器禁用 JavaScript 时，服务器端仍然完成所有验证。

在本项目中，我们将使用 Next.js 作为服务端渲染，并使用 TypeScript 作为编程语言。

Zod 官网地址：https://zod.dev/

Reack hook form 官网地址：https://www.react-hook-form.com/get-started/#Quickstart

## 安装依赖

1. 使用 nextjs 创建一个原始项目

```bash
npx create-next-app@latest
```

2. 安装 shadcn/ui 作为前端组件库

```bash
npx shadcn@latest init
```

3.  安装 shadcn/ui form 组件

```bash
npx shadcn@latest add form

? How would you like to proceed? » - Use arrow-keys. Return to submit.
>   Use --force
```

此时，用于验证的的 Zod 库以及 React Hook Form 库将会被安装到项目中。

你会在 package.json 中看到如下内容：

```json
"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-hook-form": "^7.54.0",
"zod": "^3.23.8",
```

4. 安装 shadcn/ui label 组件

```bash
npx shadcn@latest add input
```

## form01 表单验证

这是一个简单的表单，它包含一个名称字段 firstName lastName 和一个邮箱字段 email。

在表单中，我们将使用 React Hook Form 作为表单状态管理工具，并使用 Zod 作为表单数据的类型校验方案，实现前端验证。


1. 定义表单数据的类型以及验证规则，在 form01 目录下创建 formSchema.ts 文件，使用 Zod 定义表单数据的类型，其内容如下所示：

```ts
import { z } from "zod";

export const schema = z.object({
    first:z.string().trim().min(1,{message:"First Name is required"}),
    last:z.string().trim().min(1,{message:"Last Name is required"}),
    email:z.string().trim().email({message:"invalid email address."}),
});
```

在对象内部，我们定义了三个字段：first、last 和 email。每个字段都有自己的验证规则：
`first: z.string().trim().min(1, { message: "First Name is required" })`

 - `z.string()`: 指定这个字段必须是字符串类型。
 - `.trim()`: 在验证之前会去除字符串两端的空白字符。
 - `.min(1, { ... })`: 指定字符串的最小长度为1（即不能为空），如果为空则显示指定的错误消息。

 如果需要 regular expression 正则表达式验证，可以使用 `.regex()` 方法。

 详情可以参考 Zod 官网：https://zod.dev/

 可以使用如下代码来验证表单数据：

```ts
const result = schema.safeParse({
  first: "John",
  last: "Doe",
  email: "john.doe@example.com"
});

if (result.success) {
  console.log("Data is valid:", result.data);
} else {
  console.log("Validation errors:", result.error.errors);
}
```

如果数据有错误，会返回错误信息，并且可以通过 result.error.errors 获取错误信息。

2. 将定义好的表单数据作用到表单上。

在 form01 目录下创建 form01.tsx 文件，表单的主要内容都在这个文件中。

我们将使用 React Hook Form 作为表单状态管理工具，结合 Zod 定义的表单数据的类型校验方案，实现前端验证。

首先，需要声明一个组件是客户端组件（Client Component）。

```tsx
"use client";
```

读取 Zod 定义的表单数据的类型，便于在表单中使用。

```tsx
type formSchema = z.output<typeof schema>;
```

useForm Hook：

```ts
const form = useForm<formSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
        first: "",
        last: "",
        email: "",
    },
});
```

1. `const form = useForm<formSchema>({ ... })`

- `useForm` 是 React Hook Form 的核心 hook，用于创建和管理表单状态。
- `<formSchema>` 是一个泛型参数，它指定了表单数据的类型。这确保了类型安全，使得 TypeScript 可以在编译时捕获潜在的类型错误。

2. `resolver: zodResolver(schema)`

- `resolver` 是 `useForm` 的一个选项，用于指定表单验证的方法。
- `zodResolver` 是一个适配器，它允许使用 Zod 库来定义和执行表单验证规则。
- `schema` 是一个 Zod `schema` 对象，定义了表单字段的验证规则（例如，必填字段、电子邮件格式等）。

除了 Zod 之外，我们在这里也可以选择其他的验证方法，例如 Yup 或 Joi。

3. `defaultValues: { first: "", last: "", email: "", }`

- `defaultValues` 选项用于设置表单字段的初始值。
- 这里为 `first`、`last` 和 `email` 字段都设置了空字符串作为默认值。

`useForm` 返回一个对象（这里命名为 form），包含了多个用于管理表单状态和行为的方法和属性。
包括 `register`（用于注册表单字段）、`handleSubmit`（处理表单提交）、`formState`（包含表单状态信息）等。

3. 将准备好的 form 添加到 Form 组件中去。

```tsx
<Form {...form}>
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
        ...
```

`<Form {...form}>`的内容：


`form` 对象是 `useForm` hook 返回的，包含了许多有用的方法和属性，例如：
register: 用于注册表单字段；handleSubmit: 处理表单提交；formState: 包含表单状态信息（如错误、是否dirty等）；control: 用于控制表单字段（尤其是在使用受控组件时）。

通过 `{...form}`，这些属性和方法被传递给 `<Form>` 组件，使其能够访问和使用 React Hook Form 的功能。


`onSubmit={form.handleSubmit(onSubmit)}`

使用 `form.handleSubmit(onSubmit)` 作为表单的 `onSubmit` 处理器，您可以利用 React Hook Form 的全部功能，同时保持对表单提交过程的完全控制。

`form.handleSubmit`这是 React Hook Form 提供的一个方法。它的主要作用是在表单提交时执行一系列预定义的操作:
a. 阻止表单的默认提交行为。
b. 触发所有注册字段的验证。
c. 如果所有验证通过：收集所有表单数据。调用您的 `onSubmit` 函数，并将收集到的数据作为参数传入。 
d. 如果验证失败：更新表单状态以显示错误。不调用 `onSubmit` 函数。

```ts
function onSubmit(data: formSchema) {
    console.log(data);
}
```
这段自定义的`onSubmit` 函数，就将收集到的表单数据作为参数 data 传入。 

```tsx
<FormField
    control={form.control}
    name="first"
    render={({ field }) => (
        ...
```

`<FormField>` 组件是一个自定义组件，用于封装表单字段的逻辑。`control` 对象包含了整个表单所有字段的状态和方法，提供了访问和管理表单状态的能力。

`name` 属性指定了表单字段的名称，它与 Zod schema 中定义的字段名称一致。`name` 属性直接影响 `render` 函数中 `field` 对象的内容。 

`render` 属性接收一个对象 `field`，它包含了表单字段的各种状态和方法。如：value: 字段当前值；onChange: 更新字段值的函数；onBlur: 处理失焦事件的函数。

在 `render` 函数中，我们使用 `field` 对象来渲染表单字段的内容。

```tsx
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
```
