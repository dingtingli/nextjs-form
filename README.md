# Form 表单验证测试项目

本项目是一个基于 Next.js、React Hook Form、Zod 以及 [shadcn/ui](https://ui.shadcn.com/) 的表单验证示例应用。

目标是展示如何在实际开发中集成这些组件与工具，并实现前后端双端表单验证：  
- **前端验证**：通过 React Hook Form 与 Zod 实现数据类型校验与错误提示。  
- **后端验证**：在浏览器禁用 JavaScript 时，服务端仍可接收与验证表单数据，并返回相应的验证信息。  

同时，项目采用 TypeScript 提升类型安全性，通过 Next.js 提供服务端渲染和路由功能。

## 特性

- **完整的表单验证流程**：从前端到后端的无缝验证，让您的应用在无 JS 环境下依旧可用。
- **Zod 类型安全校验**：通过直观简洁的 Zod schema 定义字段规则，不仅类型安全，还能提供清晰友好的错误信息。
- **React Hook Form 简化表单状态管理**：轻松处理输入数据、验证状态与表单提交逻辑。
- **shadcn/ui 组件库整合**：使用风格一致、易扩展的 UI 组件进行表单布局与组件封装。
- **服务端响应回填**：服务端验证错误可回填到表单，使得提交后页面刷新依然显示错误提示与用户输入数据。

## 技术栈

- **框架**：Next.js
- **语言**：TypeScript
- **表单验证**：React Hook Form + Zod
- **UI 组件**：shadcn/ui

## 快速开始

### 1. 创建基本项目

使用 Next.js 创建初始应用：  
```bash
npx create-next-app@latest
```

### 2. 安装 shadcn/ui

```bash
npx shadcn@latest init
```

### 3. 安装表单组件与验证依赖

执行以下命令将自动安装 `shadcn/ui` form 组件，以及 Zod、React Hook Form 等依赖：

```bash
npx shadcn@latest add form
```

此时，`package.json` 中将包含：

```json
"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-hook-form": "^7.54.0",
"zod": "^3.23.8"
```

### 4. 安装输入组件

```bash
npx shadcn@latest add input
```

### 5. 运行开发环境

```bash
npm run dev
```

项目在本地 `http://localhost:3000` 启动。

## form01 表单基础前端验证

在这一示例中，我们将构建一个最基础的表单验证流程。表单包含三个核心字段：`first`、`last` 和 `email`，分别代表用户的名、姓以及电子邮箱地址。

我们将使用 **React Hook Form** 作为表单的状态管理工具，并结合 **Zod** 为数据类型与规则校验提供强大的支持，从而在提交表单时实现更严格且清晰的前端验证逻辑。

### 1. 定义表单数据类型与验证规则

在 `form01` 目录中创建 `formSchema.ts` 文件。通过 Zod，我们可以直观地定义每个字段的类型与验证规则。下面是示例代码：

```ts
import { z } from "zod";

export const schema = z.object({
    first: z.string().trim().min(1, { message: "First Name is required" }),
    last: z.string().trim().min(1, { message: "Last Name is required" }),
    email: z.string().trim().email({ message: "invalid email address." }),
});
```

这里定义了三个字段：

- `first`: 必须为非空字符串（`min(1)`）并自动去除首尾空格（`trim()`）。

- `last`: 同 `first`，必填且去除空格。

- `email`: 必须为有效的邮箱格式，Zod 会根据 `.email()` 自动校验。

Zod 支持丰富的验证方式，如果您需要正则匹配等高级验证逻辑，可以使用 `.regex()` 方法等更多功能（详见 [Zod 官方文档](https://zod.dev/)）。

校验数据示例：

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

成功时 `result.data` 为合法数据对象，失败时 `result.error.errors` 会详细列出所有的验证错误信息。

### 2. 将验证规则集成到表单组件中

在 `form01` 目录下创建 `form01.tsx` 文件。这里将展示如何将上述的 Zod 校验规则与 React Hook Form 的状态管理无缝整合。

#### 声明为客户端组件

由于我们需要在浏览器端运行表单逻辑与验证，需要在文件顶部声明：

```tsx
"use client";
```

#### 类型与 useForm Hook 设置

我们使用由 `z.output<typeof schema>` 推导的类型来确保表单数据与验证规则同步更新：

```tsx

type formSchema = z.output<typeof schema>;

const form = useForm<formSchema>({
  resolver: zodResolver(schema),
  defaultValues: {
    first: "",
    last: "",
    email: "",
  },
});
```

**解析重点**：

- `useForm<formSchema>`：`useForm` 是 React Hook Form 的核心 hook，用于创建和管理表单状态。

    `<formSchema>` 是一个泛型参数，它指定了表单数据的类型。
- `resolver: zodResolver(schema)`: `resolver` 是 useForm 的一个选项，用于指定表单验证的方法。

    `zodResolver` 是一个适配器，它允许使用 Zod 库来定义和执行表单验证规则。
    
    `schema` 是一个 Zod schema 对象，定义了表单字段的验证规则。

    *除了 Zod 之外，我们在这里也可以选择其他的验证方法，例如 Yup 或 Joi。*

- `defaultValues`：为表单字段提供初始值。这使得表单在初次渲染时有一个可控的初始状态。

`useForm` 返回的对象（此处命名为 `form`）包含了如 `register`、`handleSubmit`、`formState`、`control` 等多种可用于表单操作的方法与状态信息。

### 3. 将 form 对象应用到组件中

利用 `shadcn/ui` 提供的 `<Form>`、`<FormField>`、`<FormItem>`、`<FormControl>` 等组件，我们可以轻松定义表单结构与样式。下面是一个简化示例片段：

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
    {/* 同理定义 last 和 email 字段 */}
  </form>
</Form>
```

**解析重点**：

- `<Form {...form}>`：通过扩展语法将 `useForm` 返回的全部属性与方法传入 `<Form>` 组件中。

- `onSubmit={form.handleSubmit(onSubmit)}`：React Hook Form 提供的 `handleSubmit` 方法会在表单提交时自动运行验证逻辑，如果通过验证则调用 `onSubmit` 函数，否则显示错误信息。

    自定义 `onSubmit` 函数：

    ```tsx
    function onSubmit(data: formSchema) {
        console.log("Submitted Data:", data);
    }
    ```

- `<FormField>`、`<FormItem>`、`<FormLabel>`、`<FormControl>`、`<FormMessage>` 等组件将渲染完整的表单元素与错误提示结构。其中：

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

- `<FormField control={form.control} name="first">` :
    
    `control` 对象包含了整个表单所有字段的状态和方法，提供了访问和管理表单状态的能力。

    `name` 属性指定了表单字段的名称，它与 Zod schema 中定义的字段名称一致。name 属性直接影响 `render` 函数中 `field` 对象的内容。

- `render` 属性中使用 `({ field }) => ...` 回调函数可以从 `field` 获取当前字段的值与操作函数（如 `onChange`、`onBlur`）并将其绑定到 `<Input>`。
  
- `<FormMessage>` 将在验证失败时显示相应的错误信息。

当用户提交表单并通过 Zod 验证后，`data` 将包含已清洗并验证合格的表单数据。

通过 `form01` 的示例，我们已经能够轻松地将前端类型校验集成到表单中，实现基本的表单验证流程。接下来您可以进一步探索后续示例，以了解如何在禁用 JS 的情况下启用服务端验证，以及如何在提交后从服务端返回错误信息并将其显示在表单中。


## form02 服务端验证集成

在 `form02` 中，我们将基于 `form01` 的成果进一步拓展，为表单添加 **服务器端验证** 的逻辑。

这意味着表单在前端完成基础校验后，还会将数据提交到服务端，再进行一轮验证与处理。

这一功能在实际应用中十分常见，特别是当需要检查数据在后端的有效性（如邮箱是否已被注册）或进行数据库查询时。

### 服务器端处理函数：onSubmitAction

首先，我们在 `form02` 目录下创建 `formServerSubmit.ts` 文件，并定义一个服务器端执行的异步函数 `onSubmitAction`。

该函数接收 `FormData` 对象，代表用户提交的表单数据，并返回一个 `Promise` 对象，其中包含表单服务器端处理结果：

```tsx
// formServerSubmit.ts
export type FormState = {
  message: string;
};

export async function onSubmitAction(data: FormData): Promise<FormState> {
  // 在这里进行服务器端的验证与业务逻辑处理
  // 例如：检查数据库中邮箱是否存在
  // 返回一个对象，其中包含验证结果或错误信息
  return { message: "Email address is not valid" };
}
```

在这个示例中，我们简单地返回一条错误消息。实际开发中，您可以在这里执行更复杂的操作：与数据库交互、调用外部 API、或进行进一步的逻辑验证。

### 前端与服务器的交互

在客户端提交表单时，我们需要将 React Hook Form 的数据转换为 `FormData` 格式，然后调用 `onSubmitAction` 函数：

```tsx
async function onSubmit(data: formSchema) {
  // 将前端的 data 转换为 FormData 形式
  const formData = new FormData();
  formData.append("first", data.first);
  formData.append("last", data.last);
  formData.append("email", data.email);

  // 调用服务器端验证逻辑
  const result = await onSubmitAction(formData);
  console.log("Server validation result:", result);
}
```

在上面的代码中：

1. **数据转换**：`data` 是前端表单的提交结果（已通过前端校验的结果对象），我们手动将其转换成 `FormData`。  

2. **服务器调用**：`await onSubmitAction(formData)` 发起异步请求（在实际项目中可能是通过 Next.js 的服务端函数调用或 API 路由），获得一个包含验证信息的响应对象。  

3. **打印结果**：目前示例只是将服务器端的返回结果打印到控制台。实际开发中，您可能会将这个结果用于更新界面状态，或在页面上向用户显示更友好的错误提示信息。

运行代码后，您将在控制台中看到类似的信息：

```json
{ "message": "Email address is not valid" }
```

虽然当前只是将服务端验证结果输出到控制台，但这已经为下一步奠定了基础。

在 `form03` 中，我们将探讨如何在禁用 JavaScript 的情况下，使用 `<form>` 的原生特性（`action` 属性）直接将表单提交到服务器端。

这样，即使用户的浏览器不运行 JavaScript，您的表单也能够继续提供友好的验证与反馈体验。


## form03 表单验证

在 `form02` 中，我们通过前端将数据传递给服务器端函数获得验证结果。但是，如果用户禁用了浏览器的 JavaScript，前端验证代码将不起作用。

此时，我们仍然希望表单提交能够直接发送到服务端并获取相应的处理结果。这就需要借助表单的原生 `action` 属性与服务端渲染（SSR）机制，让表单在无 JavaScript 环境下也能正常工作。

### 无 JavaScript 场景与表单提交方式

当 JavaScript 被禁用时，表单提交将完全依赖于 HTML 的原生行为。  

HTML form 元素中的 action 和 onsubmit 属性有不同的用途和功能：

- **`action` 属性**：决定了提交数据将被发送到哪个 URL 或服务器处理函数。浏览器在用户点击提交按钮时，会自动将表单数据以 `POST` 或 `GET` 请求的方式发送到指定的服务器端路由或函数。

- **`onsubmit` 属性**：则是依赖于 JavaScript 的事件处理函数。如果无 JS 环境下，`onsubmit` 将失效，此时只有 `action` 属性能确保表单仍能提交数据到服务器。

### 将后端逻辑融入 `action`

在 `form03` 中，我们希望在无 JS 环境下，用户提交表单后仍能得到服务器返回的验证结果，并将结果更新到页面中。

这要求表单的 `action` 属性直接指向后端处理逻辑，这可以借助 `useActionState` 来实现。

### useActionState Hook

```javascript
const [state, formAction] = useActionState(onSubmitAction, { message: "" });
```

这里的 `useActionState` 是 React 框架提供的 Hook，用于将服务器操作与前端状态管理联系起来：

1. **`onSubmitAction`**：服务器端的处理函数，会在表单提交时执行。

2. **初始状态 `{ message: "" }`**：指定初始状态对象。

3. **返回值**：`[state, formAction]`  
   - `state`：动态跟踪表单提交和服务器响应状态，如服务器返回的消息、错误等。
   - `formAction`：将其赋值给 `<form>` 标签的 `action` 属性，使表单的原生提交直接调用 `onSubmitAction` 函数。当无 JS 环境下，浏览器提交表单时，服务器端就会执行 `onSubmitAction`，并将结果返回给页面。

使用场景与优势：

- **状态管理**：`state` 可以随服务器响应更新，这在无 JS 环境下尤其宝贵。即使用户关闭了 JavaScript，服务器端返回的验证结果仍可以在服务器渲染的页面中体现出来。
- **自动触发服务器逻辑**：`<form action={formAction}>` 将表单的提交与服务器函数深度绑定，不需要额外的客户端脚本。
- **一致的用户体验**：无论是否开启 JavaScript，用户提交表单后都能得到相应的验证反馈。

### useRef 引用 DOM 节点

为在有 JavaScript 环境下更灵活地控制表单提交流程，我们还需要使用 `useRef` 获取表单的真实 DOM 节点引用，以便在前端验证通过后，再以浏览器原生方式提交表单。

```tsx
const formRef = useRef<HTMLFormElement>(null);

return (
  <form ref={formRef} action={formAction} method="post">
    {/* 表单字段 */}
  </form>
);
```

*`useRef` 是 React 提供的一个 Hook，用来在函数式组件中获取并保存某个可变的数据引用（ref）。在这个场景下，它最大的作用是让你可以访问真实的 DOM 元素。*

*通常在 React 中，我们通过 JSX 来描述界面，React 会为我们维护虚拟 DOM 和真实的 DOM 之间的对应关系。*

*大多数情况下，你不需要直接接触真实的 DOM 元素。但是有一些特殊场景下，你需要对 DOM 元素进行直接的操作，这时就可以使用 `useRef` 来拿到这个元素的引用。*

当表单渲染到页面上之后，你就可以通过 `formRef.current`来访问这个表单 DOM 节点。

例如执行 `formRef.current.submit()` 来手动触发表单提交。

`onsubmit` 在 javascript 被禁止时是不可用的，但我们希望在 javascript 可用时，浏览器也会按照 `<form>` 标签上的 `action` 属性，将表单数据以相应的方式发送到服务器端。

此时调用 `formRef.current.submit()` 即 `form` 表单原生的 submit 方法就可以触发浏览器的原生提交流程，这将会使用 action 属性指定的函数。

```tsx
onSubmit={form.handleSubmit(() => formRef.current?.submit())}
```

执行两步：
1. **前端验证**：`form.handleSubmit()` 会触发 Zod 验证逻辑。如果验证失败，显示错误消息而不提交表单。如果验证通过，则执行回调函数。
2. **原生提交**：`formRef.current?.submit()` 调用浏览器原生提交流程，利用 `action={formAction}` 将表单数据发送至服务器端函数 `onSubmitAction`，而不依赖 `onsubmit` 的 JavaScript。

### 显示服务器端返回的验证信息

当服务器处理完表单数据并返回状态后，该状态会更新 `state` 对象。我们可以直接在页面中使用状态来显示服务器返回的消息：

```tsx
{state?.message && <div className="text-red-500">{state.message}</div>}
```

这样，无论 JavaScript 是否可用，用户在提交表单后都能看到服务器端的验证反馈。

如果有 JS，前端会先行验证并在通过后使用原生提交到服务器。

如果无 JS，表单提交直接走服务器端逻辑并返回结果。整个系统的设计，确保了表单在各种环境下都能顺畅工作。

通过 `form03` 的示例，我们完成了一个在无 JavaScript 环境下依旧可以正常提交并得到验证结果的表单。

借助 `action` 属性、`useActionState`、`useRef` 等工具，我们让前后端验证流程无缝衔接，为用户提供一致的体验。

## form03 验证升级

在前一个阶段的实现中，我们已经能在无 JavaScript 环境下让表单提交给服务器并返回验证结果。

但还有一个细节需要完善：**当服务器返回验证错误后，页面会刷新并导致表单恢复到默认空值，从而丢失了用户先前输入的内容**。这对于用户体验来说并不友好。

### 问题原因

在提交表单时，浏览器会默认刷新页面并重新渲染组件。尽管我们从服务器返回了验证消息，但由于初始状态中 `defaultValues` 被设定为空字符串，用户输入的内容在页面重载后并未被保留。

### 解决方案：将用户输入值从服务器端返回

要解决这一问题，我们需要让服务器在验证失败时，不仅返回错误消息，还返回用户提交的字段值。然后，在前端重新初始化表单时，将这些字段值作为默认值填入，从而让用户看到他们先前输入的内容，无需再次填写。

#### 更新 FormState 类型

在服务器端返回的数据结构中新增 `fields` 字段，用于存储表单提交时的字段值。`FormState` 类型可定义为：

```tsx
export type FormState = {
    message: string;
    fields?: Record<string, string>;
};
```

- `message`: 用于存放服务器返回的概览性提示（例如错误摘要或成功提示）。
- `fields`: 一个键值对对象，存放提交时用户输入的各项数据字段。

#### 在服务器端收集用户输入

在 `onSubmitAction` 函数中，若验证失败，我们需要将用户提交的字段值从 `FormData` 中提取，并存放到 `fields` 中。

当表单重新渲染时，会使用这些值作为初始数据，从而使用户先前输入的内容得以保留。

```tsx
const fields: Record<string, string> = {};
for (const key of formData.keys()) {
    fields[key] = formData.get(key)?.toString() ?? "";
}
```

如果验证成功，则 `parsed.data` 中已经包含经过清洗和验证的用户数据。但在验证失败时，我们需要手动将用户原始输入的数据附加到 `fields` 中返回。

#### 在前端使用服务器返回的数据作为初始值

在前端组件中（例如 `form03.tsx`），初始化表单时除了默认的空值，还需要将 `state.fields` 中的数据合并进来：

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

`...(state?.fields ?? {})` 使用扩展运算符将服务器返回的 `fields` 字段解构并合并到 `defaultValues` 中。如果服务器未返回 `fields`，则使用空对象作为回退。

### 效果与提升

完成上述步骤后，当服务器端验证失败返回错误信息时，页面刷新后会自动将原有输入值填入对应的表单字段中。

用户无需重复输入先前的数据，极大改善了用户体验。同时，服务器返回的错误信息依旧保存在 `state.message` 中，让用户清晰了解验证失败的原因。

通过这一步的升级，我们实现了前后端协同，使得表单在无 JavaScript 环境下依然保持良好的可用性和用户友好度——表单提交、错误反馈、以及用户先前输入的持久化都得到了有效保障。

## form03 验证升级 2

在之前的步骤中，我们通过 `message` 字段在 `FormState` 中返回了一些服务端验证的信息。

然而，这些信息是我们在服务器端手动撰写的提示语句，与前端验证使用 Zod 定义的规则并输出的错误信息并不完全同步。

这意味着当用户在禁用 JavaScript 的情况下提交表单时，服务器端可能需要重复定义同样的错误提示，从而引入不必要的冗余和维护成本。

### 将 Zod 验证错误直接返回给前端

Zod 在解析失败时会生成结构化的错误对象 `parsed.error.issues`，其中包含每个字段的详细错误信息，包括字段名称与对应的错误提示。

为了避免重复定义错误消息，我们可以将这些 Zod 的原生错误信息直接回传给前端，让页面在无 JS 环境下同样显示出与前端验证一致的提示。

### 扩展 FormState

在 `FormState` 中新增 `issues` 字段来存放 Zod 返回的错误信息。与 `fields` 类似，`issues` 是一个字符串键值对对象，用于记录特定字段及其对应的验证错误提示。

```tsx
export type FormState = {
    message: string;
    fields?: Record<string, string>;
    issues?: Record<string, string>;
};
```

- `message`: 通用提示信息或验证结果概要（可选）
- `fields`: 用户提交的表单字段值，确保页面刷新后数据仍能回填
- `issues`: 字段级错误信息的集合，与 Zod 验证规则精确对应

### 从服务器端收集 Zod 错误信息

在 `onSubmitAction` 函数中，如果 `schema.safeParse(formData)` 返回验证失败的信息，我们可以直接从 `parsed.error.issues` 中提取验证错误，并构造 `issues` 对象：

```tsx
const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of formData.keys()) {
        fields[key] = formData.get(key)?.toString() ?? "";
    }

    // 将 Zod 的错误信息映射为 { fieldName: message } 形式的对象
    const issues: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString() ?? "unknown";
        issues[fieldName] = issue.message;
    });

    return {
        message: "Validation errors occurred",
        fields: fields,
        issues: issues,
    };
}

