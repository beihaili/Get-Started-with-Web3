/**
 * Gemini API工具函数
 * 从原App.jsx迁移 (lines 52-91)
 */

/**
 * 安全的 Gemini API 调用
 * @param {string} prompt - 用户提示
 * @param {string} systemInstruction - 系统指令
 * @param {boolean} jsonMode - 是否返回JSON格式
 * @returns {Promise<string>} API响应
 */
export async function callGemini(prompt, systemInstruction = '', jsonMode = false) {
  // 从localStorage获取API key
  const apiKey = localStorage.getItem('gemini-api-key');

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
      // 如果是API key错误，清除存储的key
      if (data.error.message.includes('API_KEY') || data.error.message.includes('invalid')) {
        localStorage.removeItem('gemini-api-key');
      }
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
