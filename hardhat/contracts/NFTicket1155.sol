// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTicket1155 is ERC1155, Ownable {
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
    constructor() ERC1155("") {}

    struct Event{
        uint256 id;
        uint256 supply;
        uint256 eventDate;
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

    modifier eventNotPassed(uint256 id) {
        require(eventInfo[id].eventDate < block.timestamp, "event has passed");
        _;
    }


    //

    function createEvent(uint256 _supply, uint256 _eventDate, string memory newuri) 
        public 
        onlyEventOwner(eventID)
    {
        eventID += 1;

        require(_eventDate < block.timestamp, "event must happen in the future");

        eventInfo[eventID] = Event({
            id: eventID,
            supply: _supply,
            eventDate: _eventDate,
            hasWhitelist: false
        });

        tokenURIs[eventID] = newuri;

        eventOwner[eventID] = msg.sender;  
    }

    function createEvent(uint256 _supply, uint256 _eventDate, address[] memory _buyers, string memory tokenURI) 
        public 
        onlyEventOwner(eventID)
    {
        eventID += 1;

        require(_eventDate < block.timestamp, "event must happen in the future");
        
        eventInfo[eventID] = Event({
            id: eventID,
            supply: _supply,
            eventDate: _eventDate,
            hasWhitelist: true
        });

        for(uint256 i; i < _buyers.length; i++){
            invited[eventID][_buyers[i]] = true;
        }

        tokenURIs[eventID] = tokenURI;

        eventOwner[eventID] = msg.sender;

       
    }

    function uri(uint256 id) public view override returns(string memory){
        return tokenURIs[id];
    }

    function mint(uint256 id, uint256 amount, bytes memory data)
        public
        onlyNewBuyer(id)
        eventNotPassed(id)
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

    function getActiveEvents() public view returns (Event[] memory){
        uint256 count;
        for(uint256 i; i < eventID; i++){
            if (eventInfo[i].eventDate < block.timestamp){
                count++;
            }
        }

        Event[] memory activeEvents = new Event[](count);
        uint256 index;

        for(uint256 i; i < eventID; i++){
            if (eventInfo[i].eventDate < block.timestamp){
                activeEvents[index] = eventInfo[i];
                index++;
            }
        }
        return activeEvents;
    }

    function getEventOwner(uint256 _id) public returns (address){
        return eventOwner[_id];
    }

    function didUserBuy(uint256 _id, address user) public returns (bool){
        return bought[_id][user];
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}