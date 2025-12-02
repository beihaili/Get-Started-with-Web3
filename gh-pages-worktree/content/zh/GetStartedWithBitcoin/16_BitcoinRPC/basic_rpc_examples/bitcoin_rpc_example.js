#!/usr/bin/env node
/**
 * 比特币RPC接口示例脚本 - JavaScript/Node.js版本
 * 按照文档中的示例创建，用于演示如何通过RPC接口与比特币核心交互
 */

const axios = require('axios');

// RPC连接配置
const RPC_USER = "your_username";
const RPC_PASSWORD = "your_password";
const RPC_HOST = "127.0.0.1";
const RPC_PORT = 8332;
const RPC_URL = `http://${RPC_USER}:${RPC_PASSWORD}@${RPC_HOST}:${RPC_PORT}`;

/**
 * 调用比特币RPC接口
 * @param {string} method - RPC方法名
 * @param {Array} params - RPC参数
 * @returns {Promise} - 返回RPC响应的Promise
 */
async function callRPC(method, params = []) {
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: "1.0",
      id: "js-bitcoin-rpc",
      method: method,
      params: params
    });
    
    return response.data.result;
  } catch (error) {
    console.error(`调用RPC时发生错误: ${error.message}`);
    if (error.response) {
      console.error(`响应数据: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * 主函数，演示各种RPC调用
 */
async function main() {
  console.log("===== 比特币RPC接口示例 - JavaScript/Node.js版本 =====");
  
  try {
    // 获取区块链信息
    console.log("\n>>> 获取区块链信息");
    const blockchainInfo = await callRPC("getblockchaininfo");
    console.log(`区块链: ${blockchainInfo.chain}`);
    console.log(`当前区块高度: ${blockchainInfo.blocks}`);
    console.log(`区块头数量: ${blockchainInfo.headers}`);
    console.log(`同步进度: ${(blockchainInfo.verificationprogress * 100).toFixed(2)}%`);
    console.log(`修剪模式: ${blockchainInfo.pruned ? '是' : '否'}`);
    
    // 获取网络信息
    console.log("\n>>> 获取网络信息");
    const networkInfo = await callRPC("getnetworkinfo");
    console.log(`版本: ${(networkInfo.version / 1000000).toFixed(1)}`);
    console.log(`连接数: ${networkInfo.connections}`);
    console.log(`协议版本: ${networkInfo.protocolversion}`);
    
    // 获取钱包信息
    console.log("\n>>> 获取钱包信息");
    try {
      const walletInfo = await callRPC("getwalletinfo");
      console.log(`钱包名称: ${walletInfo.walletname}`);
      console.log(`钱包余额: ${walletInfo.balance} BTC`);
      console.log(`交易数量: ${walletInfo.txcount}`);
    } catch (error) {
      console.log("获取钱包信息失败，可能需要先创建或加载钱包");
    }
    
    // 获取最新区块信息
    console.log("\n>>> 获取最新区块信息");
    const blockCount = await callRPC("getblockcount");
    const blockHash = await callRPC("getblockhash", [blockCount]);
    const block = await callRPC("getblock", [blockHash]);
    
    const blockTime = new Date(block.time * 1000);
    console.log(`区块哈希: ${block.hash}`);
    console.log(`区块高度: ${block.height}`);
    console.log(`区块时间: ${blockTime.toISOString()}`);
    console.log(`交易数量: ${block.tx.length}`);
    console.log(`难度: ${block.difficulty}`);
    
    console.log("\n脚本执行完毕！");
  } catch (error) {
    console.error(`执行过程中发生错误: ${error.message}`);
  }
}

// 执行主函数
main();
