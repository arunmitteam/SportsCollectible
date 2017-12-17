// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import collectible_artifacts from '../../build/contracts/CollectibleStore.json'

// Collectible is our usable abstraction, which we'll use through the code below.
var Collectible = contract(collectible_artifacts);

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;
    var reader;

    // Bootstrap the Collectible abstraction for Use.
    Collectible.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      accounts = accs;
      account = accounts[0];
    
      var accountInterval = setInterval(function () {
        if (web3.eth.accounts[0] !== account) {
          account = web3.eth.accounts[0];
          window.location.reload();
        }
      }, 100);
    //  alert(account);
      // hardcoding account address and name
      let userName = '';
      if (web3.eth.accounts[0] == '0xb6bfbc4c52f234476c8a14aaba10eee2d1df90fd') userName = 'Alice';
      if (web3.eth.accounts[0] == '0x8053570a24c1963af3a1322a6f5ba0034b743aa8') userName = 'Bob';
      if (web3.eth.accounts[0] == '0x96cf6b56a0a8c175836551ccaa825d668d1326aa') userName = 'John';
      if (web3.eth.accounts[0] == '0x824ba9b7c6c8526c894baa0f3a6903683fb0b2c8') userName = 'James';
      if (web3.eth.accounts[0] == '0xced2752402e23e67010713557560a57c1bebfafe') {
        userName = 'Contract Owner';
      }
      $("#welMsg").append(userName);
      if (web3.eth.accounts[0] == '0xced2752402e23e67010713557560a57c1bebfafe') {
        getBalance("0xd975b0f73525432f39037da3a2c2b24159a55d1b");
      }else
        getBalance(web3.eth.accounts[0]);

    });

    // This if block should be with in the window.App = {} function
    if ($("#collectible-list").length > 0) {
      //alert('test');     
      renderCollectibleStore();
    }
    if ($("#mycollectible-list").length > 0) {
      //alert('test');
      renderMyCollectibles();
    }
    if ($("#collectible-details").length > 0) {
      //alert('test');
      let collId = new URLSearchParams(window.location.search).get('id');
      renderCollectibleDetails(collId);
    }

    $("#buy").submit(function (event) {
     // alert('hi');
      $("#msg").hide();
      let collId = $("#collId").val();
      let price = $("#collPrice").val();
      // alert(price);
      //alert(account);
     // alert(collId);
      Collectible.deployed().then(function (i) {
       // alert(parseInt(price));
        i.buyCollectible(parseInt(collId), { value: parseInt(price) + 1000000000000000000, from: account, gas: 440000 }).then(
          function (f) {
            $("#msg").html("<center><h3>You have successfully bought the collectible!</h3>");
            $("#msg").show();
            $("#buy").hide();
            $("#confirm").show();
            $("#not").show();
            console.log(f);
          }
        )
      });
      event.preventDefault();
    });
    $("#sell").submit(function (event) {
   //   alert('sell');
      $("#msg").hide();
      let collId = $("#collId").val();
    //  alert(collId);
      Collectible.deployed().then(function (i) {
        i.setAvailableForSale(parseInt(collId), { from: account, gas: 440000 }).then(
          function (f) {
            $("#msg").html("<center><h3>Collectible is now available for <strong>sale</strong> in BC!</h3>");
            $("#msg").show();
            $("#sell").hide();
            console.log(f);
          }
        )
      });
      event.preventDefault();
    });

    $("#confirm").submit(function (event) {
      //   alert('sell');
      $("#msg").hide();
      let collId = $("#collId").val();
      // alert(collId);
      Collectible.deployed().then(function (i) {
        i.confirmCollRecv(parseInt(collId), { from: account, gas: 440000 }).then(
          function (f) {
            $("#msg").html("<center><h3>Congrats on your new collectible, confirmed delivery to seller!</h3>");
            $("#msg").show();
            console.log(f);
            $("#confirm").hide();
            $("#not").hide();
          }
        )
      });
      event.preventDefault();
    });

    $("#not").submit(function (event) {
      //   alert('sell');
      $("#msgFail").hide();
      let collId = $("#collId").val();
      //  alert(collId);
      Collectible.deployed().then(function (i) {
        i.notDelivered(parseInt(collId), { from: account, gas: 440000 }).then(
          function (f) {
            $("#msgFail").html("<center><h3>Sorry about that, arbiter will reach out to seller!</h3>");
            $("#msgFail").show();
            $("#not").hide();
            $("#confirm").hide();
            console.log(f);
          }
        )
      });
      event.preventDefault();
    });

    $("#addCollectible").submit(function (event) {
      //   alert('sell');
      $("#msg").hide();
      const req = $("#addCollectible").serialize();
      let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      let decodedParams = {}
      Object.keys(params).forEach(function (v) {
        decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
      });
      saveProduct(reader, decodedParams);
      event.preventDefault();
    });

    $("#collectibleImg").change(function (event) {
      const file = event.target.files[0]
      reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
    });

  }
};

