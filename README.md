
#  Form 表单测试项目

本项目旨在演示如何在实际开发中集成并使用 shadcn/ui 提供的表单组件。

项目中同时引入了 React Hook Form 作为表单状态管理工具，以及 Zod 作为表单数据的类型校验方案。

项目不仅仅使用客户端验证，而且同时使用服务器端验证，当客户端浏览器禁用 JavaScript 时，服务器端仍然完成所有验证。

在本项目中，我们将使用 Next.js 作为服务端渲染，并使用 TypeScript 作为编程语言。

Zod 官网地址：https://zod.dev/

Reack hook form 官网地址：https://www.react-hook-form.com/get-started/#Quickstart

这个项目主要是学习了这位博主的视频教程：
https://www.youtube.com/watch?v=VLk45JBe8L8

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



## form02 表单验证

在 form01 的基础之上，这次支持服务器端的验证。

首先，我们定义服务器端执行的代码 formServerSubmit.ts，并将其添加到 form02 目录下。

```tsx
export type FormState = {
    message: string;
};

export async function onSubmitAction(data: FormData): Promise<FormState> {
    ...
```    

onSubmitAction 函数接收一个 FormData 对象，并返回一个 Promise 对象，其中包含了表单的服务器验证结果。

前端首先需要将接收到的表单类型转换为 FormData 对象，然后调用 onSubmitAction 函数。

```tsx
async function onSubmit(data: formSchema) {
    const formData = new FormData();
    formData.append("first", data.first);
    formData.append("last", data.last);
    formData.append("email", data.email);

    console.log(await onSubmitAction(formData));
}
```

最终，服务器端的验证结果将会返回前端的控制台中。

```json
{message: 'Email address is not valid'}
```

只是将检验结果输出到控制台，肯定不是我们想要的结果。

## form03 表单验证

想要在JavaScript disable 的情况下发送form请求到服务端，并且能够接收到响应，并显示的页面上，我们需要一点点小技巧。

### HTML form 元素中的 action 和 onsubmit 属性有不同的用途和功能：

1. action 属性：

- 定义了表单数据提交的目标 URL。
- 指定了处理表单提交的服务器脚本的位置。
- 当表单提交时，浏览器会将表单数据发送到这个 URL。
- 例子：<form action="/submit-form" method="post">

2. onsubmit 属性：

- 定义了表单提交时要执行的 JavaScript 函数。
- 通常用于在表单提交前进行客户端验证。
- 如果 onsubmit 函数返回 false，表单提交会被取消。
- 例子：<form onsubmit="return validateForm()">


看来解决第一个问题，我们需要使用 form 中的 action 属性，那么 action 中调用的函数是什么呢？

看上去我们在服务器中`onSubmitAction`就很合适？我们还需要处理一下这个函数。

### useActionState 函数

```javascript
const [state, formAction] = useActionState(onSubmitAction, { message: "" });
```

这行代码使用了 React 的 `useActionState` hook（在某些版本中也称为 `useFormState`）。让我们逐部分解释：

1. `useActionState` 函数：
   - 这是一个 React hook，用于处理表单状态和服务器操作。
   - 它通常用于 Next.js 13+ 等支持服务器组件和服务器操作的框架中。

2. 参数：
   - 第一个参数 `onSubmitAction`：这是一个函数，代表要执行的服务器操作。当表单提交时，这个函数会被调用。
   - 第二个参数 `{ message: "" }`：这是初始状态对象。在这个例子中，初始状态有一个 `message` 属性，初始值为空字符串。

3. 返回值：
   - `state`：这是一个对象，包含当前的表单状态。初始时它会是 `{ message: "" }`，但可能会随着表单交互而更新。
   - `formAction`：这是一个函数，你可以将它传递给表单的 `action` 属性。它包装了原始的 `onSubmitAction`，并处理了状态更新。


使用场景：

1. 状态管理：
   - 你可以使用 `state` 来访问表单的当前状态，比如 `state.message`。
   - 这个状态会在表单提交后自动更新，反映服务器操作的结果。

2. 表单操作：
   - `formAction` 可以直接用作表单的 `action` 属性：`<form action={formAction}>`。
   - 这样设置后，表单提交会自动触发 `onSubmitAction`，并处理状态更新。

