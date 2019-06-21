pragma solidity >=0.4.21 <0.6.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufacturerRole' to manage this role - add, remove, checks

contract ManufacturerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event ManufacturerAdded(address manufacturer);
  event ManufacturerRemoved(address manufacturer);

  // Define a struct 'manufacturers' by inherting from 'Roles' library, struct Role
  Roles.Role private manufacturers;

  // In the constructor make the address that deploys this contract the 1st manufacturer
  constructor() public {
    _addManufacturer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate Role
  modifier onlyManufacturer() {
    require(isManufacturer(msg.sender),'Msg.sender must be Manufacturer');
    _;
  }

  //Define a function 'isManufacturer' to check this Role
  function isManufacturer(address account) public view returns(bool) {
    return manufacturers.has(account);
  }

  //Define a function 'addManufacturer' that adds this role
  function addManufacturer(address account) public onlyManufacturer {
    _addManufacturer(account);
  }

  //Define a function 'renounceManufacturer' to renounce this Role
  function renounceManufacturer() public {
    _removeManufacturer(msg.sender);
  }

  //Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
  function _addManufacturer(address account) internal {
    manufacturers.add(account);
    emit ManufacturerAdded(account);
  }

  //Define an internal function '_removeManufacturer' to add this role, called by 'removeManufacturer'
  function _removeManufacturer(address account) internal {
    manufacturers.remove(account);
    emit ManufacturerRemoved(account);
  }
}
