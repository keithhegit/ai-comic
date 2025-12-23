# 🦸 Infinite Heroes - 功能增强开发计划

> **基准版本**: `main 9a157b6`  
> **创建日期**: 2025-12-23  
> **目标**: 在保持原有 API 调用稳定性的基础上，增加自定义功能

---

## 📋 需求概览

| 序号 | 功能模块 | 优先级 | 预估复杂度 |
|------|---------|--------|-----------|
| 1 | 自定义漫画标题 (Comic Title) | 🔴 高 | ⭐ 低 |
| 2 | 支持多个配角 (Multiple Co-Stars) | 🔴 高 | ⭐⭐⭐ 高 |
| 3 | 人物一致性增强 (Character Consistency) | 🟡 中 | ⭐⭐ 中 |
| 4 | 自定义页数与剧情控制 (Page Count & Plot) | 🔴 高 | ⭐⭐ 中 |

---

## 🎯 功能 1：自定义漫画标题 (Comic Title)

### 1.1 需求描述
- 在设置界面增加 "COMIC TITLE" 输入框
- 默认值为 "INFINITE HEROES"
- 用户可自定义任意标题
- 标题应用到封面生成的 AI 提示词中

### 1.2 涉及文件
| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `App.tsx` | 修改 | 新增 `comicTitle` state |
| `Setup.tsx` | 修改 | 添加标题输入框 UI |
| `types.ts` | 无需修改 | - |

### 1.3 实现步骤

#### Step 1: App.tsx - 状态管理
```
位置: App.tsx 的 state 声明区域

操作:
1. 新增 state: const [comicTitle, setComicTitle] = useState("INFINITE HEROES");
2. 将 comicTitle 传递给 Setup 组件
3. 在 generateImage 函数的 cover 类型分支中，替换硬编码的 "INFINITE HEROES" 为 comicTitle 变量
```

#### Step 2: Setup.tsx - UI 组件
```
位置: Setup.tsx 的设置表单区域

操作:
1. 新增 Props: comicTitle: string, onTitleChange: (val: string) => void
2. 在 "THE STORY" 区域添加输入框组件
3. 使用现有的 comic-btn 和 border 样式保持一致性
```

#### Step 3: generateImage 函数修改
```
位置: App.tsx generateImage 函数内 type === 'cover' 分支

修改前:
promptText += `TYPE: Comic Book Cover. TITLE: "INFINITE HEROES" ...`

修改后:
promptText += `TYPE: Comic Book Cover. TITLE: "${comicTitle.toUpperCase()}" ...`
```

### 1.4 测试要点
- [ ] 默认标题正确显示 "INFINITE HEROES"
- [ ] 自定义标题能正确保存
- [ ] 封面生成时 AI 提示词包含自定义标题
- [ ] 特殊字符处理（引号、换行符等）

---

## 🎯 功能 2：支持多个配角 (Multiple Co-Stars)

### 2.1 需求描述
- 将单一 `friend` 改为 `friends` 数组
- 支持添加多个配角（建议上限 3-5 个）
- 每个配角显示预览图和删除按钮
- AI 生成逻辑动态引用多个配角

### 2.2 涉及文件
| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `App.tsx` | 修改 | 重构 friend → friends 数组 |
| `Setup.tsx` | 修改 | 多配角 UI 交互 |
| `types.ts` | 可选修改 | 如需定义配角数量限制 |

### 2.3 实现步骤

#### Step 1: App.tsx - 数据结构重构
```
位置: App.tsx state 声明区域

修改:
- const [friend, setFriendState] = useState<Persona | null>(null);
+ const [friends, setFriendsState] = useState<Persona[]>([]);

- const friendRef = useRef<Persona | null>(null);
+ const friendsRef = useRef<Persona[]>([]);

- const setFriend = (p: Persona | null) => {...};
+ const setFriends = (p: Persona[]) => {...};
```

#### Step 2: Setup.tsx - 多配角 UI
```
位置: Setup.tsx CO-STARS 区域

实现要点:
1. 使用 flex-wrap 布局展示多个配角预览
2. 每个配角卡片包含:
   - 缩略图 (w-16 h-16)
   - 删除按钮 (绝对定位右上角)
3. "+ ADD NEW" 按钮始终可见
4. 显示当前配角数量统计
```