3. 服务器交互：
   - `onSubmitAction` 函数通常是一个异步函数，处理服务器端的逻辑（如数据库操作）。
   - 操作完成后，它可以返回新的状态，这个状态会自动更新到 `state` 中。

总的来说，这行代码设置了一个受控的表单状态管理系统，集成了客户端状态和服务器端操作，使得处理表单提交和更新变得更加简单和高效。

有了 `useActionState` 这个hook，我们不仅可以使用 form 中的 action 属性，还可以将服务器端的反馈，封装到 state 中。

### useRef 函数

处理完了 `action` 属性，我们需要继续处理 `onsubmit` 属性。

useRef 是 React 提供的一个 Hook，用来在函数式组件中获取并保存某个可变的数据引用（ref）。在这个场景下，它最大的作用是让你可以访问真实的 DOM 元素。

通常在 React 中，我们通过 JSX 来描述界面，React 会为我们维护虚拟 DOM 和真实的 DOM 之间的对应关系。大多数情况下，你不需要直接接触真实的 DOM 元素。但是有一些特殊场景下，你需要对 DOM 元素进行直接的操作，这时就可以使用 useRef 来拿到这个元素的引用。

```tsx
const formRef = useRef<HTMLFormElement>(null);

return (
  <form ref={formRef}>
    {/* form fields */}
  </form>
);
```

当表单渲染到页面上之后，你就可以通过 formRef.current 来访问这个表单 DOM 节点。例如执行 formRef.current.submit() 来手动触发表单提交。

onsubmit 在 javascript 被禁止时是不可用的，我们希望在 javascript 可用时，浏览器会按照 <form> 标签上的 action 属性，将表单数据以相应的方式发送到服务器端。此时调用 `formRef.current.submit()` 即 form 表单原生的 submit 方法就可以触发浏览器的原生提交流程，这将会使用 action 属性指定的函数。

最终的代码：

```tsx
onSubmit={form.handleSubmit(() => formRef.current?.submit())}
```

首先触发 zod 中定义的字段验证，然后触发触发浏览器的原生提交流程，使用 action 属性指定的函数。

此时我们的 state.message 将会接受来自服务器端的消息，现在将其将其显示在页面上。

```tsx
{state?.message !== "" && 
     (<div className="text-red-500">{state.message}</div>)}
```

## form03 验证升级

上面的操作完成了之前的想要实现的功能，但是出现了一个新的问题，服务器返回验证信息后，把表单中的所有内容都清空了。

这是因为表单提交后，页面进行了刷新，表单内容都赋值成了初始值。

我们需要从服务器端将送去服务器端验证的表单内容返回，并重新赋值。

有了上面的经验，可以把返回值加到 FormState 中。

```tsx
export type FormState = {
    message: string;
    fields?: Record<string, string>;
}
```

在 `onSubmitAction` 函数中，如果 `schema.safeParse(formData);` 解析不成功，就需要手动将表单的值填入 fields 中。

```tsx
const fields: Record<string, string> = {};
for(const key of Object.keys(formData)){
    fields[key] = formData[key].toString();
}
```

如果 `schema.safeParse(formData);` 解析成功，`parsed.data` 就是所需要的表单数据。

最后，我们在 from 的定义中，将 state.fields 加入 defaultValues 中。

```tsx
const form = useForm<formSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
        first: "",
        last: "",
        email: "",
        ...(state?.fields ?? {}),
    },
});
```

## form 03 验证升级 2

现在服务端返回的验证信息都是我们手写到  `FormState` 的 `message` 字段中的，有些验证信息我们当时时定义到 Zod 对象中的，现在只不过是当浏览器 JavaScript 被禁止之后，绕开了前端的验证。

此时我们服务器端是否可以将原始的验证信息直接返回呢。

当然是可以的。按照上面的方法，把这些信息也封装到 FormState 中。

```tsx
export type FormState = {
    message: string;
    fields?: Record<string, string>;
    issues?: Record<string, string>;
}
```

在 `onSubmitAction` 函数中，如果 `schema.safeParse(formData);` 解析不成功，将原先 Zod 对象定义的验证信息加入到 issues 中。

```tsx
issues: parsed.error.issues.map((issue) => issue.message),
```

form 组件中，我们将 `state?.issues` 也一并显示到表单的最上面。

