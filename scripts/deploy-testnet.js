/**
 * Hedera Testnet Deployment Script
 * Deploys QuantumShield contracts and initializes marketplace
 */

import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
import { HederaClient } from '../src/hedera/HederaClient.js';
import { QuantumNFTMarketplace } from '../src/nft-marketplace/QuantumNFTMarketplace.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

class TestnetDeployer {
  constructor() {
    this.network = 'testnet';
    this.deploymentLog = [];
  }

  async deploy() {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         QUANTUMSHIELD TESTNET DEPLOYMENT                       ║
╚═══════════════════════════════════════════════════════════════╝
    `);

    try {
      // 1. Initialize Hedera Client
      console.log('\n1️⃣ Initializing Hedera Testnet Client...');
      const hederaClient = new HederaClient({
        network: this.network,
        operatorId: process.env.HEDERA_OPERATOR_ID,
        operatorKey: process.env.HEDERA_OPERATOR_KEY
      });

      const connected = await hederaClient.checkConnection();
      if (!connected) {
        throw new Error('Failed to connect to Hedera testnet. Check credentials.');
      }
      this.log('✅ Hedera testnet connected');

      // 2. Initialize NFT Marketplace
      console.log('\n2️⃣ Initializing Quantum NFT Marketplace...');
      const marketplace = new QuantumNFTMarketplace({
        hederaClient: hederaClient
      });

      const marketplaceInit = await marketplace.initializeMarketplace();
      this.log('✅ Marketplace initialized', marketplaceInit);
      console.log(`   Marketplace ID: ${marketplaceInit.id}`);
      console.log(`   HCS Topic: ${marketplaceInit.topic}`);

      // 3. Create Demo NFT Collection
      console.log('\n3️⃣ Creating Demo NFT Collection...');
      const collection = await marketplace.createCollection({
        name: 'QuantumShield Demo Collection',
        symbol: 'QSD',
        description: 'Demo collection for Hedera Hackathon 2025',
        creator: hederaClient.client.operatorAccountId.toString(),
        category: 'Technology',
        maxSupply: 1000
      });
      this.log('✅ Collection created', collection);
      console.log(`   Collection Token ID: ${collection.collection.tokenId}`);

      // 4. Mint Demo NFT
      console.log('\n4️⃣ Minting Demo NFT...');
      const demoNFT = await marketplace.mintNFT(collection.collection.tokenId, {
        name: 'QuantumShield Genesis NFT #1',
        description: 'First quantum-secured NFT on Hedera',
        image: 'https://quantumshield.hedera.io/genesis-nft.png',
        attributes: [
          { trait_type: 'Quantum Security', value: 'ML-DSA-65' },
          { trait_type: 'Network', value: 'Hedera Hashgraph' },
          { trait_type: 'Hackathon', value: 'Ascension 2025' }
        ],
        owner: hederaClient.client.operatorAccountId.toString()
      });
      this.log('✅ Demo NFT minted', demoNFT);
      console.log(`   NFT Serial: ${demoNFT.nft.serialNumber}`);

      // 5. Create Deployment Report
      console.log('\n5️⃣ Creating Deployment Report...');
      const deploymentReport = {
        network: this.network,
        deployedAt: new Date().toISOString(),
        marketplace: {
          id: marketplaceInit.id,
          topicId: marketplaceInit.topic,
          rewardToken: marketplaceInit.rewardToken
        },
        collection: {
          tokenId: collection.collection.tokenId.toString(),
          name: collection.metadata.name,
          symbol: collection.metadata.symbol
        },
        demoNFT: {
          tokenId: collection.collection.tokenId.toString(),
          serialNumber: demoNFT.nft.serialNumber.toString(),
          transactionId: demoNFT.nft.transactionId
        },
        account: {
          operatorId: hederaClient.client.operatorAccountId.toString(),
          balance: await hederaClient.getAccountBalance()
        }
      };

      const reportPath = path.join(__dirname, '..', 'submission', 'DEPLOYMENT_REPORT.json');
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify(deploymentReport, null, 2));
      this.log('✅ Deployment report created', reportPath);

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('✨ Testnet Deployment Completed Successfully!');
      console.log('═══════════════════════════════════════════════════════════════\n');

      console.log('📊 Deployment Summary:');
      console.log(`   Network: ${this.network}`);
      console.log(`   Marketplace ID: ${marketplaceInit.id}`);
      console.log(`   Collection Token: ${collection.collection.tokenId}`);
      console.log(`   Demo NFT Serial: ${demoNFT.nft.serialNumber}`);
      console.log(`   Report: ${reportPath}\n`);

      return deploymentReport;

    } catch (error) {
      console.error('\n❌ Deployment Error:', error.message);
      console.error(error.stack);
      throw error;
    }
  }

  log(message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    this.deploymentLog.push(entry);
    console.log(`   ${message}`);
  }

  getLog() {
    return this.deploymentLog;
  }
}

// Run deployment
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployer = new TestnetDeployer();
  deployer.deploy()
    .then(report => {
      console.log('\n✅ Deployment successful!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Deployment failed:', error);
      process.exit(1);
    });
}

export default TestnetDeployer;