// 如果验证通过...
```

### 在页面上显示 Zod 返回的错误信息

在前端组件中接收到 `state.issues` 后，我们可以在页面上方集中显示这些错误信息，为用户提供更清晰的引导：

```tsx
{state?.issues && (
    <div className="text-red-500">
        <ul>
            {Object.entries(state.issues).map(([field, error]) => (
                <li key={field} className="flex gap-1 items-center">
                    <X fill="red" className="w-4 h-4" />
                    <span>{error}</span>
                </li>
            ))}
        </ul>
    </div>
)}
```

此时，无论 JavaScript 是否可用，用户都会在提交表单后看到与前端校验规则保持一致的错误提示。

通过直接利用 Zod 的错误信息，我们避免了在服务器端重复编写错误文案，确保前后端验证逻辑与错误提示的统一和一致。

这一升级让我们实现了真正的「单一消息源（Single Source of Truth）」。

Zod 定义的验证规则与错误消息在前后端环境下均可复用，从而减少了维护成本，同时提高了用户体验的一致性。

## form04 表单验证

在之前的步骤中，我们成功实现了在无 JavaScript 环境下对表单进行验证，并将错误信息以及用户输入的字段值进行回填。

然而，仍存在一个遗憾：**服务器端返回的验证错误信息只能集中显示在表单上方，而不能像前端验证一样，直接显示在对应的输入字段下方**。

本章节将解决这个问题，让服务器端验证的错误信息在禁用 JS 的情况下也能与前端验证保持一致的显示方式。

### 改进服务器端错误格式

首先，我们需要让服务器端返回的错误信息与 Zod 的 `parsed.error.issues` 格式更加接近。这样，我们就能在客户端通过字段名快速将错误信息定位到相应的输入字段上。

`FormState` 可以定义成：

```tsx
export type FormState = {
    message: string;
    fields?: Record<string, string>;
    issues?: Record<string, string>;
};
```

当服务器验证失败时，我们从 `parsed.error.issues` 中提取每个字段的错误信息，并构造成类似 `{ [fieldName]: message }` 的结构：

```tsx
const fieldsErrors: Record<string, string> = {};
parsed.error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
        fieldsErrors[issue.path[0]] = issue.message;
    }
});

