# Ark Play — DSH 原生对局插件

`0.2.0-alpha.1`，使用Cordis ctx.tools.register直接提供6个对局工具，复用[ArkStrongholdCodex](https://github.com/HarcoChen/ArkStrongholdCodex)仓库中的共享原生 `/ws` 适配层，无MCP转接。

插件只进行对局。**采集、保存、导出、鉴权规则均由游戏站决定**；不包含网关、采集器、轨迹下载或游戏引擎副本。

## 安装发布包

Node 22+。源码仓库也附可运行dist；解压发布zip后，完整目录包含index.mjs、site-worker.mjs、site-loader.mjs与package.json，无需另装共享核心或npm依赖：

```sh
node configure.mjs --url wss://your-game-site/ws
dsh plugin --profile tui add /absolute/ark-play-dsh
```

包声明dsh.bundle.patch，加入profile后重启该profile。凭据按站点要求配置；默认原生guest站点无需额外Bearer。配置写到~/.config/ark-play/client.json（0600、拒绝覆盖），不连接或修改profile。实际插件安装命令由你执行，本任务未改用户全局配置。

对模型说：`用 ark_start 开一局深渊，按局面与公开说明决策，玩到自然结束；只对局，不下载或管理轨迹。`

工具：ark_start、ark_view、ark_act、ark_wait、ark_lookup、ark_finish。每个执行Agent有独立客户端，卸载时清理工具/连接/Worker。无需插件另带模型密钥，使用DSH现有模型配置。

## 能力与边界

支持原生协议v1、vanilla独立solo，完整实测0.3.1；代码兼容白名单另含0.3.0。复用站点公开客户端规则模块及公共数据，普通战斗后台计算；准备/展示/结算与首领共享血池遵循站点时钟。仅支持你信任的站点；Worker隔离状态，不是权限沙箱。玩法插件房间不支持，首领/隐藏关尚未端到端验收。

revision是本地快照前置检查，不是服务端原子锁。过期批次不发送；未知动作结果先ark_view，不能盲目重试。断线按站点hello令牌恢复，同进程内保持会话；重启不承诺恢复。服务器决定鉴权、是否采集以及如何标记Agent身份，昵称不是可信鉴权机制。

真实Cordis 4.0.5 / dsh-tools 0.2.0-rc.2注册的工具，已通过带证书校验的WSS完成一盘原生solo，服务器全量复算5场普通战斗且0不一致/拒绝/接管，卸载后0工具。未启动实际DSH模型或验收完整插件管理UI；这些是脚本接入验证。未新增测试/夹具。

## 源码开发

源码构建依赖固定到核心提交e604c146ab428c3f2faf220786b371d9d6647043，可独立克隆本仓库构建：

```sh
git clone https://github.com/HarcoChen/dsh-ArkStronghold.git
cd dsh-ArkStronghold
npm ci --ignore-scripts
npm run build
```

构建从已安装的核心依赖读取Worker源码，不依赖相邻目录。独立发布zip内已包含共享代码。具体发布说明见PUBLISH.md，协议与凭据配置详见核心README。旧0.1.0原型包已退役。

GPL-3.0-or-later，见LICENSE；分发附依赖许可与对应源码，不含上游引擎、美术、模型、凭据或对局记录。
