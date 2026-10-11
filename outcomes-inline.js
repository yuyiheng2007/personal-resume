(() => {
  const root = document.querySelector("#outcomesInline");
  if (!root) return;

  const certificates = [
    ["AI4S Cup · Python 基础能力认证", "北京科学智能研究院 × 深势科技", "2026.10", "assets/certificates/AI4S-Cup-Python基础能力认证-公开版.svg"],
    ["AI 打造专属企业风格海报", "华为云微认证", "2026.10", "assets/certificates/华为云微认证-AI打造专属企业风格海报.png"],
    ["Prompt Engineer", "Datawhale × 讯飞星火", "2026.10", "assets/certificates/Datawhale-讯飞星火-Prompt-Engineer证书.png"],
    ["人工智能高级训练师", "人工智能训练", "课程认证", "assets/certificates/人工智能高级训练师证书.jpg"],
    ["人工智能初级训练师", "人工智能训练", "课程认证", "assets/certificates/人工智能初级训练师证书.jpg"],
    ["大模型的咒语 Prompt 工程", "华为云", "Prompt 工程", "assets/certificates/华为云prompt工程师证书.png"],
    ["Prompt 工程师", "AI 大学堂", "Prompt 工程", "assets/certificates/Ai大学堂prompt工程师证书.png"],
    ["编程能力认证", "Datawhale × MarsCode", "编程认证", "assets/certificates/Datawhale&MarsCode编程认证证书.png"]
  ];

  const projects = [
    { id: "campus-map", status: "MVP 已完成 · 正在试用", title: "校迹校园交互地图", text: "从新生找不到地点的问题出发，我整理校园地点数据，做了搜索、分类和地点详情，并根据老师的意见调整方案。", tags: ["产品规划", "用户测试", "数据整理", "前端原型"], proof: "地图 MVP、地点数据底稿、多版项目计划书、教师交流复盘", url: "demos/campus-map/index.html", action: "打开地图 MVP" },
    { id: "life-assistant", status: "已完成 · 可运行", title: "大学生活管理助手", text: "把课表、待办、日程、健身、财务和素材管理放进一个浏览器本地工具，减少在多个软件之间来回切换。", tags: ["需求拆解", "模块设计", "本地数据", "网页制作"], proof: "八个功能模块、本地数据存储、分享版和线上版本", url: "https://yuyiheng2007.github.io/college-life-assistant/", action: "打开应用" },
    { id: "knowledge-base", status: "长期项目 · 日常维护", title: "个人知识库建设", text: "我用 Obsidian 整理学校通知、项目记录和个人材料，保留资料来源，也把含个人信息的内容单独存放。", tags: ["知识管理", "流程设计", "长期维护", "信息安全"], proof: "五层资料结构、索引体系、归档规则、同步流程" },
    { id: "portfolio", status: "持续更新", title: "个人简介网站", text: "我把经历、证书、项目和制作过程重新整理成统一的主页，让阅读者不必在多个页面之间来回切换。", tags: ["信息架构", "网页设计", "成果整理", "响应式"], proof: "完整简历主页、移动端适配、多个设计版本与持续更新记录" },
    { id: "ink-mountain", status: "交互实验 · 可运行", title: "山河入墨水墨交互", text: "用 Three.js 和 MediaPipe 做了一幅可互动的水墨画，支持鼠标、摄像头手势和手机陀螺仪，并提供三档画质。", tags: ["Three.js", "MediaPipe", "设备传感器", "性能取舍"], proof: "三种控制方式、三档画质、摄像头权限与移动端适配", url: "demos/ink-mountain/index.html", action: "打开交互网页" },
    { id: "snake", status: "学习项目 · 可运行", title: "MarsCode 贪吃蛇", text: "我用一个 HTML 文件完成 Canvas 绘制、方向控制、碰撞判断、计分和重新开始。", tags: ["JavaScript", "Canvas", "状态逻辑"], proof: "单文件游戏、得分与最高分、碰撞逻辑", url: "demos/snake/index.html", action: "打开游戏" },
    { id: "gravity-journey", status: "交互原型 · 本地可运行", title: "Gravity Journey 引力之旅", text: "我根据一份完整需求说明，借助 AI 搭建了太阳系引力交互原型，包含 24 步科普导览、程序化天体纹理、轨道演示和自由探索。", tags: ["Three.js", "TypeScript", "开普勒轨道", "Canvas 纹理"], proof: "本地 Vite 原型、24 步导览、天体交互与双语界面" },
    { id: "black-hole-visual", status: "独立交互页 · 本地可运行", title: "公式引力场｜黑洞交互视觉", text: "基于作者已公开部署的项目整理出独立体验页，围绕金色公式引力盘与黑洞视觉进行调整，保留原有场景交互并在简历项目中呈现。", tags: ["Three.js", "WebGL", "GLSL", "视觉改编与集成"], proof: "独立运行页面、公式引力场景、原作者署名与完整交互", url: "gravity-journey-original.html", action: "打开黑洞交互页" }
  ];

  const workflows = [
    { id: "campus-map", no: "01", title: "校迹校园交互地图", intro: "从整理校园地点开始，完成网页原型，再根据老师提出的问题调整方案。", steps: [["发现问题", "新生能看到静态地图，却不清楚建筑用途、办事地点和生活服务在哪里。"], ["整理数据", "收集公开地点信息，按教学、生活、运动和服务等类别整理名称、坐标和用途。"], ["完成原型", "制作可搜索、可筛选、可查看地点详情的网页 MVP。"], ["听取意见", "围绕用户来源、信息维护和错误修正等问题补充试用办法。"], ["继续验证", "找同学试用，观察他们能否独立找到地点并看懂用途。"]], role: "需求分析、地点数据整理、产品结构、网页 MVP、项目计划书、教师沟通与复盘。", state: "正在试用，用户评价与校内合作仍待验证。" },
    { id: "life-assistant", no: "02", title: "大学生活管理助手", intro: "把课表、待办、收支、健身和素材管理等高频需求放进同一个页面。", steps: [["列出场景", "梳理课表、待办、计划、健身、收支和素材记录的真实使用场景。"], ["拆成模块", "确定仪表盘与高频入口，再划分课表、日程、财务、待办和素材库。"], ["选择存储", "普通数据使用 localStorage，较大的媒体资料使用 IndexedDB。"], ["交付版本", "保留本地版、分享版和线上版本，方便不同环境使用。"]], role: "需求拆解、功能规划、页面设计、模块整合、测试、部署和使用说明。", state: "备份与恢复还需要继续完善。" },
    { id: "knowledge-base", no: "03", title: "个人知识库建设", intro: "把分散在下载目录、聊天截图和项目文件夹里的资料迁入 Obsidian，并记录来源。", steps: [["识别混乱", "同一主题经常出现多个版本，资料很难持续检索。"], ["建立结构", "分成原始资料、编译笔记、方法规则、输出成果和复盘记录。"], ["写清规则", "为学校材料、名单、敏感信息、成果文件和删除操作设置规则。"], ["持续维护", "通过索引、项目关联和同步脚本减少重复查找。"]], role: "目录层级、索引规则、资料流转、隐私设置、同步流程和日常维护。", state: "持续增加过期提醒和定期检查。" },
    { id: "portfolio", no: "04", title: "个人简介网站", intro: "重新整理简历内容，并在多次视觉尝试后形成现在的统一主页。", steps: [["盘点材料", "整理个人经历、校园事务、项目、证书和公开表达。"], ["重建层级", "主页先呈现个人介绍，再展开项目、证书、流程和经历档案。"], ["迭代视觉", "尝试交互版、叙事版和工作室风格，并统一移动端表现。"], ["保持更新", "后续新增成果时沿用现有模块，不改变整体视觉语言。"]], role: "内容梳理、页面结构、视觉设计、项目描述、手机适配和维护。", state: "继续删减重复表述，并把新成果补入主页。" },
    { id: "ink-mountain", no: "05", title: "山河入墨水墨交互", intro: "让水墨画面可以跟随鼠标、摄像头手势和手机方向变化。", steps: [["定义交互", "电脑端支持鼠标与摄像头，手机端加入陀螺仪。"], ["整合技术", "使用 Three.js、MediaPipe 和设备传感器组合交互。"], ["处理性能", "设置流畅、均衡、精细三档质量。"], ["说明边界", "摄像头内容只在浏览器本地处理，不上传远端。"]], role: "交互方式设计、页面整合、运行说明和多设备适配思路。", state: "继续在更多手机和电脑上测试。" },
    { id: "snake", no: "06", title: "MarsCode 贪吃蛇", intro: "把 JavaScript 基础知识组合成一个从开始到结束都能运行的小作品。", steps: [["拆分状态", "区分蛇身、方向、食物、分数和游戏状态。"], ["建立循环", "按固定节奏更新位置、检测碰撞并重绘 Canvas。"], ["补齐功能", "加入开始、重新开始、最高分和速度变化。"]], role: "页面结构、Canvas 绘制、游戏循环、方向控制、碰撞和得分逻辑。", state: "后续可增加手机触摸、暂停与难度设置。" },
    { id: "gravity-journey", no: "07", title: "Gravity Journey 引力之旅", intro: "把引力、轨道和宇宙速度写成一段可以边看边操作的 3D 科普导览。", steps: [["整理需求", "规划 24 个导览节点、双语界面和自由探索模式。"], ["搭建场景", "使用 Three.js 表现太阳、行星轨道和交互控件。"], ["加入计算", "用开普勒方程估算行星位置，并制作引力、速度与惯性示意。"], ["生成纹理", "通过 Canvas 运行时生成天体表面与土星环纹理。"], ["浏览器验收", "检查步骤切换、深链、语言持久化和自由探索操作。"]], role: "提出产品需求与交互目标；AI 辅助编写原型代码；本人负责浏览器验收与后续方向确认。", state: "本地可运行原型，天体轨道使用 J2000 近似根数；尚未发布为公开网站，物理展示用于科普说明。" },
    { id: "black-hole-visual", no: "08", title: "公式引力场｜黑洞交互视觉", intro: "把作者已公开部署的项目整理成简历里的独立体验项目，在保留原作署名的基础上调整视觉呈现与本地访问方式。", steps: [["确认原作与边界", "以作者公开部署的完整交互场景为基础，保留原有作者署名，不将原作功能表述为从零原创。"], ["整理独立页面", "将黑洞场景作为单独页面运行，使访客可直接进入体验，不依赖简历首页中的嵌入画面。"], ["调整视觉呈现", "围绕金色公式引力盘与黑洞主体优化首页主视觉，并对场景呈现进行取舍。"], ["保留原版交互", "独立体验页保留原有滚动叙事、黑洞拖动等交互；简历首页的展示画面则不随鼠标拖动。"], ["浏览器验收", "检查独立页面资源加载、场景显示与交互入口。"]], role: "基于公开部署版本做视觉适配与简历集成；借助 AI 协助调整和调试，负责需求判断与浏览器验收。", state: "本地可运行；原作者署名保留，后续公开展示前需核实并遵循原项目的许可证要求。" }
  ];

  const externalAttrs = url => url?.startsWith("http") ? ' target="_blank" rel="noopener"' : url ? ' target="_blank"' : "";
  const renderProject = item => `
    <article class="inline-project-card">
      <p class="inline-status">${item.status}</p><h4>${item.title}</h4><p>${item.text}</p>
      <div class="inline-tags">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <p class="inline-proof"><strong>现有材料</strong>${item.proof}</p>
      <div class="inline-actions">${item.url ? `<a href="${item.url}"${externalAttrs(item.url)}>${item.action} ↗</a>` : ""}<a href="#workflow-${item.id}">查看制作过程 ↓</a></div>
    </article>`;

  const renderWorkflow = item => `
    <details class="inline-workflow" id="workflow-${item.id}">
      <summary><span>${item.no} / ${String(workflows.length).padStart(2, '0')}</span><strong>${item.title}</strong><em>展开过程</em></summary>
      <div class="inline-workflow-body"><p class="workflow-intro">${item.intro}</p>
        <div class="inline-steps">${item.steps.map((step, index) => `<section><span>${index + 1}</span><h5>${step[0]}</h5><p>${step[1]}</p></section>`).join("")}</div>
        <div class="inline-workflow-meta"><p><strong>我负责的部分</strong>${item.role}</p><p><strong>目前进度</strong>${item.state}</p></div>
      </div>
    </details>`;

  root.innerHTML = `
    <section class="inline-outcome-section" id="learning-inline">
      <div class="inline-heading"><p>01 / LEARNING</p><h3>学习与证书</h3><span>学习材料与 8 项认证</span></div>
      <article class="inline-study-guide">
        <a class="study-cover" href="assets/study/人工智能证书核心知识学习教案.pdf" target="_blank"><img src="assets/study/ai-study-guide-cover.png" alt="人工智能证书核心知识学习教案首页预览"></a>
        <div><p class="inline-status">15 页学习教案</p><h4>人工智能证书核心知识学习教案</h4><p>这是我整理课程和备考笔记时做的一份学案，内容包括 Prompt、Agent、RAG、Python，也记录了智能心理方向里的隐私和安全问题。</p><div class="inline-tags"><span>Prompt 与评测</span><span>Agent 工作流</span><span>RAG 检索</span><span>Python</span><span>智能心理安全边界</span></div><div class="inline-actions"><a href="assets/study/人工智能证书核心知识学习教案.pdf" target="_blank">打开学案 PDF ↗</a><a href="assets/study/人工智能证书核心知识学习教案.docx" download>下载可编辑版 ↓</a></div></div>
      </article>
      <div class="inline-cert-grid">${certificates.map(item => `<a class="inline-cert" href="${item[3]}" target="_blank"><img src="${item[3]}" alt="${item[0]}"><span>${item[1]} · ${item[2]}</span><strong>${item[0]}</strong></a>`).join("")}</div>
    </section>
    <section class="inline-outcome-section" id="projects-inline">
      <div class="inline-heading"><p>02 / PROJECTS</p><h3>项目档案</h3><span>8 个持续更新的实践项目</span></div>
      <div class="inline-project-grid">${projects.map(renderProject).join("")}</div>
    </section>
    <section class="inline-outcome-section" id="workflows-inline">
      <div class="inline-heading"><p>03 / PROCESS</p><h3>工作流程</h3><span>点击每一项展开完整过程</span></div>
      <div class="inline-workflow-list">${workflows.map(renderWorkflow).join("")}</div>
    </section>`;

  if (window.lucide) window.lucide.createIcons();
})();
