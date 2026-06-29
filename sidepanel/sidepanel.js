const BASE_URL = "https://atc.bmw-brilliance.cn/confluence";

const pageInfoEl = document.getElementById("pageInfo");
const authResultEl = document.getElementById("authResult");
const childrenResultEl = document.getElementById("childrenResult");

document.getElementById("getPageInfoBtn").addEventListener("click", async () => {
  pageInfoEl.textContent = "读取中...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab || !tab.id) {
      pageInfoEl.textContent = "没有找到当前标签页";
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_INFO" }, (response) => {
      if (chrome.runtime.lastError) {
        pageInfoEl.textContent = "读取失败：" + chrome.runtime.lastError.message;
        return;
      }

      pageInfoEl.textContent = JSON.stringify(response, null, 2);
    });
  } catch (error) {
    pageInfoEl.textContent = "异常：" + error.message;
  }
});

document.getElementById("testAuthBtn").addEventListener("click", async () => {
  authResultEl.textContent = "测试中...";

  try {
    const response = await fetch(`${BASE_URL}/rest/api/user/current`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    const text = await response.text();

    authResultEl.textContent = [
      `HTTP Status: ${response.status}`,
      "",
      text
    ].join("\n");

  } catch (error) {
    authResultEl.textContent = "请求失败：" + error.message;
  }
});

document.getElementById("loadChildrenBtn").addEventListener("click", async () => {
  const parentPageId = document.getElementById("parentPageId").value.trim();

  if (!parentPageId) {
    childrenResultEl.textContent = "请先输入父页面 pageId";
    return;
  }

  childrenResultEl.textContent = "读取中...";

  try {
    const url = `${BASE_URL}/rest/api/content/${encodeURIComponent(parentPageId)}/child?expand=page`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    const text = await response.text();

    childrenResultEl.textContent = [
      `HTTP Status: ${response.status}`,
      "",
      text
    ].join("\n");

  } catch (error) {
    childrenResultEl.textContent = "请求失败：" + error.message;
  }
});