// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OrganDonationContract {
    // Struct for donor details
    struct Donor {
        string donorId;
        string name;
        uint8 age;
        string bloodType;
        string[] organsAvailable;
        string contactInfo;
        string status; // e.g., "alive", "deceased"
    }
    
    // Struct for recipient details
    struct Recipient {
        string recipientId;
        string name;
        uint8 age;
        string bloodType;
        string requiredOrgan;
        string urgency; // e.g., "high", "medium", "low"
        string contactInfo;
    }
    
    // Struct for matched records between donor and recipient
    struct MatchedRecord {
        string recordId;
        string donorId;
        string recipientId;
        string organ;
        uint matchDate; // Unix timestamp
        string status;  // e.g., "pending", "matched", "completed"
    }
    
    // Mappings for storing donors and recipients by their IDs
    mapping(string => Donor) private donors;
    mapping(string => Recipient) private recipients;

    uint private CurrentAvailableDonorID=0;
    uint private CurrentAvailableRecipientID=0;
    uint private CurrentAvailableMatchedID=0;

    mapping(string => string) private donorCIDs;
    mapping(string => string) private recipientCIDs;
    
    string[] private donorIDs;
    string[] private recipientIDs;

    // Array to store matched records
    MatchedRecord[] private matchedRecords;
    
    // Events to log activities
    event DonorRegistered(string donorId, string name);
    event RecipientRegistered(string recipientId, string name);
    event MatchCreated(string recordId, string donorId, string recipientId, string organ, uint matchDate);
    
    function getCurrentAvailableDonorID() public view returns(uint) {
        return CurrentAvailableDonorID;
    }

    function registerDonor(string memory donorId, string memory cid) public {
        bool exists = bytes(donorCIDs[donorId]).length > 0;
        donorCIDs[donorId] = cid;
        if (!exists) {
            donorIDs.push(donorId);
            CurrentAvailableDonorID++;
        }
    }

    function getDonorIDs() public view returns (string[] memory){
        return donorIDs;
    }

    function getDonorCID(string memory _donorId) public view returns (string memory) {
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

    function getCurrentAvailableRecipientID() public view returns(uint) {
        return CurrentAvailableRecipientID;
    }

    function registerRecipient(string memory recipientId,string memory cid) public {
        recipientCIDs[recipientId]=cid;
        recipientIDs.push(recipientId);
        CurrentAvailableRecipientID++;
    }

    function getRecipientIDs() public view returns (string[] memory){
        return recipientIDs;
    }

    function getRecipientCID(string memory _recipientId) public view returns (string memory) {
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

    function getCurrentAvailableMatchedID() public view returns(uint) {
        return CurrentAvailableMatchedID;
    }

    function createMatch(
        string memory _recordId,
        string memory _donorId,
        string memory _recipientId,
        string memory _organ,
        uint _matchDate,
        string memory _status
    ) public returns (bool) {
        MatchedRecord memory newRecord = MatchedRecord({
            recordId: _recordId,
            donorId: _donorId,
            recipientId: _recipientId,
            organ: _organ,
            matchDate: _matchDate,
            status: _status
        });
        
        matchedRecords.push(newRecord);
        emit MatchCreated(_recordId, _donorId, _recipientId, _organ, _matchDate);
        CurrentAvailableMatchedID++;
        return true;
    }
    
    function getMatchedRecords() public view returns (MatchedRecord[] memory) {
        return matchedRecords;
    }
    
    function getMessage() public pure returns (string memory) {
        return "Blockchain Connected successfully!";
    }

}