function getBalance(address) {
  return web3.eth.getBalance(address, function (error, result) {
    if (!error) {
      console.log(result.toNumber());
      // alert(result);
      $("#welMsg").append('                     (ETH balance: '+parseInt(web3.fromWei(result.toNumber(),'ether')).toString()+')');
    } else {
      console.error(error);
    }
  })
}

function saveProduct(reader, decodedParams) {
    let imageId;
    saveImageOnIpfs(reader).then(function (id) {
    imageId = id;
    console.log(imageId);
    saveProductToBlockchain(decodedParams, imageId);
  })
}

function saveProductToBlockchain(params, imageId) {
  console.log(params);

  Collectible.deployed().then(function (i) {
  //  alert(params["certNum"]);
  //  alert(imageId);

  //  alert(params[desc]);

    i.addCollectible(params["collectibleName"], params["certNum"], web3.toWei(params["price"], 'ether'),imageId,params["desc"],params["rating"], { from: account, gas: 440000 })
      .then(function (f) {
        console.log(f);
        $("#msg").show();
        $("#msg").html("<center><h3>Your collectible was successfully added to blockchain!</h3>");
      })
  });
}

function saveImageOnIpfs(reader) {
  return new Promise(function (resolve, reject) {
    const buffer = Buffer.from(reader.result);
    ipfs.add(buffer)
      .then((response) => {
        console.log(response)
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err)
        reject(err);
      })
  })
}

function renderCollectibleDetails(index) {
 // alert('In');
  $("#sell, #buy, #confirm, #not").hide();
  var count = 0;
  Collectible.deployed().then(function (i) {
   // alert(index);
    i.getCollectible.call(index).then(function (p) {
      console.log(p);
     
      $("#desc").append(p[0]);
      $("#certNum").append(p[1]);
      $("#rating").append(p[2]);
     // alert(p[2]);
      var buyer = (p[5] == 0) ? "-" : p[5];
      var owner;

      if (p[5] == '0xb6bfbc4c52f234476c8a14aaba10eee2d1df90fd') buyer = 'Alice';
      if (p[5] == '0x8053570a24c1963af3a1322a6f5ba0034b743aa8') buyer = 'Bob';
      if (p[5] == '0x96cf6b56a0a8c175836551ccaa825d668d1326aa') buyer = 'John';
      if (p[5] == '0x824ba9b7c6c8526c894baa0f3a6903683fb0b2c8') buyer = 'James';
      if (p[5] == '0xced2752402e23e67010713557560a57c1bebfafe') buyer = 'Contract Owner';

      if (p[4] == '0xb6bfbc4c52f234476c8a14aaba10eee2d1df90fd') owner = 'Alice';
      if (p[4] == '0x8053570a24c1963af3a1322a6f5ba0034b743aa8') owner = 'Bob';
      if (p[4] == '0x96cf6b56a0a8c175836551ccaa825d668d1326aa') owner = 'John';
      if (p[4] == '0x824ba9b7c6c8526c894baa0f3a6903683fb0b2c8') owner = 'James';
      if (p[4] == '0xced2752402e23e67010713557560a57c1bebfafe') owner = 'Contract Owner';

      $("#owner").append(owner);
     // var buyer = (p[5] == 0)?"-":p[5];
      $("#buyer").append(buyer);     
      var status;
      if (p[3] == 0) status ="Owned";
      if (p[3] == 1) status = "Available";
      if (p[3] == 2) status = "Sold";
   //   alert(p[3]);
      //alert(account);
     // alert(p[3]);
      // make it available for sale if it is owned and you are the owner
      if(account == p[4] && status == 'Owned')
        $("#sell").show();

      // other than owner must be able to buy
      if (account != p[4] && status == 'Available')
        $("#buy").show();
        
       // alert(p[4]);
      // buyer must be able to confirm the delivery
      if (account == p[5] && status == 'Sold')
        {
          $("#confirm").show();
          $("#not").show();
        }
     //   alert(p[6]);
      $("#status").append(status);
      var oldOwners = p[6];
      var oldOwner;
      if (null != oldOwners){
        for (var counter = oldOwners.length-1; counter >=0 ; counter--){
          oldOwner='';
          if (oldOwners[counter] == '0xb6bfbc4c52f234476c8a14aaba10eee2d1df90fd') oldOwner = 'Alice';
          if (oldOwners[counter] == '0x8053570a24c1963af3a1322a6f5ba0034b743aa8') oldOwner = 'Bob';
          if (oldOwners[counter] == '0x96cf6b56a0a8c175836551ccaa825d668d1326aa') oldOwner = 'John';
          if (oldOwners[counter] == '0x824ba9b7c6c8526c894baa0f3a6903683fb0b2c8') oldOwner = 'James';
          if (oldOwners[counter] == '0xced2752402e23e67010713557560a57c1bebfafe') oldOwner = 'Contract Owner';
          //alert(oldOwner);
          $("#prevOwners").append(oldOwner+"<br>");
        }
          
        console.log(p[3].toString());
      }
       
        })
  });
  Collectible.deployed().then(function (i) {
    i.getCollectible2.call(index).then(function (p) {
      console.log(p);
    //  alert(p[0]);
  //   $("#image").append("<img src='https://blogs-images.forbes.com/gordonkelly/files/2017/06/Screenshot-2017-06-26-at-00.52.40.png' width=100% />");

      $("#collId").val(p[6]);
     $("#image").append("<img src='https://ipfs.io/ipfs/" + p[0] + "' width=100% />");
      $("#name").html(p[2]);
      $("#price").append(displayPrice(p[3]).toString());
      $("#collPrice").val(p[3].toString());
    //  alert($("#collPrice").val());
    })
  });
    
  
  // Collectible.deployed().then(function (i) {
  //   var count = 0;
  //   i.collectibleIndex.call().then(function (f) {
  //     count = f.toString();
  //     //alert(count);
  //     for (var z = 1; z <= count; z++) {
  //       // alert(z);
  //       i.getCollectible.call(z).then(function (c) {
  //         if (account == c[4]) {
  //           $("#mycollectible-list").append(buildCollectible(c));
  //         }

  //       });
  //     }
  //   });
  // });
}