```tsx
{state?.issues && (
    <div className="text-red-500">
        <ul>{state.issues.map((issue) => (
               <li key={issue} className="flex gap-1">
                   <X fill="red" />
                       {issue}
                </li>))}
        </ul>
    </div>
)}

```

## form 04 表单验证

form 03 已经做得很好了，唯一的遗憾是，所有的服务器端验证错误都是在表单上方显示的，这并不是我们想要的。

能不能做到，将验证错误显示在表单每个输入框的下面，就像前端显示的那样。

这是可以的，但我们需要对之前的验证做一些修改。

首先是服务器端，需要将 issues 的格式设置成更接近于 zod parsed.error.issues的格式。

```tsx
export type FormState = {
    message: string;
    fields?: Record<string, string>;
    issues?: Record<string, string>;
};
```

然后重新赋值：

```tsx
// 将 zod 返回的错误信息（parsed.error.issues）重新组织{fieldName: message} 的结构
const fieldsErrors: Record<string, string> = {};
parsed.error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
        fieldsErrors[issue.path[0]] = issue.message;
    }
})
return {
    message: "parsed.error.message",
    fields: fields,
    issues: fieldsErrors
};
```

如果 `schema.safeParse(formData);` 解析成功，我们需要手动设置 issues 的值。

```tsx
return {
    message: "Email address is not valid a from server message",
    fields: parsed.data,
    issues: { email: "Email address is not valid a from serveissue" }
};
```

服务器端完成后，现在开始在客户端显示错误信息。

### useEffect hook

useEffect 是 React 中最常用和最强大的 Hook 之一。它允许你在函数组件中执行副作用操作。副作用可以是数据获取、订阅、手动修改 DOM 等任何可能影响到组件外部的操作。


以下是 useEffect 的基本用法和一些重要概念：


基本语法：

```jsx

useEffect(() => {
  // 副作用代码
  return () => {
    // 清理函数（可选）
  };
}, [dependencies]);
```

- 执行时机：useEffect 在每次渲染后执行。首次渲染后会执行一次，之后在依赖项变化时再次执行。

- 依赖数组：第二个参数是一个可选的依赖数组。如果提供了依赖数组，effect 只会在依赖项变化时重新执行。空数组 [] 表示 effect 只在组件挂载和卸载时执行。如果不提供依赖数组，effect 会在每次渲染后执行。

前端代码中添加 useEffect，如果 state?.issues 或 form 中的任何一个发生变化，就重新执行 effect。

```tsx
useEffect(() => {
    if (state?.issues) {
        Object.entries(state.issues).forEach(([field, message]) => {
            form.setError(field as keyof formSchema, { message });
        });
    }
}, [state?.issues, form]);
```

但这会引起一个错误，由于 `useEffect` 的依赖项引起的无限循环更新导致的。也就是说，在 `useEffect` 中调用 `form.setError` 后会引起组件的 `state` 或 `props` 改变，从而再次触发 `useEffect`，形成死循环。

如何解决这个问题？这里需要介绍一下 `useRef` 的一个特殊功能。

`useRef` 通常用于获取 DOM 元素的引用。但这只是 `useRef` `的一个常见用途。useRef` 实际上可以用来存储任何可变值，这个值在组件的整个生命周期内保持不变。

在函数组件中，每次渲染都会重新执行整个函数体。普通变量会在每次渲染时重新初始化，而 `useRef` 创建的引用在组件的整个生命周期中保持不变。

使用 `useRef` 记录组件生命周期中state.issues 的每次变化，从而避免了无限循环的问题：

```tsx
const prevIssuesRef = useRef<Record<string, string> | undefined(undefined);
useEffect(() => {
    if (state?.issues && state.issues !== prevIssuesRef.current) {
        Object.entries(state.issues).forEach(([field, message]) => {
            form.setError(field as keyof formSchema, { message });
        });
    }
    prevIssuesRef.current = state.issues;
}, [state?.issues, form]);
```

最后，我们需要将服务器端获取的验证信息显示在表单正确的位置。

之前的验证信息默认显示在 `<FormMessage >`标签中，这次我们可以手写 `FormMessage` 标签。

```tsx
<FormMessage >
    {state?.issues?.first && <spanissues.first}</span>}
</FormMessage>
```

OK! 所有问题都解决了！