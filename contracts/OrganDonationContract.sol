// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OrganDonationContract {
    //struct to store Transplanted records
    struct TransplantedRecord {
        string recordId;
        string donorId;
        string recipientId;
        string organ;
        uint matchDate;
        string status;
    }

    uint private CurrentAvailableDonorID=0;
    uint private CurrentAvailableRecipientID=0;
    uint private CurrentAvailableTransplantedID=0;

    mapping(string => string) private donorCIDs;
    mapping(string => string) private recipientCIDs;
    
    string[] private donorIDs;
    string[] private recipientIDs;
    TransplantedRecord[] private TransplantedRecords;
    
    //events to log activities
    event DonorRegistered(string donorId);
    event RecipientRegistered(string recipientId);
    event Transplanted(string recordId, string donorId, string recipientId, string organ, uint matchDate);
    
    function getCurrentAvailableDonorID() public view returns(uint){
        return CurrentAvailableDonorID;
    }

    function registerDonor(string memory donorId, string memory cid) public {
        bool exists = bytes(donorCIDs[donorId]).length > 0;
        donorCIDs[donorId] = cid;
        if (!exists) {
            donorIDs.push(donorId);
            CurrentAvailableDonorID++;
        }
        emit DonorRegistered(donorId);
    }

    function getDonorIDs() public view returns (string[] memory){
        return donorIDs;
    }

    function getDonorCID(string memory _donorId) public view returns (string memory){
        return donorCIDs[_donorId];
    }

    function removeDonor(string memory _donorId) public {
        bool found=false;
        uint index;
        for(index=0;index<donorIDs.length;index++){
            if(keccak256(abi.encodePacked(donorIDs[index]))==keccak256(abi.encodePacked(_donorId))){
                found=true;
                break;
            }
        }
        require(found,"Donor ID not found");
        for(uint i=index;i<donorIDs.length-1;i++){
            donorIDs[i]=donorIDs[i+1];
        }
        donorIDs.pop();
    }

    function getCurrentAvailableRecipientID() public view returns(uint){
        return CurrentAvailableRecipientID;
    }

    function registerRecipient(string memory recipientId,string memory cid) public {
        recipientCIDs[recipientId]=cid;
        recipientIDs.push(recipientId);
        CurrentAvailableRecipientID++;
        emit RecipientRegistered(recipientId);
    }

    function getRecipientIDs() public view returns (string[] memory){
        return recipientIDs;
    }

    function getRecipientCID(string memory _recipientId) public view returns (string memory){
        return recipientCIDs[_recipientId];
    }

    function removeRecipient(string memory _recipientId) public {
        bool found=false;
        uint index;
        for(index=0;index<recipientIDs.length;index++){
            if(keccak256(abi.encodePacked(recipientIDs[index]))==keccak256(abi.encodePacked(_recipientId))){
                found=true;
                break;
            }
        }
        require(found,"Recipient ID not found");
        for(uint i=index;i<recipientIDs.length-1;i++){
            recipientIDs[i]=recipientIDs[i+1];
        }
        recipientIDs.pop();
    }

    function getCurrentAvailableTransplantedID() public view returns(uint){
        return CurrentAvailableTransplantedID;
    }

    function createTransplant(string memory _recordId,string memory _donorId,string memory _recipientId,string memory _organ,uint _matchDate,string memory _status) public{
        TransplantedRecord memory newRecord = TransplantedRecord({
            recordId: _recordId,
            donorId: _donorId,
            recipientId: _recipientId,
            organ: _organ,
            matchDate: _matchDate,
            status: _status
        });
        TransplantedRecords.push(newRecord);
        CurrentAvailableTransplantedID++;
        emit Transplanted(_recordId, _donorId, _recipientId, _organ, _matchDate);
    }
    
    function getTransplantedRecords() public view returns (TransplantedRecord[] memory) {
        return TransplantedRecords;
    }
    
    function getMessage() public pure returns (string memory){
        return "Blockchain Connected successfully!";
    }

}
