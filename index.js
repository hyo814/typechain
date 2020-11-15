"use strict";
exports.__esModule = true;
var CryptoJS = require("crypto-js");
// calculateBlockHash의 기본 구조는 이렇습니다.
var Block = /** @class */ (function () {
    //구조에 대해서 알려진 순서대로 정의를 constructor에서 보게 됩니다.
    function Block(index, hash, previousHash, data, timestamp) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
    Block.calculateBlockHash = function (index, previousHash, timestamp, data) {
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    };
    // index,hash,string,previousHash,data 순으로 검증에 대한 구조를 정하고
    Block.validateStructure = function (aBlock) {
        return typeof aBlock.index === "number" &&
            typeof aBlock.hash === "string" &&
            typeof aBlock.previousHash === "string" &&
            typeof aBlock.timestamp === "number" &&
            typeof aBlock.data === "string";
    };
    return Block;
}());
// 처음의 블록을 이렇게 정합니다.
var genesisBlock = new Block(0, "20201120", "", "blockchain", 201721826);
var blockchain = [genesisBlock];
var getBlockchain = function () { return blockchain; };
// 최근 블록에 대해서
var getLatestBlock = function () { return blockchain[blockchain.length - 1]; };
// 새로운 시간 스탬프
var getNewTimeStamp = function () { return Math.round(new Date().getTime() / 1000); };
// 새로운 블록 체인
var createNewBlock = function (data) {
    var previousBlock = getLatestBlock();
    var newIndex = previousBlock.index + 1;
    var nextTimestamp = getNewTimeStamp();
    var nextHash = Block.calculateBlockHash(newIndex, previousBlock.hash, nextTimestamp, data);
    var newBlock = new Block(newIndex, nextHash, previousBlock.hash, data, nextTimestamp);
    addBlock(newBlock);
    return newBlock;
};
// 블록체인에 블록을 더함으로써 블로그체인의 해시부분이 이전 해시와 일치 하다는 것을 알 수 있습니다.
var getHashforBlock = function (aBlock) {
    return Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);
};
// 검증 과정 입니다. 만약 일치 하지 않는다면 index에 더하면서 조건문의 해결해 갑니다.
var isBlockValid = function (candidateBlock, previousBlock) {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    }
    else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    }
    else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    }
    else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }
    else {
        return true;
    }
};
var addBlock = function (candidateBlock) {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
};
// 직접 블록을 더해가면서 확인을 해보겠습니다.
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");
createNewBlock("fifth block");
console.log(blockchain);
