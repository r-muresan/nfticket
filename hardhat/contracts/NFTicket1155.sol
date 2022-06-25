// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTicket1155 is ERC1155, Ownable {
    mapping(uint256 => address) public eventOwner;
    mapping(uint256 => Event ) eventInfo;
    mapping(uint256 => address[]) buyers;
    //tells us all addrs that bought a ticket for that event
    mapping(uint256 => mapping(address => bool)) invited;
    mapping(uint256 => mapping(address => bytes32)) passwords; 
    mapping(uint256 => mapping(address => bool)) claimed; //one ticket per addr
    mapping(uint256 => mapping(address => bool)) public bought;
    mapping(uint256 => string) tokenURIs; 
    mapping(uint256 => uint256) eventEscrow;
    mapping(uint256 => mapping(address => uint256)) credits;
    mapping(uint256 => uint256) votesForRefund;
    //event id -> amt in escrow
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
        uint256 price;
        string applicationLink;

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

    modifier onlyAttendee(uint256 id) {
        //event id --> buyer addr --> bool
        require(bought[id][msg.sender] == true, "you did not attend this event");
        _;
    }

    function createEvent(uint256 _supply, uint256 _eventDate, string memory newuri, uint256 _price,
        string memory _applicationLink) 
        public 
        onlyEventOwner(eventID)
    {
        eventID += 1;

        require(_eventDate < block.timestamp, "event must happen in the future");

        eventInfo[eventID] = Event({
            id: eventID,
            supply: _supply,
            eventDate: _eventDate,
            hasWhitelist: false,
            price: _price,
            applicationLink: _applicationLink
        });

        tokenURIs[eventID] = newuri;

        eventOwner[eventID] = msg.sender;  
    }

    function createEvent(uint256 _supply, uint256 _eventDate, address[] memory _buyers, 
        string memory tokenURI, uint256 _price, string memory _applicationLink) 
        public 
        onlyEventOwner(eventID)
    {
        eventID += 1;

        require(_eventDate < block.timestamp, "event must happen in the future");
        
        eventInfo[eventID] = Event({
            id: eventID,
            supply: _supply,
            eventDate: _eventDate,
            hasWhitelist: true,
            price: _price,
            applicationLink: _applicationLink
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
        payable
        onlyNewBuyer(id)
        eventNotPassed(id)
    {
        Event storage _event = eventInfo[id];
        if (_event.hasWhitelist){
            require(invited[id][msg.sender] == true, "you are not invited to this event");
        }   
        require(msg.value == _event.price, "incorrect price sent");

        eventEscrow[id] += msg.value;

        bought[id][msg.sender] == true; 

        buyers[id].push(msg.sender);

        credits[id][msg.sender] = _event.price;

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

    function getEventOwner(uint256 _id) public view returns (address){
        return eventOwner[_id];
    }

    function didUserBuy(uint256 _id, address user) public view returns (bool){
        return bought[_id][user];
    }

    function allowDepositPull(uint256 _eventId) public onlyOwner {

        Event storage _event = eventInfo[_eventId];

        address[] memory _buyers = buyers[_eventId];

        for(uint256 i; i < _buyers.length; i++){
            address buyer = _buyers[i];
            if(bought[_eventId][buyer] == true){
                credits[_eventId][buyer] = _event.price;
            }
        }
    }

    function withdrawDeposit(uint256 _eventId) public onlyAttendee(_eventId) {

        uint amount = credits[_eventId][msg.sender];

        require(amount > 0, "amount may not be zero or less");
        require(address(this).balance >= amount, "contract lacks funds");

        credits[_eventId][msg.sender] = 0;

        payable(msg.sender).transfer(amount);

        eventEscrow[_eventId] -= eventInfo[_eventId].price;
    }


    function payEventOwner(uint256 _eventId) public onlyOwner returns(bool){
        Event storage _event = eventInfo[_eventId];

        require(_event.eventDate + 7 days < block.timestamp, "damage claim period not over yet");


        uint256 val = eventEscrow[_eventId];
        address eventOrg = eventOwner[_eventId];
        (bool success, ) = eventOrg.call{value: val}("");
        require(success, "transaction failed");
        return true;
    }

    function voteOnComplaint(uint256 _eventId) public onlyAttendee(_eventId){
        votesForRefund[_eventId] += 1;
        uint256 percentage = (votesForRefund[_eventId]/buyers[_eventId].length)*100;
        if(percentage >= 90) {
            allowDepositPull(_eventId);
            _burn(msg.sender, _eventId, balanceOf(msg.sender, _eventId));
        }
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}