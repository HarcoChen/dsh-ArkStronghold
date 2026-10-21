# 发布0.2.0-alpha.1

先发布本仓库源码，再将ark-play-dsh-0.2.0-alpha.1.zip附到GitHub预览Release。两个包由相邻ark-play-codex的tools/package.mjs统一打包，脚本和完整Release文案见核心PUBLISH.md。

源码通过明确Git提交固定共享核心，npm ci会安装它；本版独立发布包已附共享客户端、两个Worker模块、最小package.json与bundle patch，安装无需构建。

发布说明要注明：原生/ws单人对局；采集/保存/下载/鉴权归网站；普通战斗真实模拟；完整实测0.3.1；首领共享血池与玩法插件房间未完整验收；未实测真实DSH模型棋力。旧0.1.0包退役。