UI 结构参考:
```jsx
<div className="flex flex-wrap gap-3">
  {friends.map((f, idx) => (
    <div key={idx} className="relative w-16 h-16">
      <img src={...} className="w-full h-full object-cover border-2 border-black" />
      <button onClick={() => removeFriend(idx)} className="absolute -top-2 -right-2 ...">X</button>
    </div>
  ))}
</div>
```

#### Step 3: generateBeat 函数修改
```
位置: App.tsx generateBeat 函数

修改 friendInstruction 逻辑:

- if (friendRef.current) {
-     friendInstruction = "ACTIVE and PRESENT (User Provided).";
- }

+ if (friendsRef.current.length > 0) {
+     friendInstruction = `ACTIVE and PRESENT. Co-Stars available: ${friendsRef.current.length}.`;
+     friendsRef.current.forEach((f, idx) => {
+         friendInstruction += ` [CO-STAR ${idx+1}: ${f.desc || 'Sidekick'}]`;
+     });
+ }
```

#### Step 4: generateImage 函数修改
```
位置: App.tsx generateImage 函数

修改 REFERENCE 注入逻辑:

- if (friendRef.current?.base64) {
-     contents.push({ text: "REFERENCE 2 [CO-STAR]:" });
-     contents.push({ inlineData: { mimeType: 'image/jpeg', data: friendRef.current.base64 } });
- }

+ friendsRef.current.forEach((f, idx) => {
+     contents.push({ text: `REFERENCE ${idx + 2} [CO-STAR ${idx + 1}]:` });
+     contents.push({ inlineData: { mimeType: 'image/jpeg', data: f.base64 } });
+ });
```

#### Step 5: 提示词场景引用修改
```
位置: App.tsx generateImage 函数的 promptText 构建

修改:
- promptText += `If scene mentions 'CO-STAR' or 'SIDEKICK', use REFERENCE 2.`;

+ friendsRef.current.forEach((_, idx) => {
+     promptText += ` If scene mentions 'CO-STAR ${idx+1}', use REFERENCE ${idx+2}.`;
+ });
```

### 2.4 测试要点
- [ ] 可添加多个配角（测试 1/2/3 个）
- [ ] 删除功能正常工作
- [ ] 预览图正确显示
- [ ] AI 提示词正确包含所有配角引用
- [ ] 生成的漫画正确展示多配角场景

---

## 🎯 功能 3：人物一致性增强 (Character Consistency)

### 3.1 需求描述
- 在所有图像生成提示词中加入强制一致性规则
- 明确要求保持面部、发型、服装一致
- 禁止更改种族、性别等关键特征

### 3.2 涉及文件
| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `App.tsx` | 修改 | generateImage 函数 |

### 3.3 实现步骤

#### Step 1: 定义一致性规则常量
```
位置: App.tsx 常量区域（可选，也可内联）

const CONSISTENCY_RULES = `
CONSISTENCY RULES:
1. Keep character faces, hair, and costumes STRICTLY consistent with REFERENCES.
2. Do not change race, gender, or key features.
3. Maintain the same art style across all panels.
`;
```

#### Step 2: 注入到 generateImage
```
位置: App.tsx generateImage 函数，promptText 构建区域

修改:
+ promptText += " CONSISTENCY RULES: 1. Keep character faces, hair, and costumes STRICTLY consistent with REFERENCES. 2. Do not change race, gender, or key features. ";
```

### 3.4 测试要点
- [ ] 角色外观在多页漫画中保持一致
- [ ] 配角特征不会随机变化
- [ ] 艺术风格保持统一

---

## 🎯 功能 4：自定义页数与剧情控制

### 4.1 需求描述

#### 4.1.1 页数控制
- 增加 "PAGES" 输入框（范围 1-50）
- 故事节奏根据总页数动态调整
- 影响 `generateBeat` 的叙事弧计算

#### 4.1.2 剧情控制
- 增加 "PLOT DIRECTION" 文本框
- 用户输入的剧情指导设为最高优先级
- AI 优先遵循用户意图

### 4.2 涉及文件
| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `App.tsx` | 修改 | 新增 state，修改 generateBeat |
| `Setup.tsx` | 修改 | 添加 UI 控件 |
| `types.ts` | 可选修改 | 更新 MAX_STORY_PAGES 相关逻辑 |

### 4.3 实现步骤

#### Step 1: App.tsx - 状态管理
```
位置: App.tsx state 声明区域

新增:
+ const [pageCount, setPageCount] = useState(MAX_STORY_PAGES);
+ const [plotGuidance, setPlotGuidance] = useState("");
```

