pragma solidity ^0.5.4;

contract TestContract {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;

    uint public candidateCount;

    constructor () public {
        candidateCount = 0;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
    }
}