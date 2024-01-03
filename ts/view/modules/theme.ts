import Color from "color";
import { ipcRenderer } from "electron";

function setPropertys(propertys: { key: string, value: string }[]) {
  for (const { key, value } of propertys) {
    document.documentElement.style.setProperty(key, value);
  }
}

export async function initTheme() {
  let themeColor = new Color(await ipcRenderer.invoke('theme:get_color'));
  setPropertys([
    { key: '--theme', value: themeColor.hex() },
    { key: '--theme-color', value: themeColor.isDark() ? '#fff' : '#000' },
    { key: '--theme-1', value: themeColor.alpha(0.1).hexa() },
    { key: '--theme-5', value: themeColor.alpha(0.5).hexa() },
  ]);
}