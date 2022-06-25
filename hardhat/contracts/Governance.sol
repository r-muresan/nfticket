//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTicket1155.sol";

contract Governance is Ownable{
    NFTicket1155 nfticket;

    constructor(address _nfticket){
        nfticket = NFTicket1155(_nfticket);
    }
    
    //mapping(uint256 => mapping(uint256 => Proposal)) proposalsByEvent; 
    //event id -> proposal id -> proposal
    mapping(uint256 => mapping(address => bool)) hasVoted;
    //proposal id -> user addr -> has voted?
    mapping(uint256 => uint256) proposalToEvent;
    //proposal id -> event id for checking voter eligibility
    //mapping(uint256 => Proposal) proposalById;
    //proposal id -> Proposal
    mapping(uint256 => Proposal) proposalInfo;
    uint256 proposalID;

    struct Proposal {
        uint256 id;
        string proposing;
        string[] options;
        uint256 voteDelay;
        uint256 creationTime;
        mapping(string => uint256) votes;
    }

    function submitProposal(uint256 _eventId, string memory _proposing, uint256 _voteDelay, string[] memory _options) public {

        require(nfticket.getEventOwner(_eventId) == msg.sender, "caller is not the event owner");

        proposalInfo[proposalID].id = _eventId;
        proposalInfo[proposalID].proposing = _proposing;
        proposalInfo[proposalID].options= _options;
        proposalInfo[proposalID].voteDelay = _voteDelay;
        proposalInfo[proposalID].creationTime = block.timestamp;
        for(uint256 i; i < _options.length; i++){
            proposalInfo[proposalID].votes[_options[i]] = 0;
        }
        
        proposalToEvent[proposalID] = _eventId;
    }

    function vote(uint256 _proposalId, string memory _option) public {
        uint256 _event = proposalToEvent[_proposalId];
        uint256 _creationTime = proposalInfo[_proposalId].creationTime;
        uint256 _voteDelay = proposalInfo[_proposalId].voteDelay;
        require(_voteDelay + _creationTime > block.timestamp, "voting period closed");
        require(hasVoted[_proposalId][msg.sender] = false, "you have already voted");
        require(nfticket.didUserBuy(_event, msg.sender) == true, "you don't have a ticket for this event");

        Proposal storage _proposal = proposalInfo[_proposalId];

        _proposal.votes[_option] += 1;

        hasVoted[_proposalId][msg.sender] = true;
    }

    function getVoteWinner(uint256 _proposalId) public returns(string memory){
        uint256 votes;
        string memory chosenOption;
        
        uint256 _creationTime = proposalInfo[_proposalId].creationTime;
        uint256 _voteDelay = proposalInfo[_proposalId].voteDelay;
        require(_voteDelay + _creationTime < block.timestamp, "voting period still open");

        string[] memory props = _proposal.options;
        for(uint256 i; i < _proposal.options.length; i ++){
            if(_proposal.votes[props[i]] > votes){
                votes = _proposal.votes[props[i]];
                chosenOption = _proposal.options[i];
            }
        }
        return chosenOption;
    }
}