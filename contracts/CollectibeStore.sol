pragma solidity ^0.4.13;

// Collectible contract that transfer ether between seller and buyer without escrow service
// Escrow implementation is handled within the contract. Contract will hold the escrow money until user confirms
// that the collectible has been received.
contract CollectibleStore {

    uint public collectibleIndex;
    // maintain the list of collectibles struct, certNum is the key. Enables us to 
    // pick a collectible based on a key value.
    mapping (uint => collectible) private collectibles;
   // uint[] private collIndex; // to maintain the number of records in mapping and also their keys.
  // collectible[] private collArray;

    enum collectibleStatus { Owned,Available, Sold }
  
    struct collectible {
        string name;    //0
        uint index;
        string certNum;   //1  
        uint price;     //2
        collectibleStatus status;  //3
        address ownerAddress;   //4 
        address buyerAddress;   //5
        bool isExists;          //6
        // maintains the history of all the owners
        address[] collOldOwners; //7
        string imageLink; //8
        string desc; //9
        string rating; //10
    }

    function () payable {
    }

    function CollectibleStore() public {
        collectibleIndex = 0;
    }
    // check if a collectible is already listed
    function isCollExists (uint index) public view returns (bool isExists) {

        if (collectibleIndex == 0) 
            return false;
        return collectibles[index].isExists;
    }

    // Seller can list an item in BC to claim onwership or to put it on sale
    function addCollectible (string _name, string _certNum, uint _price, string _img, string _desc, string _rating) public returns (bool success) {
        if (isCollExists(collectibleIndex)) 
            revert();
        collectibles[collectibleIndex].index = collectibleIndex;
        collectibles[collectibleIndex].name = _name;
        collectibles[collectibleIndex].certNum = _certNum;
        collectibles[collectibleIndex].price = _price;
        collectibles[collectibleIndex].status = collectibleStatus.Owned;
        collectibles[collectibleIndex].ownerAddress = msg.sender;
        collectibles[collectibleIndex].isExists = true;
        collectibles[collectibleIndex].imageLink = _img;
        collectibles[collectibleIndex].desc = _desc;
        collectibles[collectibleIndex].rating = _rating;

       // collArray.push(collectibles[_certNum]);
        collectibleIndex++;

        return true;        
    }

    // function getArrayCount() public constant returns(uint entityCount) {
    //  return collArray.length;
    // }

    // gives full history and other attributes of the collectible
    function getCollectible(uint collIndex) view public returns (string desc, string certNum, string rating , collectibleStatus status, address ownerAddress, address buyerAddress, address[] collOldOwners) {
        if (isCollExists(collIndex)) {
            return(
                collectibles[collIndex].desc,
                collectibles[collIndex].certNum,
                collectibles[collIndex].rating,
                collectibles[collIndex].status,
                collectibles[collIndex].ownerAddress, 
                collectibles[collIndex].buyerAddress,
                collectibles[collIndex].collOldOwners   
             //   collectibles[_certNum].desc,
               // collectibles[_certNum].rating
              );
        }
        else
            revert();
        
    }
    // getCollectible has to be split up into different functions
     function getCollectible2(uint collIndex) view public returns (string img, string certNum, string name, uint price,address ownerAddress, address buyerAddress, uint index) {
        if (isCollExists(collIndex)) {
            return(collectibles[collIndex].imageLink,            
                collectibles[collIndex].certNum,            
                collectibles[collIndex].name,
                collectibles[collIndex].price,
                collectibles[collIndex].ownerAddress, 
                collectibles[collIndex].buyerAddress,
                collectibles[collIndex].index                
              );
        }
        else
            revert();
        
    }
    // update the owner of a collectible - duplicate of buy Collectible
    /* function updateCollOwner (uint _certNum, address newOwner, uint price) payable public returns (bool success) {

        if (isCollExists(_certNum)) {

            newOwner.transfer(price);
            collectibles[_certNum].status = "sold"; 
            collectibles[_certNum].buyerAddress = newOwner;           
            return true;
        }
        else
            revert();
    }*/

    // update the owner of a collectible and transfer the ether to seller
    // escrow is achieved by maintiaining the funds within the contract until buyer confirms
    function buyCollectible (uint index) payable returns (bool success) {
        //updateCollOwner(_certNum, msg.sender,msg.value);

        if (isCollExists(index)) {

            // add validation price and value check
            // add validation is the asset is already in escrow
            //collectibles[_certNum].ownerAddress.transfer(msg.value);
            collectibles[index].status = collectibleStatus.Sold; 
            collectibles[index].buyerAddress = msg.sender;           
            return true;
        }
        else
            revert();

        return true;
    }

    //validate collectible has been received by the buyer, contract will release the funds to the seller
    function confirmCollRecv (uint index) public returns (bool) {

         if (isCollExists(index)) {
             // if 1 ether unit is not mentioned, default type of Wei is used.
            collectibles[index].ownerAddress.transfer(collectibles[index].price);
             collectibles[index].status = collectibleStatus.Owned;
             collectibles[index].collOldOwners.push(collectibles[index].ownerAddress);
             collectibles[index].ownerAddress = collectibles[index].buyerAddress;
             collectibles[index].buyerAddress = address(0);
             return true;
         }
         else
            revert();
        return false;
    }

    // return ether back to buyer if collectible not received
    // Contract will release the fund back to the buyer if collectible is not delievered to buyer
    function notDelivered (uint index) public returns (bool) {
         if (isCollExists(index)) {
             collectibles[index].buyerAddress.transfer(collectibles[index].price);
             collectibles[index].status = collectibleStatus.Owned;
             collectibles[index].buyerAddress = address(0);
             return true;
         }
         else
            revert();
        return false;
    }

     // Contract will release the fund back to the buyer if collectible is not delievered to buyer
    function setAvailableForSale (uint index) public returns (bool) {
         if (isCollExists(index)) {            
             collectibles[index].status = collectibleStatus.Available;            
             return true;
         }
         else
            revert();
        return false;
    }

    // get count of all the historical owners
    function getCollectibleOwnersCount (uint index) view public returns (uint) {
         if (isCollExists(index)) {
             return collectibles[index].collOldOwners.length;
         }
         else
            revert();
    }

    // get addresses of all the historical owners
    function getCollectibleOwners (uint index) view public returns (address[]) {
         if (isCollExists(index)) {
             return collectibles[index].collOldOwners;
         }
         else
            revert();
    }

    // get collectible owners 
    function getCollectiblesCount() public constant returns (uint count) {
        return collectibleIndex;
    }

}