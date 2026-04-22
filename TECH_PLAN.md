# DevTools 技术方案

## 1. 项目概述

### 1.1 项目背景

克隆自 [it-tools.tech](https://it-tools.tech)，打造一个面向开发者的在线工具集合网站。

### 1.2 核心特点

- 🌙 深色主题（默认）
- ⚡ 纯前端处理（保护隐私，无需上传数据）
- 🔍 全局搜索 (Cmd+K)
- 🌐 多语言支持
- 📱 响应式设计
- 🚀 实时转换

***

## 2. 技术选型

### 2.1 核心框架

| 选项    | 方案                    | 优点                 | 缺点     |
| ----- | --------------------- | ------------------ | ------ |
| **A** | Next.js + TailwindCSS | SSR/SSG、SEO友好、社区活跃 | 学习曲线   |
| **B** | Vue3 + Vite           | 轻量、开发快、组合式API      | SEO 一般 |
| **C** | React + Vite          | 生态丰富、组件化           | 稍重     |

**推荐方案：A - Next.js + TailwindCSS**

理由：

1. it-tools 本身就是 Next.js 构建
2. SSR 支持 SEO（工具页面可被搜索引擎索引）
3. App Router 支持 layout 和中间件
4. TailwindCSS 原生支持深色模式

### 2.2 UI 组件库

| 选项    | 方案                              |
| ----- | ------------------------------- |
| **A** | shadcn/ui (基于 Radix + Tailwind) |
| **B** | Ant Design                      |
| **C** | Chakra UI                       |

**推荐方案：A - shadcn/ui**

理由：

1. 可定制性强，按需引入
2. 基于 Radix UI 无障碍支持好
3. 与 TailwindCSS 无缝集成
4. 样式完全可控

### 2.3 技术栈汇总

```
框架:      Next.js 14+ (App Router)
样式:      TailwindCSS + shadcn/ui
状态管理:  React hooks / Zustand (复杂工具)
图标:      Lucide React
国际化:    next-intl
搜索:      Fuse.js (客户端) / Algolia (可选)
构建:      Turbopack (开发) / SWC (生产)
部署:      Vercel / 任意 Node.js 环境
```

***

## 3. 项目结构

```
devtools/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (layout)/           # 主布局
│   │   │   ├── layout.tsx      # 深色主题 + 导航
│   │   │   └── page.tsx        # 首页工具列表
│   │   ├── tools/              # 工具页面
│   │   │   ├── json-yaml/
│   │   │   ├── base64/
│   │   │   └── ...
│   │   ├── about/
│   │   └── docs/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── tools/              # 工具组件
│   │   │   ├── converter/      # 转换器基础组件
│   │   │   └── generator/      # 生成器基础组件
│   │   ├── layout/             # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── SearchDialog.tsx    # 搜索弹窗
│   ├── lib/
│   │   ├── tools/              # 工具实现
│   │   │   ├── crypto/         # 加密相关
│   │   │   │   ├── hash.ts
│   │   │   │   ├── uuid.ts
│   │   │   │   └── bcrypt.ts
│   │   │   ├── converter/      # 格式转换
│   │   │   │   ├── json-yaml.ts
│   │   │   │   ├── json-toml.ts
│   │   │   │   ├── base64.ts
│   │   │   │   └── ...
│   │   │   ├── generator/      # 生成器
│   │   │   └── parser/         # 解析器
│   │   ├── utils.ts            # 工具函数
│   │   └── cn.ts               # classNames 工具
│   ├── hooks/                  # React hooks
│   ├── config/
│   │   └── tools.ts            # 工具配置清单
│   └── i18n/                   # 国际化
│       ├── en.json
│       ├── zh.json
│       └── ...
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

***

## 4. 核心功能模块设计

### 4.1 工具类型抽象

```typescript
// 基础工具接口
interface Tool {
  id: string;                    // 唯一标识 slug
  name: string;                  // 显示名称
  description: string;           // 描述
  category: ToolCategory;        // 分类
  icon: LucideIcon;             // 图标
  component: React.ComponentType; // 工具组件
}

// 转换器接口
interface ConverterTool extends Tool {
  inputType: 'text' | 'file' | 'mixed';
  outputType: 'text' | 'file' | 'image';
  direction?: 'encode' | 'decode' | 'both';
}

// 生成器接口
interface GeneratorTool extends Tool {
  outputType: 'text' | 'file' | 'qrcode';
}
```

### 4.2 工具配置清单

```typescript
// config/tools.ts
export const tools = [
  {
    id: 'json-yaml',
    name: { en: 'JSON to YAML', zh: 'JSON 转 YAML' },
    category: 'converter',
    icon: 'FileCode',
  },
  // ...
] as const;
```

### 4.3 通用转换器组件

```typescript
// components/tools/ConverterTool.tsx
interface ConverterToolProps {
  title: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  convert: (input: string) => string | Promise<string>;
  sampleInput?: string;
}

// 使用方式
<ConverterTool
  title="JSON to YAML"
  inputPlaceholder="Paste JSON here..."
  outputPlaceholder="YAML output..."
  convert={jsonToYaml}
/>
```

***

## 5. 页面路由设计

### 5.1 路由结构

```
/                           # 首页 - 工具分类列表
/tools                      # 工具分类页
/tools/[category]/          # 分类下的工具列表
/tools/[tool-id]/           # 单个工具页面
/search?q=xxx              # 搜索结果页
/about                      # 关于页面
/docs                       # 文档
```

### 5.2 工具页面模板

```typescript
// app/tools/[tool-id]/page.tsx
export default function ToolPage({ params }: { params: { tool: string } }) {
  const tool = getTool(params.tool);
  return (
    <ToolLayout title={tool.name}>
      <tool.component />
    </ToolLayout>
  );
}
```

***

## 6. 搜索功能设计

### 6.1 Cmd+K 搜索弹窗

```
┌─────────────────────────────────────┐
│ 🔍 搜索工具...                       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔄 JSON to YAML                 │ │
│ │    JSON 转 YAML 格式             │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🔄 YAML to JSON                 │ │
│ │    YAML 转 JSON 格式             │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ↵ 选中  esc 关闭                     │
└─────────────────────────────────────┘
```

### 6.2 搜索实现

```typescript
// 使用 Fuse.js 客户端搜索
import Fuse from 'fuse.js';

const fuse = new Fuse(tools, {
  keys: ['name', 'description', 'tags'],
  threshold: 0.3,
});

const results = fuse.search(query);
```

***

## 7. 深色主题方案

### 7.1 主题切换

```typescript
// 使用 next-themes
<ThemeProvider attribute="class" defaultTheme="dark">
  {children}
</ThemeProvider>
```

### 7.2 TailwindCSS 主题变量

```typescript
// tailwind.config.ts
colors: {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  // shadcn 变量...
}
```

***

## 8. 国际化方案

### 8.1 使用 next-intl

```typescript
// middleware.ts
export default NextRequest => {
  // 根据 Accept-Language 或路径选择语言
};

// 使用
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('tools');
  return <h1>{t('json-yaml.title')}</h1>;
}
```

### 8.2 语言文件结构

```
messages/
├── en.json
├── zh.json
├── de.json
└── ...
```

***

## 9. 开发优先级

### Phase 1: 框架搭建 ⭐

- [ ] 初始化 Next.js 项目
- [ ] 配置 TailwindCSS + shadcn/ui
- [ ] 配置深色主题
- [ ] 搭建基础布局组件
- [ ] 实现 Cmd+K 搜索

### Phase 2: 核心工具 🔄

- [ ] JSON/YAML 互转
- [ ] JSON 格式化/压缩
- [ ] Base64 编解码
- [ ] URL 编解码
- [ ] HTML 实体转义

### Phase 3: 加密工具 🔐

- [ ] Hash 计算 (MD5/SHA)
- [ ] UUID/ULID 生成
- [ ] JWT 解析
- [ ] 密码强度分析

### Phase 4: 网络工具 🌐

- [ ] 进制转换
- [ ] IP 相关计算
- [ ] Cron 表达式生成

### Phase 5: 进阶功能 🚀

- [ ] QR Code 生成
- [ ] 加密/解密
- [ ] 多语言支持
- [ ] 国际化

***

## 10. 性能优化

### 10.1 首屏优化

- 使用 `next/font` 自动优化字体
- 图片使用 `next/image`
- 组件使用 dynamic import

### 10.2 工具加载

```typescript
// 懒加载工具组件
const JsonYamlTool = dynamic(() => import('@/components/tools/JsonYaml'));
```

### 10.3 SEO

```typescript
// 生成静态参数
export async function generateStaticParams() {
  return tools.map(tool => ({ tool: tool.id }));
}

// SEO meta
export const metadata = {
  title: 'JSON to YAML - DevTools',
  description: 'Convert JSON to YAML format...',
};
```

***

## 11. 部署方案

### 11.1 Vercel (推荐)

```yaml
# vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev"
}
```

### 11.2 Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

***

## 12. 风险与挑战

| 风险          | 应对方案                         |
| ----------- | ---------------------------- |
| 工具数量多，开发周期长 | 分阶段迭代，优先实现高频工具               |
| 部分加密工具需要后端  | 纯前端实现或提供服务端选项                |
| 多语言维护成本     | 使用 i18n 框架，集中管理翻译            |
| SEO 优化      | Next.js SSR + sitemap + meta |

***

## 13. 后续扩展

- [ ] 用户收藏/历史记录 (localStorage)
- [ ] 工具使用统计
- [ ] PWA 支持 (离线可用)
- [ ] API 接口 (工具即服务)
- [ ] 社区贡献系统

