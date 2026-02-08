/**
 * Gemini API工具函数
 */

const STORAGE_KEY = 'web3-app-store';

/**
 * 从持久化存储获取 Gemini API Key
 * 兼容 Zustand persist 的存储格式
 */
function getApiKey() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.geminiApiKey || '';
    }
  } catch {
    // fallback
  }
  return '';
}

/**
 * 安全的 Gemini API 调用
 * @param {string} prompt - 用户提示
 * @param {string} systemInstruction - 系统指令
 * @param {boolean} jsonMode - 是否返回JSON格式
 * @returns {Promise<string>} API响应
 */
export async function callGemini(prompt, systemInstruction = '', jsonMode = false) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('请先配置您的 Gemini API Key');
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: jsonMode ? 'application/json' : 'text/plain',
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

/**
 * 测试API Key是否有效
 */
export async function testApiKey() {
  await callGemini("Say 'Hello, Web3 Builder!' in one sentence.", '', false);
  return true;
}
