/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

async function setDomainCookies(domain) {
  const currentTab = await getCurrentTab();
  try {
    const cookies = await chrome.cookies.getAll({ domain });
    console.log(cookies);
    if (cookies.length === 0) {
      return 'No cookies found';
    }
    const pending = cookies.map(async (cookie) => {
      await setCookie(cookie, currentTab);
    });
    await Promise.all(pending);
  } catch (error) {
    console.log(error);
    return `Unexpected error: ${error.message}`;
  }
  await chrome.tabs.reload(currentTab.id);
  window.close();
  return `Add cookie(s).`;
}

async function setCookie(cookie, current) {
  const url = new URL(current.url).origin;
  return chrome.cookies.set({
    url,
    name: cookie.name,
    value: cookie.value,
    expirationDate: cookie.expirationDate,
  });
}
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true });
  return tab;
}
