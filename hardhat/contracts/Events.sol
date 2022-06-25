// SPDX-License-Identifier: Unlicenensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// Opensea Meta-transactions
abstract contract ContextMixin {
    function msgSender()
        internal
        view
        returns (address payable sender)
    {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            sender = payable(msg.sender);
        }
        return sender;
    }
}

contract BlockFactory is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable, Pausable, VRFConsumerBaseV2, ContextMixin {
    uint256 private pricePerBlock = 0.5 ether;
    address private cobloxBuildContract;

    uint256 constant blockCount = 19;
    mapping(uint256 => address) private requestToPurchaser;

    // Chainlink Params
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 constant s_subscriptionId = 212;
    address constant vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    bytes32 constant keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 constant callbackGasLimit = 2500000;
    uint16 constant requestConfirmations = 3;


    constructor() ERC1155("https://ipfs.io/ipfs/QmSAbZwmw5Sy39irk7UsQQEnte6t6p3LLzbu8uynMNaJcp/{id}.json") VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    }

    // ---------------- 
    // Getters
    // ----------------
    function getPricePerBlock() public view returns (uint256) {
        return pricePerBlock;
    }

    function getInventory(address _owner) public view returns (uint256[] memory) {
        uint256[] memory inventory = new uint256[](blockCount);
        for (uint256 i = 1; i < blockCount; i++) {
            inventory[i] = balanceOf(_owner, i);
        }
        return inventory;
    }

    // ---------------- 
    // Mutation
    // ----------------
    function buyBlocks(uint256 amount) public payable whenNotPaused() {
        require(msg.value == pricePerBlock * amount, "Invalid value");
        require(amount > 0 && amount < 51, "Invalid amount");

        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            uint32(2 * amount)
        );
        requestToPurchaser[requestId] = msg.sender;
    }

    // ----------------
    // Chainlink 
    // ----------------
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address purchaser = requestToPurchaser[requestId];
        delete requestToPurchaser[requestId];
        
        uint256[] memory blocksToMint = new uint256[](blockCount);

        for(uint256 i; i < randomWords.length / 2; i++) {
            uint256 rarityValue = randomWords[i * 2] % 100;
            uint256 blockId;

            if(rarityValue < 2){
                blockId = (randomWords[i * 2 + 1] % 3) + 16; //Blocks 16-18
            }
            else if(rarityValue < 10){
                blockId = (randomWords[i * 2 + 1] % 4) + 12; //Blocks 12-15
            }
            else if(rarityValue < 25){
                blockId = (randomWords[i * 2 + 1] % 3) + 9; //Blocks 9-11
            }
            else if(rarityValue < 50){
                blockId = (randomWords[i * 2 + 1] % 4) + 5; //Blocks 5-8
            }
            else {
                blockId = (randomWords[i * 2 + 1] % 4) + 1; //Blocks 1-4
            }
            blocksToMint[blockId]++;
        }

        uint256 uniqueBlocks;
        for(uint256 i; i < blocksToMint.length; i++) {
            if(blocksToMint[i] > 0) {
                uniqueBlocks++;
            }
        }

        uint256 arrayIndex = 0;
        uint256[] memory ids = new uint256[](blockCount);
        uint256[] memory amounts = new uint256[](blockCount);

        for(uint256 i; i < blocksToMint.length; i++) {
            if(blocksToMint[i] > 0) {
                ids[arrayIndex] = i;
                amounts[arrayIndex] = blocksToMint[i];
                arrayIndex++;
            }
        }

        mintBatch(purchaser, ids, amounts, "");
    }

    // ---------------- 
    // Owner Functions
    // ----------------
    function claimFunds() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transaction failed");
    }

    function setCobloxBuildContractAddress(address _cobloxBuildContractAddress) public onlyOwner {
        cobloxBuildContract = _cobloxBuildContractAddress;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // ----------------
    // ERC1155
    // ----------------
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        private 
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // ----------------
    //   Opensea Compatibilites
    // ----------------
    function contractURI() public view returns (string memory) {
        string memory _contractURI = string(abi.encodePacked(
                    '{"name" : "Coblox Blocks",'
                    '"description" : "Coblox is First-Ever 3D, Cooperative NFT Builder. The community builds the NFTs and determines their price. The 18 blocks in this collection can be placed to build NFTs alongside the community.",' 
                    '"image" : "https://testnet.coblox.app/icon",'
                    '"external_link" : "https://testnet.coblox.app",'
                    '"seller_fee_basis_points" : 500,'
                    '"fee_recipient": "',
                    Strings.toHexString(uint256(uint160(owner())), 20), // Address -> String
                    '"}'
                    ));
        return string(abi.encodePacked("data:application/json,", _contractURI));
    }

    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
        // Polygon testnet: 0x53d791f18155C211FF8b58671d0f7E9b50E596ad
        // Polygon mainnet: 0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101
        
       if (_operator == address(0x53d791f18155C211FF8b58671d0f7E9b50E596ad) ||  _operator == cobloxBuildContract) {
            return true;
        }

        return ERC1155.isApprovedForAll(_owner, _operator);
    }
}
