pragma solidity ^0.5.4;

contract SeminarContract {

    string public text;

    function appendText(string calldata message) external returns (bool){
        text = string(abi.encodePacked(text, message));
        return true;
    }
}