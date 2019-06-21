App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    /// Setup access to blockchain
    return await App.initWeb3();
  },

  readForm: function() {
    App.sku = $("#sku").val();
    App.ndc = $("#ndc").val();
    App.ownerID = $("#ownerID").val();
    App.manufacturerID = $("#manufacturerID").val();
    App.productID = $("#productID").val();
    App.productDescription = $("#productDescription").val();
    App.productFormName = $("#productFormName").val();
    App.productLabelerName = $("#productLabelerName").val();
    App.distributorID = $("#distributorID").val();
    App.pharmacistID = $("#pharmacistID").val();

    console.log(
      App.sku,
      App.ndc,
      App.ownerID,
      App.manufacturerID,
      App.productID,
      App.productDescription,
      App.productFormName,
      App.productLabelerName,
      App.distributorID,
      App.pharmacistID
    );
  },

  initWeb3: async function() {
    /// Find or Inject Web3 Provider
    /// Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:8545"
      );
    }

    App.getMetaskAccountID();

    return App.initSupplyChain();
  },

  getMetaskAccountID: function() {
    web3 = new Web3(App.web3Provider);

    // Retrieving accounts
    web3.eth.getAccounts(function(err, res) {
      if (err) {
        console.log("Error:", err);
        return;
      }
      console.log("getMetaskID:", res);
      App.metamaskAccountID = res[0];
    });
  },

  initSupplyChain: function() {
    /// Source the truffle compiled smart contracts
    var jsonSupplyChain = "../../build/contracts/SupplyChain.json";

    /// JSONfy the smart contracts
    $.getJSON(jsonSupplyChain, function(data) {
      console.log("data", data);
      var SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      App.fetchItemBufferOne();
      App.fetchItemBufferTwo();
      App.fetchEvents();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on("click", App.handleButtonClick);
  },

  handleButtonClick: async function(event) {
    event.preventDefault();

    App.getMetaskAccountID();

    var processId = parseInt($(event.target).data("id"));
    console.log("processId", processId);

    App.readForm();

    switch (processId) {
      case 1:
        console.log("Manufacturing");
        return await App.manufactureItem(event);
        break;
      case 2:
        console.log("Dispatching to Distributor");
        return await App.dispatchItemToDistr(event);
        break;
      case 3:
        console.log("Distributor Received");
        return await App.distrReceiveItem(event);
        break;
      case 4:
        console.log("Distributor dispatching to pharmacist");
        return await App.dispatchItemToPharmacist(event);
        break;
      case 5:
        console.log("Pharmacist received");
        return await App.pharReceiveItem(event);
        break;
      case 6:
        console.log("Dispensing to consumers");
        return await App.dispenseToConsumer(event);
        break;
      case 7:
        console.log("Fetching BUffer one");
        return await App.fetchItemBufferOne(event);
        break;
      case 8:
        console.log("Fetching BUffer Two");
        return await App.fetchItemBufferTwo(event);
        break;
    }
  },

  manufactureItem: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.manufactureItem(
          App.ndc,
          App.metamaskAccountID,
          App.productID,
          App.productDescription,
          App.productFormName,
          App.productLabelerName
        );
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("Manufacture Item", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  dispatchItemToDistr: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.dispatchItemToDistr(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("Dispatch Item to Distr", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  distrReceiveItem: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.distrReceiveItem(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("Distr Received Item", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  dispatchItemToPharmacist: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.dispatchItemToPharmacist(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("Item Dispatched to Pharmacist", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  pharReceiveItem: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.pharReceiveItem(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("Pharmacist Received the Item", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  dispenseToConsumer: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.dispenseToConsumer(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("Dispense to Consumers", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchItemBufferOne: function() {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
    App.ndc = $("#ndc").val();
    console.log("ndc", App.ndc);

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.fetchItemBufferOne(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferOne", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchItemBufferTwo: function() {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.fetchItemBufferTwo.call(App.ndc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferTwo", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchEvents: function() {
    if (
      typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function"
    ) {
      App.contracts.SupplyChain.currentProvider.sendAsync = function() {
        return App.contracts.SupplyChain.currentProvider.send.apply(
          App.contracts.SupplyChain.currentProvider,
          arguments
        );
      };
    }

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        var events = instance.allEvents(function(err, log) {
          if (!err)
            $("#ftc-events").append(
              "<li>" + log.event + " - " + log.transactionHash + "</li>"
            );
        });
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
