/**
 * Hedera Testnet Deployment Script
 * Deploys QuantumShield contracts and initializes infrastructure
 */

import {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TopicCreateTransaction,
  FileCreateTransaction,
  ContractCreateTransaction,
  Hbar,
  AccountBalanceQuery
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HederaDeployer {
  constructor() {
    this.network = process.env.HEDERA_NETWORK || 'testnet';
    this.operatorId = process.env.HEDERA_OPERATOR_ID;
    this.operatorKey = process.env.HEDERA_OPERATOR_KEY;
    
    if (!this.operatorId || !this.operatorKey) {
      throw new Error('HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY must be set in .env');
    }
    
    this.client = this.network === 'mainnet' 
      ? Client.forMainnet()
      : Client.forTestnet();
    
    this.client.setOperator(
      AccountId.fromString(this.operatorId),
      PrivateKey.fromString(this.operatorKey)
    );
    
    this.deploymentResults = {};
  }

  async checkBalance() {
    console.log('\n💰 Checking account balance...');
    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(this.client.operatorAccountId)
        .execute(this.client);
      
      console.log(`   Account: ${this.client.operatorAccountId}`);
      console.log(`   Balance: ${balance.hbars.toString()} HBAR`);
      
      if (balance.hbars.toTinybars() < 1000000000) { // Less than 1 HBAR
        console.warn('   ⚠️ Low balance! You may need more HBAR for deployment.');
      }
      
      return balance;
    } catch (error) {
      console.error('   ❌ Balance check failed:', error.message);
      throw error;
    }
  }

  async deployNFTCollection() {
    console.log('\n🎨 Deploying Quantum NFT Collection...');
    
    try {
      const tokenTx = new TokenCreateTransaction()
        .setTokenName('QuantumShield NFT')
        .setTokenSymbol('QSNFT')
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setSupplyType(TokenSupplyType.Infinite)
        .setMaxSupply(10000)
        .setTreasuryAccountId(this.client.operatorAccountId)
        .setAutoRenewAccountId(this.client.operatorAccountId);
      
      const tokenResponse = await tokenTx.execute(this.client);
      const tokenReceipt = await tokenResponse.getReceipt(this.client);
      const tokenId = tokenReceipt.tokenId;
      
      console.log(`   ✅ NFT Collection created: ${tokenId}`);
      
      this.deploymentResults.nftCollection = {
        tokenId: tokenId.toString(),
        name: 'QuantumShield NFT',
        symbol: 'QSNFT',
        maxSupply: 10000
      };
      
      return tokenId;
    } catch (error) {
      console.error('   ❌ NFT Collection deployment failed:', error.message);
      throw error;
    }
  }

  async deployRewardToken() {
    console.log('\n🪙 Deploying Quantum Rewards Token...');
    
    try {
      const tokenTx = new TokenCreateTransaction()
        .setTokenName('Quantum Rewards')
        .setTokenSymbol('QR')
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(8)
        .setInitialSupply(10000000)
        .setTreasuryAccountId(this.client.operatorAccountId)
        .setAutoRenewAccountId(this.client.operatorAccountId);
      
      const tokenResponse = await tokenTx.execute(this.client);
      const tokenReceipt = await tokenResponse.getReceipt(this.client);
      const tokenId = tokenReceipt.tokenId;
      
      console.log(`   ✅ Reward Token created: ${tokenId}`);
      console.log(`   Initial Supply: 10,000,000 QR`);
      
      this.deploymentResults.rewardToken = {
        tokenId: tokenId.toString(),
        name: 'Quantum Rewards',
        symbol: 'QR',
        initialSupply: 10000000
      };
      
      return tokenId;
    } catch (error) {
      console.error('   ❌ Reward Token deployment failed:', error.message);
      throw error;
    }
  }

  async deployHCS() {
    console.log('\n📝 Deploying HCS Topic for Quantum Proofs...');
    
    try {
      const topicTx = new TopicCreateTransaction()
        .setTopicMemo('QuantumShield - Quantum Proof Topic')
        .setAdminKey(this.client.operatorPublicKey);
      
      const topicResponse = await topicTx.execute(this.client);
      const topicReceipt = await topicResponse.getReceipt(this.client);
      const topicId = topicReceipt.topicId;
      
      console.log(`   ✅ HCS Topic created: ${topicId}`);
      
      this.deploymentResults.hcsTopic = {
        topicId: topicId.toString(),
        memo: 'QuantumShield - Quantum Proof Topic'
      };
      
      return topicId;
    } catch (error) {
      console.error('   ❌ HCS Topic deployment failed:', error.message);
      throw error;
    }
  }

  async deploySmartContract(bytecodePath) {
    console.log('\n📜 Deploying Smart Contract...');
    
    try {
      // Read bytecode (if available)
      let bytecode;
      try {
        bytecode = await fs.readFile(bytecodePath, 'utf8');
      } catch (error) {
        console.log('   ⚠️ Bytecode file not found, using placeholder');
        bytecode = '0x608060405234801561001057600080fd5b50'; // Placeholder
      }
      
      // Create file for bytecode
      const fileTx = new FileCreateTransaction()
        .setContents(Buffer.from(bytecode))
        .setKeys([this.client.operatorPublicKey]);
      
      const fileResponse = await fileTx.execute(this.client);
      const fileReceipt = await fileResponse.getReceipt(this.client);
      const bytecodeFileId = fileReceipt.fileId;
      
      console.log(`   ✅ Bytecode file created: ${bytecodeFileId}`);
      
      // Deploy contract
      const contractTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .setInitialBalance(new Hbar(1));
      
      const contractResponse = await contractTx.execute(this.client);
      const contractReceipt = await contractResponse.getReceipt(this.client);
      const contractId = contractReceipt.contractId;
      
      console.log(`   ✅ Contract deployed: ${contractId}`);
      
      this.deploymentResults.smartContract = {
        contractId: contractId.toString(),
        bytecodeFileId: bytecodeFileId.toString()
      };
      
      return contractId;
    } catch (error) {
      console.error('   ❌ Smart Contract deployment failed:', error.message);
      throw error;
    }
  }

  async saveDeploymentResults() {
    const resultsPath = path.join(__dirname, '../deployment-results.json');
    const results = {
      network: this.network,
      operatorId: this.operatorId,
      deployedAt: new Date().toISOString(),
      results: this.deploymentResults
    };
    
    await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Deployment results saved: ${resultsPath}`);
  }

  async deployAll() {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         HEDERA TESTNET DEPLOYMENT - QUANTUMSHIELD            ║
╚═══════════════════════════════════════════════════════════════╝
    `);
    
    try {
      // Check balance
      await this.checkBalance();
      
      // Deploy NFT Collection
      await this.deployNFTCollection();
      
      // Deploy Reward Token
      await this.deployRewardToken();
      
      // Deploy HCS Topic
      await this.deployHCS();
      
      // Deploy Smart Contract (if bytecode available)
      const bytecodePath = path.join(__dirname, '../contracts/QuantumBridge.bin');
      try {
        await this.deploySmartContract(bytecodePath);
      } catch (error) {
        console.log('   ⚠️ Smart contract deployment skipped (bytecode not compiled)');
      }
      
      // Save results
      await this.saveDeploymentResults();
      
      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              ✅ DEPLOYMENT COMPLETE                           ║
╠═══════════════════════════════════════════════════════════════╣
║  Network: ${this.network.padEnd(51)} ║
║  NFT Collection: ${(this.deploymentResults.nftCollection?.tokenId || 'N/A').padEnd(44)} ║
║  Reward Token: ${(this.deploymentResults.rewardToken?.tokenId || 'N/A').padEnd(47)} ║
║  HCS Topic: ${(this.deploymentResults.hcsTopic?.topicId || 'N/A').padEnd(50)} ║
╚═══════════════════════════════════════════════════════════════╝
      `);
      
      console.log('\n📋 Next Steps:');
      console.log('   1. Review deployment-results.json');
      console.log('   2. Update .env with deployed contract addresses');
      console.log('   3. Test NFT minting');
      console.log('   4. Test quantum signature verification');
      console.log('   5. Deploy to mainnet when ready\n');
      
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }
}

// Run deployment
const deployer = new HederaDeployer();
deployer.deployAll().catch(console.error);
