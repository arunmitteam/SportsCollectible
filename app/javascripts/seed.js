//Eutil = require('ethereumjs-util');
CollectibleStore = artifacts.require("./CollectibleStore.sol");
module.exports = function (callback) {
    current_time = Math.round(new Date() / 1000);
    //amt_1 = web3.toWei(1, 'ether');
    //var limit =10;
    //for(i=1;i<4;i++){
    // function dataSetup(i){
    //     if( i <= 20){
    //         CollectibleStore.deployed().then(function (coll) { coll.addCollectible('CollectibleStore Card' + i, i, web3.toWei(10,'ether'), { from: web3.eth.accounts[1] }).then(function (f) { console.log(f); dataSetup(i+1) 
    //         })
    //      });
    //     }
    // }
    // dataSetup(11);


        // for(var j=1; j<4; j++){
        //   //  console.log(i);
        //     cert_num++
        //     CollectibleStore.deployed().then(function (coll) { coll.addCollectibleStore('CollectibleStore Card' + j, cert_num, 10, { from: web3.eth.accounts[j] }).then(function (f) { console.log(f); }) });
        // }

    //}
   
    // Contract Balance
    web3.fromWei(web3.eth.getBalance("0xd975b0f73525432f39037da3a2c2b24159a55d1b"), 'ether').toString()

    // EcommerceStore.deployed().then(function (i) { i.addProductToStore('iphone 5s', 'Cell Phones & Accessories', 'QmStqeYPDCTbgKGUwns2nZixC5dBDactoCe1FB8htpmrt1', 'QmbLRFj5U6UGTy3o9Zt8jEnVDuAw2GKzvrrv3RED9wyGRk', current_time, current_time + 400, 3 * amt_1, 1).then(function (f) { console.log(f) }) });

    CollectibleStore.deployed().then(function (i) {i.addCollectible("2017 Topps Dynasty Roy Halladay Patch Auto", "NH 10-6-10", web3.toWei(10, 'ether'), "QmSXwU6KmvkcYjdFEKgDsh69UdvyUPLdo9eBdVzBfbzNC5", "Brand New Autographed",7, { from: web3.eth.accounts[1],gas: 440000 }).then(function (f) { console.log(f); })});

    CollectibleStore.deployed().then(function (i) { i.addCollectible("2017 Topps Dynasty Ichiro Game Used Patch Auto Gold # 5/5", "PS1234", web3.toWei(15, 'ether'), "Qme5hRZEq6RbSXaewC4Kiy48jcqQhwd74UyHMLfGFhqpS5", "Topps Manufactured. Brand New: An item that has never been opened or removed from the manufacturer’s sealing (if applicable).", 7, { from: web3.eth.accounts[1], gas: 440000 }).then(function (f) { console.log(f); }) });

    CollectibleStore.deployed().then(function (i) { i.addCollectible("2017 Topps Dynasty Aaron Judge Auto Game-Used Jersey Patch", "APAA3", web3.toWei(15, 'ether'), "QmUybt4FodQF22DxmNMkSiEoSc6FXKd8SYYFyntTumryf2", "2017 Topps Dynasty Auto Game-Used Jersey Patch", 8, { from: web3.eth.accounts[2], gas: 440000 }).then(function (f) { console.log(f); }) });

    // CollectibleStore.deployed().then(function (i) { i.addCollectible("2017 Topps Dynasty Mark McGwire", "PP12345", web3.toWei(15, 'ether'), "Qmbv6CfNLBtfkCapwuG9gkJ62yDwHhtgoqaWBxzBzGy1ak", "Topps - Single-Insert, Serial Numbered, Piece of Authentic, Autograph", 8, { from: web3.eth.accounts[2], gas: 440000 }).then(function (f) { console.log(f); }) });

    // CollectibleStore.deployed().then(function (i) { i.buyCollectible(1,{from:web3.eth.accounts[5], value:web3.toWei(10,'ether')}).then(function (f) { console.log(f) }) });
    //web3.fromWei(web3.eth.getBalance("0xb5297c79a74d0ea73d8042ee548704c673f45458").toString(), 'ether').toString()
    // CollectibleStore.deployed().then(function (i) { i.confirmCollRecv(0,{from:web3.eth.accounts[5]}).then(function (f) { console.log(f) }) });

    // CollectibleStore.deployed().then(function (i) { i.buyCollectible(1,{from:web3.eth.accounts[5], value:web3.toWei(10,'ether')}).then(function (f) { console.log(f) }) });
    //web3.fromWei(web3.eth.getBalance("0x5d95d7749c3c7c186326a2d9747fe912952e8338").toString(), 'ether').toString()
    // CollectibleStore.deployed().then(function (i) { i.notDelivered(1, { from: web3.eth.accounts[5] }).then(function (f) { console.log(f) }) });

   //  CollectibleStore.deployed().then(function (i) { i.setAvailableForSale(1, { from: web3.eth.accounts[5]}).then(function (f) { console.log(f) }) });
   
    // CollectibleStore.deployed().then(function (i) { i.getCollectibleOwners(1).then(function (f) { console.log(f) }) });
    // CollectibleStore.deployed().then(function (i) { i.getCollectible(1).then(function (f) { console.log(f) }) });
    // CollectibleStore.deployed().then(function (i) { i.CollectibleIndex.call().then(function (f) { console.log(f.toString()) }) });

}

