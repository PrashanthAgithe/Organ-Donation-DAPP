// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

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
    
    // Array to store matched records
    MatchedRecord[] private matchedRecords;
    
    // Events to log activities
    event DonorRegistered(string donorId, string name);
    event RecipientRegistered(string recipientId, string name);
    event MatchCreated(string recordId, string donorId, string recipientId, string organ, uint matchDate);
    
    function registerDonor(
        string memory _donorId,
        string memory _name,
        uint8 _age,
        string memory _bloodType,
        string[] memory _organsAvailable,
        string memory _contactInfo,
        string memory _status
    ) public returns (bool) {
        // In production, you may want to check if the donor already exists.
        donors[_donorId] = Donor({
            donorId: _donorId,
            name: _name,
            age: _age,
            bloodType: _bloodType,
            organsAvailable: _organsAvailable,
            contactInfo: _contactInfo,
            status: _status
        });
        
        emit DonorRegistered(_donorId, _name);
        return true;
    }
    
    function registerRecipient(
        string memory _recipientId,
        string memory _name,
        uint8 _age,
        string memory _bloodType,
        string memory _requiredOrgan,
        string memory _urgency,
        string memory _contactInfo
    ) public returns (bool) {
        recipients[_recipientId] = Recipient({
            recipientId: _recipientId,
            name: _name,
            age: _age,
            bloodType: _bloodType,
            requiredOrgan: _requiredOrgan,
            urgency: _urgency,
            contactInfo: _contactInfo
        });
        
        emit RecipientRegistered(_recipientId, _name);
        return true;
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
        return true;
    }
    
    function getDonor(string memory _donorId) public view returns (Donor memory) {
        return donors[_donorId];
    }
    
    function getRecipient(string memory _recipientId) public view returns (Recipient memory) {
        return recipients[_recipientId];
    }
    function matchedRecordsCount() public view returns (uint) {
        return matchedRecords.length;
    }
    
    function getMatchedRecords() public view returns (MatchedRecord[] memory) {
        return matchedRecords;
    }

    function getMessage() public pure returns (string memory) {
        return "Blockchain Connected successfully!";
    }
}
