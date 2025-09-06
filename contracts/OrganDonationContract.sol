// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OrganDonationContract {
    address public owner;
    address[] public authorized;

    constructor(){
        owner=msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender==owner,"You are not the contract owner");
        _;
    }
    function addAuthorized(address _addr) public onlyOwner{
        // require(!isAuthorized(_addr), "Already authorized");
        authorized.push(_addr);
    }
    function removeAuthorized(address _addr) public onlyOwner{
        for(uint i=0;i<authorized.length;i++){
            if(authorized[i]==_addr){
                authorized[i]=authorized[authorized.length-1];
                authorized.pop();
                break;
            }
        }
    }
    function isAuthorized(address _addr) public view returns(bool){
        for(uint i=0;i<authorized.length;i++){
            if(authorized[i]==_addr){
                return true;
            }
        }
        if(owner==_addr) return true;
        return false;
    }
    modifier onlyAuthorized(){
        require(isAuthorized(msg.sender),"Not an authorized address");
        _;
    }
    function getAuthorized() public view returns(address[] memory){
        return authorized;
    }
    uint private CurrentAvailableDonorID=0;
    uint private CurrentAvailableRecipientID=0;
    uint private CurrentAvailableTransplantedID=0;

    mapping(string => string) private donorCIDs;
    mapping(string => string) private recipientCIDs;
    
    string[] private donorIDs;
    string[] private recipientIDs;

    //struct to store Transplanted records
    struct TransplantedRecord {
        string recordId;
        string donorId;
        string recipientId;
        string organ;
        uint matchDate;
        string status;
    }

    TransplantedRecord[] private TransplantedRecords;
    
    //events to log activities
    event DonorRegistered(address indexed sender,string indexed donorId);
    event RecipientRegistered(address indexed sender,string indexed recipientId);
    event Transplanted(address indexed sender,string indexed recordId,string donorId,string recipientId,string organ,uint matchDate);
    
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
        emit DonorRegistered(msg.sender,donorId);
    }

    function getDonorIDs() public view returns(string[] memory){
        return donorIDs;
    }

    function getDonorCID(string memory _donorId) public view returns(string memory){
        return donorCIDs[_donorId];
    }

    function removeDonor(string memory _donorId) public{
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
        emit RecipientRegistered(msg.sender,recipientId);
    }

    function getRecipientIDs() public view returns(string[] memory){
        return recipientIDs;
    }

    function getRecipientCID(string memory _recipientId) public view returns(string memory){
        return recipientCIDs[_recipientId];
    }

    function removeRecipient(string memory _recipientId) public{
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

    function createTransplant(string memory _recordId,string memory _donorId,string memory _recipientId,string memory _organ,uint _matchDate,string memory _status,string memory newDonorCID) public onlyAuthorized{
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
        removeRecipient(_recipientId);
        registerDonor(_donorId,newDonorCID);
        emit Transplanted(msg.sender,_recordId,_donorId,_recipientId,_organ,_matchDate);
    }
    
    function getTransplantedRecords() public view returns(TransplantedRecord[] memory) {
        return TransplantedRecords;
    }
    
    function getMessage() public pure returns(string memory){
        return "Blockchain Connected successfully!";
    }

}