function displayPrice(amt) {
  return 'Ξ' + web3.fromWei(amt, 'ether');
}


function renderCollectibleStore() {
  //alert('In');
  var count = 0;

  Collectible.deployed().then(function (i) {
    var count = 0;
    i.collectibleIndex.call().then(function (f) {
      count = f.toString();
      // alert(count);
      for (var z = 0; z < count ; z++) {
        //alert(z);
       // if (z != 5 && z!=4 && z!=3){
        i.getCollectible2.call(z).then(function (c) {
          console.log(c);
          $("#collectible-list").append(buildCollectible(c,z));
        })
      //}
      }
    });
  });
}

function renderMyCollectibles() {
  //alert('In');
  var count = 0;

  Collectible.deployed().then(function (i) {
    var count = 0;
    i.collectibleIndex.call().then(function (f) {
      count = f.toString();
      // alert(count);
      for (var z = 0; z < count; z++) {
       // alert(z);
       // if (z != 5 && z != 4 && z != 3) {
        i.getCollectible2.call(z).then(function (c) {
          //  alert(c[5]);
          if (account == c[4] || account == c[5]) {
            console.log(c);
            $("#mycollectible-list").append(buildCollectible(c, z));
          }
        });
      //}
      }
    });
  });
}


function buildCollectible(collectible,z) {
 // alert("build "+z);
  let node = $("<div>");
  node.addClass("pull-left img-responsive col-sm-3 text-left col-margin-bottom-1");
  node.append("<a href='collectibleDetails.html?id=" + collectible[6] + "'><img class='top-padding' src='https://ipfs.io/ipfs/" + collectible[0] + "' width=100%/></a>");
 // node.append("<div><a href='product.html?id=" + product[0] + "'>" + product[1] + "</a></div>");
  node.append("<div class='coll-heading'>" + collectible[2] + "</div>");
  node.append("<div class='coll-sub'>" + displayPrice(collectible[3]) + "</div>");
  //node.append("<div class='col-sm-12' style='padding-left: 14%;'>" + collectible[1] + "</div>");
  node.append("</a></div>");
  return node;
}

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
  App.start();
});
