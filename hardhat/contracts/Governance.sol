//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTicket1155.sol";

contract Governance is Ownable{
    NFTicket1155 nfticket;

    constructor(address _nfticket){
        nfticket = NFTicket1155(_nfticket);
    }
    
    mapping(uint256 => mapping(address => bool)) hasVoted;
    //proposal id -> user addr -> has voted?
    mapping(uint256 => uint256) proposalToEvent;
    //proposal id -> event id
    mapping(uint256 => uint256[]) eventToProposal;
    mapping(uint256 => uint256) numProposals;
    //eventId --> num proposals for that event
    mapping(uint256 => Proposal) proposalInfo;
    uint256 proposalID;

    struct Proposal {
        uint256 id;
        string proposing;
        string[] options;
        uint256 voteDelay;
        uint256 creationTime;
        uint256[] votes;
    }

    function setNFT(address _nfticket) public onlyOwner{
        nfticket = NFTicket1155(_nfticket);
    }

    function submitProposal(uint256 _eventId, string memory _proposing, uint256 _voteDelay, string[] memory _options) public {

        require(nfticket.getEventOwner(_eventId) == msg.sender, "caller is not the event owner");

        uint256[] memory _votes = new uint256[](_options.length);
        proposalInfo[proposalID].id = _eventId;
        proposalInfo[proposalID].proposing = _proposing;
        proposalInfo[proposalID].options= _options;
        proposalInfo[proposalID].voteDelay = _voteDelay;
        proposalInfo[proposalID].creationTime = block.timestamp;
        proposalInfo[proposalID].votes = _votes;
        
        proposalToEvent[proposalID] = _eventId;
        eventToProposal[_eventId].push(proposalInfo[proposalID].id);
        numProposals[_eventId]++;
    }

    function vote(uint256 _proposalId, string memory _option) public {
        
        uint256 _event = proposalToEvent[_proposalId];
        uint256 _creationTime = proposalInfo[_proposalId].creationTime;
        uint256 _voteDelay = proposalInfo[_proposalId].voteDelay;
        require(_voteDelay + _creationTime > block.timestamp, "voting period closed");
        console.log(_voteDelay + _creationTime);
        console.log(block.timestamp);
        require(hasVoted[_proposalId][msg.sender] == false, "you have already voted");
        require(nfticket.didUserBuy(_event, msg.sender) == true, "you don't have a ticket for this event");

        Proposal memory _proposal = proposalInfo[_proposalId];

        uint256 index; 
        for(uint256 i ; i < _proposal.options.length; i++){
            if(keccak256(abi.encodePacked(_proposal.options[i])) == keccak256(abi.encodePacked(_option))){
                index = i;
            }
        }

        _proposal.votes[index] += 1;

        hasVoted[_proposalId][msg.sender] = true;
 
    }

    function getVoteWinner(uint256 _proposalId) public view returns(string memory){
        uint256 votes;
        string memory chosenOption;

        Proposal storage _proposal = proposalInfo[_proposalId];
        
        uint256 _creationTime = proposalInfo[_proposalId].creationTime;
        uint256 _voteDelay = proposalInfo[_proposalId].voteDelay;
        require(_voteDelay + _creationTime < block.timestamp, "voting period still open");

        string[] memory props = _proposal.options;
        for(uint256 i; i < _proposal.votes.length; i ++){
            if(_proposal.votes[i] > votes){
                votes = _proposal.votes[i];
                chosenOption = _proposal.options[i];
            }
        }
        return chosenOption;
    }

    function getProposals(uint256 _eventId) public view returns(Proposal[] memory){
        Proposal[] memory _proposals = new Proposal[](eventToProposal[_eventId].length);
        
        for(uint256 i; i < eventToProposal[_eventId].length; i++){
            Proposal memory _proposal = proposalInfo[eventToProposal[_eventId][i]];
            _proposals[i] = _proposal;
        }
        return _proposals;
    }
}