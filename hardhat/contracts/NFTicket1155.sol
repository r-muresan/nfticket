// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTicket1155 is ERC1155, Ownable {
    constructor() ERC1155("") {}
    mapping(uint256 => address) public eventOwner;
    mapping(uint256 => Event ) eventInfo;
    mapping(uint256 => mapping(address => bool)) invited;
    mapping(uint256 => mapping(address => bytes32)) passwords; 
    mapping(uint256 => mapping(address => bool)) claimed; //one ticket per addr
    mapping(uint256 => mapping(address => bool)) public bought;
    mapping(uint256 => string) tokenURIs; 
    uint256 internal eventID;
    //every nft is the same so no need to redeploy contract for every single token minted
    //ticketId => (buyer => buyer Amt);
    //if claimed setup is equivalent to balanceOf, then claimed is true

    //event has unique token ID
    
    //each addr can only mint one
    // tokenId => li t
    //user passes in token id
    //token id, each nft has a token id but they can be the same
    //each events tickets will have their own token ID
    //maps token ID to ticket holder to password
    //when you stake you also mint
    struct Event{
        uint256 id;
        uint256 supply;
        bool hasWhitelist;
        //if there is a whitelist, they can only Mint if theyre on the list
        //if there is not a whitelist, anyone can mint
    }

    modifier onlyNewBuyer(uint256 id){
        require(bought[id][msg.sender] = false, "caller already minted a ticket");
        _;
    }

    modifier onlyInvitedBuyer(uint256 id){
        require(invited[id][msg.sender] = true, "caller is not a buyer");
        _;
    }

    modifier onlyEventOwner(uint256 id){
        require(eventOwner[id] == msg.sender, "caller is not the event owner");
        _;
    }

    function createEvent(uint256 _supply, string memory newuri) 
        public 
        onlyEventOwner(eventID)
    {

        eventInfo[eventID] = Event({
            id: eventID,
            supply: _supply,
            hasWhitelist: false
        });

        _setURI(newuri);

        tokenURIs[eventID] = newuri;

        eventOwner[eventID] = msg.sender;

        eventID += 1;
    }

    function createEvent(uint256 _supply, address[] memory _buyers, string memory newuri) 
        public 
        onlyEventOwner(eventID)
    {
        eventInfo[_id] = Event({
            id: eventID,
            supply: _supply,
            hasWhitelist: true
        });

        for(uint256 i; i < _buyers.length; i++){
            invited[eventID][_buyers[i]] = true;
        }

        _setURI(newuri);

        tokenURIs[eventID] = newuri;

        eventOwner[eventID] = msg.sender;

        eventID += 1;
    }

    function mint(uint256 id, uint256 amount, bytes memory data)
        public
        onlyNewBuyer(eventID)
    {
        Event storage _event = eventInfo[id];
        if (_event.hasWhitelist){
            require(invited[id][msg.sender] == true, "you are not invited to this event");
        }   

        bought[id][msg.sender] == true; 

        _mint(msg.sender, id, amount, data);
    }

    function queryPassword(uint256 _id, address _user) public view onlyOwner returns(bytes32) {
        return passwords[_id][_user];
    }

    function claimTicket(uint _id, address _user) public onlyOwner {
        require(claimed[_id][_user] == false, "ticket already claimed");
        claimed[_id][_user] = true;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}