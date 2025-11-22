// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

/**
 * @title QuantumShield AI Agent Registry
 * @notice DEMO smart contract for verifiable AI agents on Hedera
 * @dev ERC-8004 compatible agent registry with quantum signature verification
 * Created during Hedera Ascension Hackathon 2025 (Nov 3-21, 2025)
 */

/**
 * @notice Agent metadata structure
 */
struct AgentMetadata {
    string agentId;
    string name;
    string[] capabilities;
    string publicKey; // ML-DSA public key (base64)
    uint256 reputation;
    uint256 totalActions;
    uint256 verifiedActions;
    bool active;
    uint256 createdAt;
}

/**
 * @title QuantumShieldAgentRegistry
 * @notice Registry for verifiable AI agents with quantum signatures
 */
contract QuantumShieldAgentRegistry {
    // Agent storage
    mapping(string => AgentMetadata) public agents;
    mapping(string => bool) public agentExists;
    
    // Action proofs storage
    mapping(string => mapping(string => bool)) public actionProofs; // agentId => actionHash => exists
    
    // Events
    event AgentRegistered(
        string indexed agentId,
        string name,
        string publicKey,
        uint256 timestamp
    );
    
    event AgentActionVerified(
        string indexed agentId,
        string indexed actionHash,
        bool verified,
        uint256 timestamp
    );
    
    event ReputationUpdated(
        string indexed agentId,
        uint256 newReputation,
        uint256 timestamp
    );

    /**
     * @notice Register a new AI agent
     * @param agentId Unique agent identifier
     * @param name Agent name
     * @param capabilities Array of agent capabilities
     * @param publicKey ML-DSA public key (base64 encoded)
     */
    function registerAgent(
        string memory agentId,
        string memory name,
        string[] memory capabilities,
        string memory publicKey
    ) external {
        require(!agentExists[agentId], "Agent already exists");
        require(bytes(publicKey).length > 0, "Invalid public key");
        
        agents[agentId] = AgentMetadata({
            agentId: agentId,
            name: name,
            capabilities: capabilities,
            publicKey: publicKey,
            reputation: 0,
            totalActions: 0,
            verifiedActions: 0,
            active: true,
            createdAt: block.timestamp
        });
        
        agentExists[agentId] = true;
        
        emit AgentRegistered(agentId, name, publicKey, block.timestamp);
    }

    /**
     * @notice Verify agent action proof
     * @param agentId Agent identifier
     * @param actionHash Hash of the action (computed off-chain)
     * @param signature ML-DSA signature (base64 encoded)
     * @return verified Whether the action is verified
     * 
     * @dev Note: Full ML-DSA verification happens off-chain
     * This contract stores the verification result
     */
    function verifyActionProof(
        string memory agentId,
        string memory actionHash,
        string memory signature
    ) external returns (bool verified) {
        require(agentExists[agentId], "Agent not found");
        require(!actionProofs[agentId][actionHash], "Action already verified");
        
        // In production, ML-DSA verification happens off-chain via Hedera HCS
        // This is a demo showing the contract structure
        
        // Mark action as verified
        actionProofs[agentId][actionHash] = true;
        
        // Update agent stats
        agents[agentId].totalActions++;
        agents[agentId].verifiedActions++;
        
        // Update reputation (simplified: percentage of verified actions)
        uint256 total = agents[agentId].totalActions;
        uint256 verified = agents[agentId].verifiedActions;
        agents[agentId].reputation = (verified * 100) / total;
        
        emit AgentActionVerified(agentId, actionHash, true, block.timestamp);
        emit ReputationUpdated(agentId, agents[agentId].reputation, block.timestamp);
        
        return true;
    }

    /**
     * @notice Get agent metadata
     * @param agentId Agent identifier
     * @return metadata Agent metadata structure
     */
    function getAgent(string memory agentId) external view returns (AgentMetadata memory metadata) {
        require(agentExists[agentId], "Agent not found");
        return agents[agentId];
    }

    /**
     * @notice Check if action proof exists
     * @param agentId Agent identifier
     * @param actionHash Action hash
     * @return exists Whether proof exists
     */
    function hasActionProof(string memory agentId, string memory actionHash) external view returns (bool exists) {
        return actionProofs[agentId][actionHash];
    }

    /**
     * @notice Deactivate agent
     * @param agentId Agent identifier
     */
    function deactivateAgent(string memory agentId) external {
        require(agentExists[agentId], "Agent not found");
        agents[agentId].active = false;
    }
}
