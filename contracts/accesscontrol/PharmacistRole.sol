pragma solidity >=0.4.21 <0.6.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'PharmacistRole' to manage this role - add, remove, check

contract PharmacistRole {

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing

  event PharmacistAdded(address pharmacist);
  event PharmacistRemoved(address pharmacist);

  // Define a struct 'pharmacists' by inheriting from 'Roles' library, struct Role
  Roles.Role private pharmacists;

  // In the constructor make the address that deploys this contract the 1st pharmacist

  constructor() public {
    _addPharmacist(msg.sender);

  }

  // Define a modifier that checks to see if msg.sender has the appropriate Role

  modifier onlyPharmacist() {
    require(isPharmacist(msg.sender),'Msg.sender is not a Pharmacist');
    _;
  }

  // Define a function 'isPharmacist' to check this Role
  function isPharmacist(address account) public view returns (bool) {
    return pharmacists.has(account);
  }

  // Define a function 'addPharmacist' that adds this Role
  function addPharmacist(address account) public onlyPharmacist {
    _addPharmacist(account);
  }

  // Define a function 'renouncePharmacist' to renounce this Role
  function renouncePharmacist() public {
    _removePharmacist(msg.sender);

  }

  // Define an internal function '_addPharmacist' to add this role, called by 'addPharmacist'
  function _addPharmacist(address account) internal {
    pharmacists.add(account);
    emit PharmacistAdded(account);

  }

  // Define an internal function '_removeConsumer' to remove this role, called by 'reomvePharmacist'
  function _removePharmacist(address account) internal {
    pharmacists.remove(account);
    emit PharmacistRemoved(account);
  }
}
