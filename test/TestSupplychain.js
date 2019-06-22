// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const truffleAssert = require("truffle-assertions");
var SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", function(accounts) {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  var sku = 1;
  var ndc = "NDC 0608-0910-16";
  const ownerID = accounts[0];
  const manufacturerID = accounts[1];
  const productID = "0608-09-b6e4a58d";
  const productDescription = "Atorvastatin Calcium";
  const productFormName = "Tablet";
  const productLabelerName = "Dr.Reddys";

  var itemState = 1;
  const distributorID = accounts[2];
  const pharmacistID = accounts[3];
  const emptyAddress = "0x00000000000000000000000000000000000000";

  console.log("ganache-cli accounts used here...");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Manufacturer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Pharmacist: accounts[3] ", accounts[3]);

  //Test - Default

  it("Test for adding the different roles - Role 1 - Manufacturer", async () => {
    const supplyChain = await SupplyChain.deployed();
    let addMfr = await supplyChain.addManufacturer(manufacturerID, {
      from: ownerID
    });

    const isMfrAdded = await supplyChain.isManufacturer(manufacturerID);

    truffleAssert.eventEmitted(addMfr, "ManufacturerAdded");
    assert.equal(isMfrAdded, true);
  });

  it("Test for adding the different roles - Role 2 - Distributor", async () => {
    const supplyChain = await SupplyChain.deployed();
    let addDistr = await supplyChain.addDistributor(distributorID, {
      from: ownerID
    });

    const isDistrAdded = await supplyChain.isDistributor(distributorID);

    truffleAssert.eventEmitted(addDistr, "DistributorAdded");
    assert.equal(isDistrAdded, true);
  });

  it("Test for adding the different roles - Role 3 - Pharmacist", async () => {
    const supplyChain = await SupplyChain.deployed();
    let addPhar = await supplyChain.addPharmacist(pharmacistID, {
      from: ownerID
    });

    const isPharAdded = await supplyChain.isPharmacist(pharmacistID);

    truffleAssert.eventEmitted(addPhar, "PharmacistAdded");
    assert.equal(isPharAdded, true);
  });

  // 1st Test
  it("Testing smart contract function manufactureItem() that allows a manufacturer to manuacture the drug", async () => {
    const supplyChain = await SupplyChain.deployed();
    const manufacturerID = accounts[0];
    const ndc = "NDC 0608-0910-16";
    const productID = "0608-09-b6e4a58d";
    const productDescription = "Atorvastatin Calcium";
    const productFormName = "Tablet";
    const productLabelerName = "Dr.Reddys";
    const sku = 1;
    var eventEmitted = false;

    let tx = await supplyChain.manufactureItem(
      ndc,
      manufacturerID,
      productID,
      productDescription,
      productFormName,
      productLabelerName,
      { from: manufacturerID }
    );

    let event = tx.logs[0].event;
    assert.equal(event, "Manufactured", "Not Manufactured!!!");

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set
    assert.equal(resultBufferOne[0], 1, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], ndc, "Error: Invalid item NDC");
    assert.equal(
      resultBufferOne[2],
      ownerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      manufacturerID,
      "Error: Missing or Invalid manufacturerID"
    );
    assert.equal(
      resultBufferOne[4],
      productID,
      "Error: Missing or Invalid productID"
    );
    assert.equal(
      resultBufferOne[5],
      productDescription,
      "Error: Missing or Invalid productDescription"
    );
    assert.equal(
      resultBufferOne[6],
      productFormName,
      "Error: Missing or Invalid productFormName"
    );
    assert.equal(
      resultBufferOne[7],
      productLabelerName,
      "Error: Missing or Invalid productLabelerName"
    );

    assert.equal(resultBufferTwo[2], 1, "Error: Invalid item State");
  });

  // 2nd Test
  it("Testing smart contract function dispatchItemToDistr() that allows a manufacturer to dispatch item", async () => {
    const supplyChain = await SupplyChain.deployed();
    const manufacturerID = accounts[0];
    // Declare and Initialize a variable for event
    var mfrDispatchEvent = false;

    // Mark an item as MfrDispatched by calling function dispatchItemToDistr()
    let tx = await supplyChain.dispatchItemToDistr(ndc, {
      from: manufacturerID
    });

    let event = tx.logs[0].event;
    assert.equal(event, "MfrDispatched", "Not Dispatched from Manifacturer!!!");

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set

    assert.equal(resultBufferTwo[2], 2, "Error: Invalid item State");
  });

  // 3rd Test
  it("Testing smart contract function distReceiveItem() that allows a distributor to mark an item as received", async () => {
    const supplyChain = await SupplyChain.deployed();
    const distributorID = accounts[0];
    // Declare and Initialize a variable for event
    var distrReceiveEvent = false;

    // Mark an item as DistrReceived by calling function distrReceiveItem()
    let tx = await supplyChain.distrReceiveItem(ndc, { from: distributorID });

    let event = tx.logs[0].event;
    assert.equal(event, "DistrReceived", "Not Received by Distributor!!!");

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set

    assert.equal(resultBufferTwo[2], 3, "Error: Invalid item State");
  });

  // 4th Test
  it("Testing smart contract function dispatchItemToPharmacist() that allows a distributor to dispatch item to pharmacist", async () => {
    const supplyChain = await SupplyChain.deployed();
    const distributorID = accounts[0];

    // Declare and Initialize a variable for event
    var distrDispatchEvent = false;

    // Mark an item as DistrDispatched by calling function dispatchItemToPharmacist()
    let tx = await supplyChain.dispatchItemToPharmacist(ndc, {
      from: distributorID
    });

    let event = tx.logs[0].event;
    assert.equal(event, "DistrDispatched", "Not Dispatched by Distributor!!!");

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set

    assert.equal(resultBufferTwo[2], 4, "Error: Invalid item State");
  });

  // 5th Test
  it("Testing smart contract function pharReceiveItem() that allows a pharmacist to mark an item as received", async () => {
    const supplyChain = await SupplyChain.deployed();
    const pharmacistID = accounts[0];
    // Declare and Initialize a variable for event
    var pharReceiveEvent = false;

    // Mark an item as PharReceived by calling function pharReceiveItem()
    let tx = await supplyChain.pharReceiveItem(ndc, { from: pharmacistID });

    let event = tx.logs[0].event;
    assert.equal(event, "PharReceived", "Not received by Pharmacist!!!");

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set

    assert.equal(resultBufferTwo[2], 5, "Error: Invalid item State");
  });

  // 6th Test
  it("Testing smart contract function dispenseToConsumer() that allows a pharmacist to dispense item", async () => {
    const supplyChain = await SupplyChain.deployed();
    const pharmacistID = accounts[0];
    // Declare and Initialize a variable for event
    var pharDispenseEvent = false;

    // Mark an item as Sold by calling function buyItem()
    let tx = await supplyChain.dispenseToConsumer(ndc, { from: pharmacistID });

    let event = tx.logs[0].event;
    assert.equal(event, "Dispensed", "Not Dispensed to consumers!!!");

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set

    assert.equal(resultBufferTwo[2], 6, "Error: Invalid item State");
  });

  // 7th Test
  it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(ndc);

    // Verify the result set:

    assert.equal(resultBufferOne[0].toNumber(), sku, "Error: Invalid item SKU");

    assert.equal(resultBufferOne[1], ndc, "Error: Invalid item NDC");
    assert.equal(
      resultBufferOne[2],
      accounts[0],
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      accounts[0],
      "Error: Missing or Invalid manufacturerID"
    );
    assert.equal(
      resultBufferOne[4],
      productID,
      "Error: Missing or Invalid productID"
    );
    assert.equal(
      resultBufferOne[5],
      productDescription,
      "Error: Missing or Invalid productDescription"
    );
    assert.equal(
      resultBufferOne[6],
      productFormName,
      "Error: Missing or Invalid productFormName"
    );
    assert.equal(
      resultBufferOne[7],
      productLabelerName,
      "Error: Missing or Invalid productLabelerName"
    );
  });

  // 8th Test
  it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(ndc);

    // Verify the result set:
    assert.equal(resultBufferTwo[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferTwo[1], ndc, "Error: Invalid item NDC");

    assert.equal(resultBufferTwo[2], 6, "Error: Invalid item State");
    assert.equal(
      resultBufferTwo[3],
      accounts[0],
      "Error: Missing or Invalid distributerID"
    );
    assert.equal(
      resultBufferTwo[4],
      accounts[0],
      "Error: Missing or Invalid retailerID"
    );
  });
});
