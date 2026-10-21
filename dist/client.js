window.__ModuleLoader__.load({id:"dsh-ark-stronghold",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// client.mjs
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");

// site-url.mjs
function normalizeSiteUrl(value) {
  const input = String(value ?? "").trim();
  if (!input) return "";
  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error("\u8BF7\u8F93\u5165\u5B8C\u6574\u7684\u6E38\u620F\u7AD9\u7F51\u5740\uFF0C\u4F8B\u5982 https://ark.harco.top");
  }
  if (url.username || url.password || url.search || url.hash || !["/", "/ws", "/ws/"].includes(url.pathname)) {
    throw new Error("\u6E38\u620F\u7AD9\u5730\u5740\u53EA\u652F\u6301\u7AD9\u70B9\u6839\u8DEF\u5F84\u6216 /ws\uFF0C\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u7247\u6BB5");
  }
  const protocol = { https: "wss:", http: "ws:", wss: "wss:", ws: "ws:" }[url.protocol.slice(0, -1)];
  if (!protocol) throw new Error("\u6E38\u620F\u7AD9\u5730\u5740\u9700\u8981 https:// \u6216 wss://");
  if (protocol === "ws:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error("\u8FDC\u7A0B\u6E38\u620F\u7AD9\u5FC5\u987B\u4F7F\u7528 HTTPS / WSS\uFF1BHTTP / WS \u4EC5\u9650\u672C\u673A\u56DE\u73AF\u5730\u5740");
  }
  return protocol + "//" + url.host + "/ws";
}

// client.mjs
var inject = ["slots", "configForms"];
var ID = "dsh-ark-stronghold";
var control = { padding: "10px 12px", border: "1px solid #8886", borderRadius: 8, background: "transparent", color: "inherit", font: "inherit" };
function Panel(props) {
  const snapshot = props.useArkSettings((value) => value);
  const mirror = props.useSettingsStatus((value) => value);
  const [draft, setDraft] = (0, import_react.useState)("");
  const [dirty, setDirty] = (0, import_react.useState)(false);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [message, setMessage] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    if (!dirty && snapshot.value) setDraft(snapshot.value.url || "");
  }, [snapshot.value, dirty]);
  async function save(event) {
    event.preventDefault();
    setMessage("");
    try {
      const url = normalizeSiteUrl(draft);
      setBusy(true);
      const accepted = await props.save(url);
      if (!accepted) throw new Error("\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      setDraft(url);
      setDirty(false);
      setMessage("\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u5F00\u5C40\u751F\u6548\u3002");
    } catch (error) {
      setMessage(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }
  return (0, import_react.createElement)(
    "section",
    { style: { padding: 28, width: "100%", boxSizing: "border-box", color: "inherit" } },
    (0, import_react.createElement)(
      "form",
      { onSubmit: save, style: { maxWidth: 560, display: "grid", gap: 12 } },
      (0, import_react.createElement)("label", { htmlFor: "ark-site-url", style: { fontSize: 18, fontWeight: 600 } }, "\u6E38\u620F\u7AD9\u5730\u5740"),
      (0, import_react.createElement)("input", { id: "ark-site-url", value: draft, onChange: (e) => {
        setDraft(e.target.value);
        setDirty(true);
        setMessage("");
      }, placeholder: "https://ark.harco.top", disabled: busy, spellCheck: false, autoComplete: "url", style: { ...control, width: "100%", boxSizing: "border-box" } }),
      (0, import_react.createElement)("button", { type: "submit", disabled: busy, style: { ...control, justifySelf: "start", cursor: "pointer" } }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"),
      message || mirror.error ? (0, import_react.createElement)("p", { role: "status", style: { margin: 0, fontSize: 13, overflowWrap: "anywhere" } }, message || "\u914D\u7F6E\u8BFB\u53D6\u5931\u8D25\uFF1A" + mirror.error) : null
    )
  );
}
function Icon() {
  return (0, import_react.createElement)("span", { "aria-hidden": true }, "\u265C");
}
function apply(ctx) {
  const scope = ctx.configForms.get("ark-play");
  ctx.effect(() => ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: ID, inject: () => ({ hooks: { arkSettings: scope, settingsStatus: ctx.configForms.describe() }, save: (url) => scope.set("url", url) }) }, Panel)));
  ctx.effect(() => ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: ID, order: 30, label: "Ark Stronghold" }, Icon)));
}
return module.exports;}});