#### Step 2: Setup.tsx - UI 控件
```
位置: Setup.tsx "THE STORY" 区域

页数控件:
<input 
  type="number" 
  min="1" 
  max="50" 
  value={pageCount}
  onChange={(e) => onPageCountChange(parseInt(e.target.value) || 1)}
  className="w-24 p-2 border-2 border-black ..."
/>

剧情控件:
<textarea
  value={plotGuidance}
  onChange={(e) => onPlotGuidanceChange(e.target.value)}
  placeholder="Describe key events, endings, or twists..."
  className="w-full p-2 border-2 border-black h-20 ..."
/>
```

#### Step 3: generateBeat - 动态叙事弧
```
位置: App.tsx generateBeat 函数

修改 isFinalPage 判断:
- const isFinalPage = pageNum === MAX_STORY_PAGES;
+ const isFinalPage = pageNum === pageCount;

修改叙事弧节点（使用百分比而非固定页数）:
- } else if (pageNum <= 4) {
+ } else if (pageNum <= Math.floor(pageCount * 0.4)) {
    instruction += " RISING ACTION...";

- } else if (pageNum <= 8) {
+ } else if (pageNum <= Math.floor(pageCount * 0.8)) {
    instruction += " COMPLICATION...";
```

#### Step 4: generateBeat - 剧情优先级
```
位置: App.tsx generateBeat 函数，coreDriver 构建区域

新增:
+ if (plotGuidance) {
+     coreDriver += ` USER PLOT GUIDANCE (HIGHEST PRIORITY): ${plotGuidance}.`;
+ }
```

#### Step 5: 相关函数页数引用更新
```
位置: App.tsx 多处

需要将 MAX_STORY_PAGES / TOTAL_PAGES 替换为 pageCount:
- if (p <= TOTAL_PAGES && ...) 
+ if (p <= pageCount + 1 && ...)

- const type = pageNum === BACK_COVER_PAGE ? 'back_cover' : 'story';
+ const type = pageNum > pageCount ? 'back_cover' : 'story';
```

### 4.4 测试要点
- [ ] 页数输入范围限制（1-50）有效
- [ ] 短篇（3页）故事节奏正确
- [ ] 长篇（20页）故事节奏正确
- [ ] 剧情指导被 AI 正确理解和执行
- [ ] 剧情指导优先于随机生成的流派套路

---

## 📝 开发顺序建议

### Phase 1: 基础功能（低风险）
1. ✅ 功能 1：自定义漫画标题
2. ✅ 功能 3：人物一致性增强

### Phase 2: 核心功能（中风险）
3. ✅ 功能 4：自定义页数与剧情控制

### Phase 3: 复杂功能（高风险）
4. ✅ 功能 2：支持多个配角

---

## ⚠️ 注意事项

### API 调用稳定性
```
重要: 保持 MODEL_TEXT_NAME = MODEL_V3 = "gemini-3-pro-image-preview"
不要修改模型名称，当前配置已验证可用
```

### 环境变量
```
确保 Cloudflare Pages 环境变量正确配置:
- GEMINI_API_KEY: 已启用 Billing 的有效 Key
```

### 向后兼容
```
- 所有新功能应有合理的默认值
- 用户不做任何设置时，行为应与旧版一致
```

---

## 🧪 完整测试清单

### 回归测试
- [ ] 基础漫画生成流程正常
- [ ] 封面生成正常
- [ ] 单配角功能正常
- [ ] API 无 429 错误

### 新功能测试
- [ ] 自定义标题生效
- [ ] 多配角 UI 交互正常
- [ ] 多配角生成逻辑正确
- [ ] 页数控制生效
- [ ] 剧情指导生效
- [ ] 人物一致性提升

### 边界测试
- [ ] 0 个配角
- [ ] 最大配角数量
- [ ] 最小页数 (1 页)
- [ ] 最大页数 (50 页)
- [ ] 空剧情指导
- [ ] 超长剧情指导

---

## 📂 文件变更清单

| 文件 | 变更类型 | 功能关联 |
|------|---------|---------|
| `App.tsx` | 修改 | 1, 2, 3, 4 |
| `Setup.tsx` | 修改 | 1, 2, 4 |
| `types.ts` | 可能修改 | 2, 4 |
| `Book.tsx` | 无修改 | - |
| `Panel.tsx` | 无修改 | - |
| `useApiKey.ts` | 无修改 | - |
| `vite.config.ts` | 无修改 | - |

---

*文档版本: 1.0 | 最后更新: 2025-12-23*

