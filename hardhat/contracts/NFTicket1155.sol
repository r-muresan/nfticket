// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFTicket1155 is ERC1155, Ownable, ERC1155Supply {
    mapping(uint256 => address) public eventOwner;
    mapping(uint256 => Event ) eventInfo;
    mapping(uint256 => address[]) buyers;
    //tells us all addrs that bought a ticket for that event
    mapping(uint256 => mapping(address => bool)) invited;
    mapping(uint256 => mapping(address => bytes32)) passwordHash;
    //eventid -> buyer ->password hash 
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
        string name; 
        string description;
        string image;
        string location;
        address host;
        uint256 eventDate;
        bool hasWhitelist;
        uint256 price;
        address[] whitelisted;
        string link;
    }

    modifier onlyNewBuyer(uint256 id){
        require(bought[id][msg.sender] == false, "caller already minted a ticket");
        _;
    }

    modifier onlyInvitedBuyer(uint256 id){
        require(invited[id][msg.sender] == true, "caller is not a buyer");
        _;
    }

    modifier onlyEventOwner(uint256 id){
        require(eventOwner[id] == msg.sender, "caller is not the event owner");
        _;
    }

    modifier eventNotPassed(uint256 id) {
        require(eventInfo[id].eventDate > block.timestamp, "event has passed");
        _;
    }

    modifier onlyAttendee(uint256 id) {
        //event id --> buyer addr --> bool
        require(bought[id][msg.sender] == true, "you did not attend this event");
        _;
    }

    function createEvent(uint256 _supply, string memory _name, string memory _description, string memory _image, 
        string memory _location, address _host, uint256 _eventDate, bool _hasWhitelist, string memory _tokenURI, 
        uint256 _price, string memory _link) 
        public 
    {
        require(_eventDate > block.timestamp, "event must happen in the future");

        address[] memory users;

        eventInfo[eventID] = Event({
            id: eventID,
            supply: _supply,
            name: _name, 
            description: _description, 
            image: _image,
            location: _location, 
            host:  _host, 
            eventDate: _eventDate,
            hasWhitelist: _hasWhitelist,
            price: _price,
            whitelisted: users,
            link: _link
        });

        tokenURIs[eventID] = _tokenURI;

        eventOwner[eventID] = msg.sender;  

        eventID += 1;
    }

    function setWhitelist(uint256 _eventId, address[] memory _whitelisted) public onlyEventOwner(_eventId){
        Event storage _event = eventInfo[_eventId];
        _event.whitelisted = _whitelisted;
    }

    function getURI(uint256 id) public view returns(string memory){
        return tokenURIs[id];
    }

    function mint(uint256 id, uint256 amount, bytes memory data)
        public
        payable
        onlyNewBuyer(id)
        eventNotPassed(id)
    {
        Event storage _event = eventInfo[id];

        require(totalSupply(id) <= _event.supply, "all tickets have been sold");

        if (_event.hasWhitelist){
            require(invited[id][msg.sender] == true, "you are not invited to this event");
        }   
        require(msg.value == _event.price, "incorrect price sent");

        eventEscrow[id] += msg.value;
        
        bought[id][msg.sender] = true;

        buyers[id].push(msg.sender);

        credits[id][msg.sender] = _event.price;

        _mint(msg.sender, id, amount, data);
    }

    function setPassword(uint256 _eventId, bytes32 _password) public onlyAttendee(_eventId) {
        passwordHash[_eventId][msg.sender] = _password;
    }

    function queryPassword(uint256 _id, address _user) public view onlyOwner returns(bytes32) {
        return passwordHash[_id][_user];
    }

    function claimTicket(uint _id, address _user) public onlyOwner {
        require(claimed[_id][_user] == false, "ticket already claimed");
        claimed[_id][_user] = true;
    }

    function getActiveEvents() public view returns (Event[] memory){
        uint256 count;
        for(uint256 i; i < eventID; i++){
            if (eventInfo[i].eventDate > block.timestamp){
                count++;
            }
        }

        Event[] memory activeEvents = new Event[](count);
        uint256 index;

        for(uint256 i; i < eventID; i++){
            if (eventInfo[i].eventDate > block.timestamp){
                activeEvents[index] = eventInfo[i];
                index++;
            }
        }
        return activeEvents;
    }

    function getEventsByUser(address _user) public view returns (Event[] memory){
        uint256 count;
        for(uint256 i; i < eventID; i++){
            if (balanceOf(_user, i) > 0){
                count++;
            }
        }

        Event[] memory activeEvents = new Event[](count);
        uint256 index;

        for(uint256 i; i < eventID; i++){
            if (balanceOf(_user, i) > 0){
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
            _burn(msg.sender, _eventId, balanceOf(msg.sender, _eventId));
        }
    }

    function getEvent(uint256 _eventId) public view returns(Event memory){
        Event storage _event = eventInfo[_eventId];
        return _event;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        for(uint256 i; i < ids.length; i++){
            Event storage _event = eventInfo[ids[i]];
            require(_event.eventDate > block.timestamp, "Cannot transfer after event started");
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}