return {
    message: "Validation encountered errors",
    fields: fields,
    issues: fieldsErrors,
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

这样，服务端就返回了一组与前端一致的字段级错误信息。


### 将服务器端错误渲染到对应的输入框下方

在客户端中，我们需要将服务器端返回的 `issues` 映射到 React Hook Form 的错误状态中，从而让 `<FormMessage>` 或其他组件在特定字段下展示相应的错误提示。

#### 使用 useEffect 同步服务器端错误

通过 `useEffect`，我们可以在服务器返回错误（`state.issues`）时，将其传递给 React Hook Form 的 `setError` 方法。这样，React Hook Form 就能在对应字段处显示错误提示。

```tsx
useEffect(() => {
    if (state?.issues) {
        Object.entries(state.issues).forEach(([field, message]) => {
            form.setError(field as keyof formSchema, { message });
        });
    }
}, [state?.issues, form]);
```

但这样可能会引起一个问题：如果 `useEffect` 在每次渲染时检测到 `state.issues` 未变化，那么就会形成循环调用，导致组件无限重渲染。

*`useEffect` 是 React 中最常用和最强大的 Hook 之一。它允许你在函数组件中执行副作用操作。副作用可以是数据获取、订阅、手动修改 DOM 等任何可能影响到组件外部的操作。*


*以下是 useEffect 的基本用法和一些重要概念：*


```jsx
useEffect(() => {
  // 副作用代码
  return () => {
    // 清理函数（可选）
  };
}, [dependencies]);
```

*- 执行时机：useEffect 在每次渲染后执行。首次渲染后会执行一次，之后在依赖项变化时再次执行。*

*- 依赖数组：第二个参数是一个可选的依赖数组。如果提供了依赖数组，effect 只会在依赖项变化时重新执行。空数组 [] 表示 effect 只在组件挂载和卸载时执行。如果不提供依赖数组，effect 会在每次渲染后执行。*

*前端代码中添加 useEffect，如果 state?.issues 或 form 中的任何一个发生变化，就重新执行 effect。*

#### 使用 useRef 防止死循环

我们可以使用 `useRef` 来存储 `state.issues` 的前一次状态，以便只在新的错误信息出现时才调用 `setError`。

```tsx
const prevIssuesRef = useRef<Record<string, string> | undefined>(undefined);

useEffect(() => {
    if (state?.issues && state.issues !== prevIssuesRef.current) {
        Object.entries(state.issues).forEach(([field, message]) => {
            form.setError(field as keyof formSchema, { message });
        });
        prevIssuesRef.current = state.issues;
    }
}, [state?.issues, form]);
```

*这样，只有在 `state.issues` 发生实际变化时，才会调用 `setError`，避免了死循环问题。*

*`useRef` 通常用于获取 DOM 元素的引用。但这只是 `useRef` 的一个常见用途。`useRef` 实际上可以用来存储任何可变值，这个值在组件的整个生命周期内保持不变。*

*在函数组件中，每次渲染都会重新执行整个函数体。普通变量会在每次渲染时重新初始化，而 `useRef` 创建的引用在组件的整个生命周期中保持不变。*

*使用 `useRef` 记录组件生命周期中 `state.issues` 的每次变化，从而避免了无限循环的问题**

### 在字段下显示服务端错误信息

现在，React Hook Form 已将服务器端的错误信息融入自身的错误状态中。

每个字段都可以通过 `<FormMessage>`（或自定义的错误显示组件）展示其专属错误信息，而不必再集中在表单顶部。

```tsx
<FormItem>
    <FormLabel>First Name</FormLabel>
    <FormControl>
        <Input {...form.register("first")} placeholder="First Name" />
    </FormControl>
    <FormDescription>Your First Name</FormDescription>
    <FormMessage /> {/* 此处将自动显示该字段的错误信息 */}
</FormItem>
```

通过这种方式，即便用户在禁用 JavaScript 的环境下提交表单，也能在页面刷新后看到服务器端返回的针对每个字段的错误提示，就像前端校验时的体验一样。

通过以上改进，我们已实现了更优雅、统一的用户体验：**无论前端验证还是后端验证错误信息，都能精确地显示在对应的字段下方**。

这不仅提高了用户填写表单的体验，也使代码维护更容易，因为前后端的错误信息格式和显示逻辑保持了一致。

好了! 所有问题都解决了！

## 更多资料

- **Zod 文档**: [https://zod.dev/](https://zod.dev/)  
- **React Hook Form 文档**: [https://www.react-hook-form.com/get-started/#Quickstart](https://www.react-hook-form.com/get-started/#Quickstart)  
- **shadcn/ui**: [https://ui.shadcn.com/](https://ui.shadcn.com/)  
- **Next.js**: [https://nextjs.org/](https://nextjs.org/)

## 致谢

本项目的来源于以下教程：
https://www.youtube.com/watch?v=VLk45JBe8L8

## 贡献指南

如果您对本项目有改进建议或新特性需求，欢迎提出 Issue 或提交 Pull Request。请遵守基本的代码风格与提交信息规范。

## 许可协议

本项目以 MIT License 开源，欢迎自由使用与二次开发。