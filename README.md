# Ark Play — Deepseek Harness ArkStronghold对局插件

提供6个对局工具，复用[ArkStrongholdCodex](https://github.com/HarcoChen/ArkStrongholdCodex)仓库中的共享原生 `/ws` 适配层
## 安装发布包
对模型说：`用 ark_start 开一局深渊（终极），按局面与公开说明决策，玩到自然结束。`

工具：ark_start、ark_view、ark_act、ark_wait、ark_lookup、ark_finish。每个执行Agent有独立客户端，卸载时清理工具/连接/Worker。无需插件另带模型密钥，使用DSH现有模型配置。


## 源码开发

源码构建依赖固定到核心提交e604c146ab428c3f2faf220786b371d9d6647043，可独立克隆本仓库构建：

```sh
git clone https://github.com/HarcoChen/dsh-ArkStronghold.git
cd dsh-ArkStronghold
npm ci --ignore-scripts
npm run build
```
## License
GPL-3.0-or-later，见LICENSE；分发附依赖许可与对应源码，不含上游引擎、美术、模型、凭据或对局记录。
