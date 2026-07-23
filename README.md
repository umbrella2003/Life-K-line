# 人生K线

AI 命理与性格解析网站,分三大板块:

### 东方玄学
1. **`/bazi` 生辰八字 · 人生K线**:输入阳历出生日期时间,系统用传统八字算法精确排盘(年月日时四柱、五行、十神、大运流年),据此按天推演生成一条贯穿 0~90 岁、真正呈趋势走向(运好则涨、运差则跌)的"人生K线",支持 24H/1W/1M/人生 四档周期切换,并调用 DeepSeek 大模型给出结构化命理解读与建议。
2. **`/mbti` 性格问答 · 易经解析**:50 道题、每题4档同意程度测出 MBTI 四维人格倾向,同时用答题序列按梅花易数思路起一卦,调用 DeepSeek 结合 MBTI 与周易卦象给出性格解析与建议。
3. **`/ziwei` 紫微斗数 · 十二宫命盘**:输入阳历出生日期时间与性别,用 [iztro](https://github.com/SylarLong/iztro) 开源库按传统安星法精确排出命宫、身宫、五行局与十二宫(命宫/兄弟/夫妻/子女/财帛/疾厄/迁移/仆役/官禄/田宅/福德/父母)主星辅星及大限,调用 DeepSeek 给出命盘解读。测一次即可,结果保存在本机(localStorage),也可随时重新测试。

### 西方玄学
4. **`/tarot` 塔罗牌**:遵循标准韦特塔罗规则——78张牌(22大阿尔卡那+56小阿尔卡那)、真随机洗牌抽牌、判定正逆位,支持单张指引/时间之流三牌阵,调用 DeepSeek 把抽到的牌串成连贯解读。UI 采用紫金色的西方玄学风格(星月图腾、卡牌翻转动画)。
5. **`/astrology` 占星术**:输入出生日期、时间与出生地(经纬度),用真实天文历法(基于 [astronomy-engine](https://github.com/cosinekitty/astronomy) 计算太阳/月亮/五大行星的地心视黄经,再用 Meeus《天文算法》公式推算上升星座)绘制本命盘,与市面上占星App的算法逻辑一致,调用 DeepSeek 给出本命盘解读。
6. **`/numerology` 数字命理**:输入出生日期(及可选的英文/拼音姓名),用西方毕达哥拉斯数字命理算法计算生命历程数、生日数,以及(提供姓名时)表达数、灵魂数、人格数、成熟数,调用 DeepSeek 给出数字命理解读。测一次即可,结果保存在本机(localStorage),也可随时重新测试。

### 现代科学
7. **`/personality` MBTI 人格测试**:纯心理学框架的独立测评(不涉及易经/玄学),测一次即可,结果保存在本机(localStorage),重新打开页面无需再答题,结果页也提供"重新测试"按钮。
8. **`/bigfive` 大五人格模型测试**:50 题(五个维度各10题,正向/反向计分各半),对应国际学界广泛使用、可自由使用的大五人格(Big Five/OCEAN:开放性、尽责性、外向性、宜人性、情绪稳定性)理论,输出每个维度 0-100 的连续分数(而非类型),调用 DeepSeek 给出深度解读。测一次即可,结果保存在本机,也可随时重新测试。
9. **`/workstyle` 职场性格七维度测评**:42 题,参考职业心理学界公开讨论过的"职场人格七维度"框架(情绪稳定度/进取动力/社交活力/人际敏感度/谨慎自律/好奇探索/学习钻研,常见于领导力与团队协作评估场景)自建题库与计分逻辑,**并非任何商业测评机构(如 Hogan)的官方产品或题库**,仅为同类风格的娱乐化职场性格测评,调用 DeepSeek 给出团队协作与职业发展建议。测一次即可,结果保存在本机,也可随时重新测试。

八字排盘、紫微斗数排盘、五行强弱、大运流年、K线走势、MBTI/大五人格/职场性格计分、起卦、塔罗抽牌、占星天体位置、数字命理换算全部是**本地确定性/随机/真实天文算法**计算(塔罗每次真随机,占星基于真实星历,其余对同一个人保证结果可复现),大模型只负责在这些已算好的事实基础上做"解读"和"建议"的文字生成。

AI 解读需要消耗 DeepSeek API 的 token 成本,因此设置为付费解锁,支持微信支付 / 支付宝扫码支付。

> 全部内容仅供娱乐与传统文化体验,不构成任何医疗、法律、财务或心理建议。

## 快速开始

```bash
npm install
cp .env.example .env   # 已存在则跳过,按需修改
npm run dev
```

打开 http://localhost:3000

默认 `.env` 中 `PAY_DEV_MODE=true`,此时点击"开通 AI 解读"会**跳过真实支付**,下单即视为已支付,方便本地调试整条链路(排盘 → 支付 → AI解读)。真正上线前请务必将其改为 `false`,并按下方说明配置真实的支付与大模型密钥。

## 部署到 Vercel(体验/试用,先不接真实支付)

1. Fork 或直接在 [Vercel](https://vercel.com) 用 "Import Project" 导入这个 GitHub 仓库,框架会自动识别为 Next.js,无需额外配置构建命令。
2. 在项目的 Environment Variables 里至少配置:
   - `DEEPSEEK_API_KEY`(否则点击付费解锁会报错)
   - `PAY_DEV_MODE=true`(先不接真实支付,体验完整链路)
   - `APP_BASE_URL` 填 Vercel 分配的域名(如 `https://your-app.vercel.app`)
3. **订单存储**:Vercel 是无持久化文件系统的 serverless 平台,直接用默认的本地文件存储会在生产环境写入失败。请在 Vercel 项目的 **Storage** 标签页新建一个 KV/Redis 数据库(选 Upstash for Redis 之类的集成即可,免费额度足够体验用),挂载后 Vercel 会自动把 `KV_REST_API_URL`/`KV_REST_API_TOKEN` 注入到环境变量,代码检测到这两个变量存在时会自动切换到 KV 存储订单,不用改代码。
4. 保存环境变量后触发一次部署(Deploy),之后每次 `git push` 到 `main` 分支会自动重新部署。

`PAY_DEV_MODE=true` 下所有人点击"开通 AI 解读"都会直接跳过支付、立即拿到 AI 解读,适合先给自己或朋友体验完整流程。等确定要收真实费用时,再按下方"配置微信支付"/"配置支付宝"两节申请真实商户号,并把 `PAY_DEV_MODE` 改成 `false`。

## 配置 DeepSeek

在 `.env` 中设置:

```
DEEPSEEK_API_KEY=sk-xxxxxxxx
```

密钥从 [DeepSeek 开放平台](https://platform.deepseek.com) 获取。不配置时,免费的排盘/测评/K线部分仍可正常使用,只有点击付费解读才会报错提示。

## 配置微信支付(Native 扫码支付,APIv3)

1. 在微信支付商户平台开通"直连商户"能力,获取 `商户号(mchid)`、`AppID`。
2. 商户平台 → 账户中心 → API安全 → 申请 API 证书,下载得到 `apiclient_key.pem`(私钥)与 `apiclient_cert.pem`(证书)。
3. 同一页面设置 **APIv3 密钥**。
4. 用 `openssl x509 -in apiclient_cert.pem -noout -serial` 获取证书序列号。
5. 把以上信息填入 `.env`(私钥/证书是多行 PEM 文本,粘贴时把换行替换成 `\n`):

```
WECHAT_APPID=
WECHAT_MCHID=
WECHAT_API_V3_KEY=
WECHAT_SERIAL_NO=
WECHAT_PRIVATE_KEY=
WECHAT_PUBLIC_CERT=
```

6. `APP_BASE_URL` 必须是**公网可访问的 HTTPS 域名**(微信服务器要能回调到 `${APP_BASE_URL}/api/pay/notify/wechat`),本地开发无法收到真实回调,请用 `PAY_DEV_MODE=true` 调试业务逻辑,上线到服务器后再切换为 `false` 并配置好域名与 HTTPS。

## 配置支付宝(扫码支付)

1. 在支付宝开放平台创建应用并签约"当面付"。
2. 生成应用私钥/公钥(RSA2),把支付宝公钥同步到平台。
3. 填入 `.env`:

```
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=
```

4. 同样需要公网 `APP_BASE_URL`,支付宝会回调 `${APP_BASE_URL}/api/pay/notify/alipay`。

## 价格

`.env` 中单位均为分:

| 变量 | 对应模块 | 默认值 |
|---|---|---|
| `PRICE_BAZI_FEN` | 八字命理解读 | 660(¥6.6) |
| `PRICE_MBTI_FEN` | 易经性格解析 | 100(¥1.0) |
| `PRICE_TAROT_FEN` | 塔罗牌解读 | 990(¥9.9) |
| `PRICE_ASTROLOGY_FEN` | 占星本命盘解读 | 500(¥5.0) |
| `PRICE_PERSONALITY_FEN` | MBTI人格测试 | 500(¥5.0) |
| `PRICE_ZIWEI_FEN` | 紫微斗数命盘解读 | 300(¥3.0) |
| `PRICE_NUMEROLOGY_FEN` | 数字命理解读 | 300(¥3.0) |
| `PRICE_BIGFIVE_FEN` | 大五人格深度解读 | 500(¥5.0) |
| `PRICE_WORKSTYLE_FEN` | 职场性格七维度解读 | 500(¥5.0) |

## 目录结构

```
src/
  app/
    page.tsx                首页,三大板块入口
    bazi/page.tsx            八字页面(表单 + K线 + AI解读)
    mbti/page.tsx            MBTI/易经页面(问答 + 起卦 + AI解析)
    ziwei/page.tsx           紫微斗数页面(表单 + 十二宫命盘 + AI解读,localStorage持久化 + 重新测试)
    tarot/page.tsx           塔罗牌页面(牌阵选择 + 抽牌翻转动画 + AI解读)
    astrology/page.tsx       占星术页面(出生信息 + 本命盘 + AI解读)
    numerology/page.tsx      数字命理页面(出生日期+可选姓名 + 核心数字 + AI解读,localStorage持久化 + 重新测试)
    personality/page.tsx     独立MBTI测试页面(localStorage持久化 + 重新测试)
    bigfive/page.tsx         大五人格测试页面(localStorage持久化 + 重新测试)
    workstyle/page.tsx       职场性格七维度测评页面(localStorage持久化 + 重新测试)
    api/
      bazi/preview           免费:排盘 + 生成K线
      bazi/analyze           付费后:调用 DeepSeek 生成命理解读
      mbti/preview           免费:MBTI计分 + 起卦
      mbti/analyze           付费后:调用 DeepSeek 生成性格解析
      ziwei/preview          免费:紫微斗数排盘
      ziwei/analyze          付费后:调用 DeepSeek 生成命盘解读
      tarot/preview          免费:洗牌抽卡(真随机)
      tarot/analyze          付费后:调用 DeepSeek 生成塔罗解读
      astrology/preview      免费:用真实天文算法计算本命盘
      astrology/analyze      付费后:调用 DeepSeek 生成占星解读
      numerology/preview     免费:计算生命历程数等数字命理数据
      numerology/analyze     付费后:调用 DeepSeek 生成数字命理解读
      personality/preview    免费:MBTI计分(纯心理学,不含易经)
      personality/analyze    付费后:调用 DeepSeek 生成人格解读
      bigfive/preview        免费:大五人格五维度计分
      bigfive/analyze        付费后:调用 DeepSeek 生成深度解读
      workstyle/preview      免费:职场性格七维度计分
      workstyle/analyze      付费后:调用 DeepSeek 生成深度解读
      pay/create             创建订单 + 生成微信/支付宝二维码
      pay/status             前端轮询订单支付状态
      pay/notify/wechat      微信支付异步回调
      pay/notify/alipay      支付宝异步回调
  lib/
    bazi.ts                  八字排盘(基于 lunar-typescript)
    kline.ts                 人生K线生成算法(按天累加漂移 + 24H/1W/1M/年 多周期聚合)
    mbti.ts                  MBTI题库(50题)、计分逻辑,东方/现代两个页面共用
    hexagram.ts              梅花易数起卦(64卦表),仅东方玄学页使用
    ziwei.ts                 紫微斗数排盘(基于 iztro,十二宫/主辅星/大限)
    tarot.ts                 塔罗牌数据(78张牌)、洗牌抽牌逻辑
    astrology.ts             占星本命盘计算(真实天文算法,基于 astronomy-engine)
    numerology.ts            西方毕达哥拉斯数字命理算法(生命历程数/表达数/灵魂数/人格数等)
    bigfive.ts               大五人格题库(50题)与五维度计分逻辑
    workstyle.ts             职场性格七维度题库(42题)与计分逻辑(原创,非商业测评机构题库)
    wuxing.ts                五行生克关系与打分(含零均值基线修正)
    prompts.ts                喂给 DeepSeek 的九套提示词构造(八字/易经/紫微/塔罗/占星/数字命理/人格/大五人格/职场性格)
    deepseek.ts              DeepSeek Chat Completions 调用
    order.ts / db.ts         订单存取(默认本地 JSON 文件 data/orders.json;检测到 KV_REST_API_URL 时自动切换到 Vercel KV,适配 serverless 部署)
    payment/wechat.ts        微信支付 v3 Native 下单/验签/解密
    payment/alipay.ts        支付宝扫码下单/通知验签
  components/
    KLineChart.tsx           lightweight-charts 蜡烛图,支持多周期
    TarotCardView.tsx        塔罗牌卡片(3D翻转动画)
    PayPanel.tsx             支付弹窗(东方/西方/科学三套配色主题)
    MarkdownView.tsx         轻量 Markdown 渲染(用于展示AI解读)
```

## 关于"人生K线"的计算方式

按天(而非按年)推演:每一天的运势漂移量由当年所属**大运**、**流年**的干支,以及**当日干支**(六十甲子60天一轮)分别换算出对应五行,与"日主"五行做生克关系判断(比肩/印/食伤/官杀/财)后按小权重逐日累加,而不是每年独立打分再钳制——运好的阶段持续上涨,运差的阶段持续下跌,形成真正的趋势走势。所有关系打分特意配平为零均值并扣除了日主自身的期望偏移,避免出现"某类日主永远只涨或只跌"的系统性偏差。最后对整条序列做一次归一化映射到 0-100 区间。这是一种基于传统命理逻辑的**娱乐化可视化**,不是严肃的命理预测。

## 关于紫微斗数排盘的计算方式

不是简化模拟,而是接入 [iztro](https://github.com/SylarLong/iztro)(一套独立维护、覆盖单元测试的开源紫微斗数排盘库)完成真实的传统安星:先将阳历生辰转换为农历与干支,定出命宫、身宫与五行局,再按通行版本安星法把十四主星、辅星、杂耀分别安入十二宫,并推算大限起止年龄。时辰到"时辰索引"的换算覆盖早/晚子时的传统分界。

## 关于数字命理的计算方式

采用西方主流的**毕达哥拉斯数字命理学(Pythagorean Numerology)**:生命历程数由出生年月日的全部数字相加并逐位约减得到,生日数直接由出生日约减得到;若额外提供英文/拼音姓名,则按字母表格(A/J/S=1、B/K/T=2……I/R=9)换算出表达数(全部字母)、灵魂数(元音字母)、人格数(辅音字母)与成熟数(生命历程数+表达数)。约减规则遵循数字命理传统:反复对各位数字求和直到个位数,但 11/22/33 三个"主数"不再继续约减。

## 关于塔罗牌的玩法

采用标准韦特塔罗78张牌体系(22张大阿尔卡那 + 56张小阿尔卡那,小阿尔卡那按权杖/圣杯/宝剑/星币四种花色 × 数字1-10+侍从/骑士/王后/国王生成)。每次占卜都是**真随机**洗牌抽牌并独立判定正逆位(不依赖生辰,符合塔罗"当下起卦"的传统玩法),卡面用图标+文字呈现而非具体插画,避免涉及某一具体版本塔罗牌的版权插画。

## 关于占星本命盘的计算方式

不是查表估算,而是用 [astronomy-engine](https://github.com/cosinekitty/astronomy) 真实天文历法库计算太阳、月亮、水星、金星、火星、木星、土星在出生瞬间的**地心视黄经**(已换算到当日真黄道坐标,即"节气黄道",与占星传统一致),再落入对应的黄道十二宫(每宫30°,从白羊座0°起算)。上升星座另需出生地经纬度,用 Meeus《天文算法》的公式计算格林尼治恒星时 → 当地恒星时(RAMC)→ 结合黄赤交角与出生地纬度求出上升点黄经。该公式已用"日出时刻上升星座应与太阳所在黄经重合"这一天文事实,在南北半球、东西经、不同年代等多组样例上验证过,误差在1-2度以内(误差来源于太阳视半径与大气折射,属预期范围)。

## License

本项目基于 [MIT License](./LICENSE) 开源,可自由使用、修改与分发,请保留版权声明。
