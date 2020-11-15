import * as CryptoJS from "crypto-js";
// calculateBlockHash의 기본 구조는 이렇습니다.
class Block {
    static calculateBlockHash = (
        index: number,
        previousHash: string,
        timestamp: number,
        data: string
    ): string =>
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
// index,hash,string,previousHash,data 순으로 검증에 대한 구조를 정하고
    static validateStructure = (aBlock: Block): boolean =>
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

//구조에 대해서 알려진 순서대로 정의를 constructor에서 보게 됩니다.
    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number,
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

// 처음의 블록을 이렇게 정합니다.
const genesisBlock: Block = new Block(0, "20201120", "", "blockchain", 201721826);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

// 최근 블록에 대해서
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
// 새로운 시간 스탬프
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);
// 새로운 블록 체인
const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getNewTimeStamp();
    const nextHash: string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        nextTimestamp,
        data
    );
    const newBlock: Block = new Block(
        newIndex,
        nextHash,
        previousBlock.hash,
        data,
        nextTimestamp,
    );
    addBlock(newBlock);
    return newBlock;
};
// 블록체인에 블록을 더함으로써 블로그체인의 해시부분이 이전 해시와 일치 하다는 것을 알 수 있습니다.
const getHashforBlock = (aBlock: Block): string =>
    Block.calculateBlockHash(
        aBlock.index,
        aBlock.previousHash,
        aBlock.timestamp,
        aBlock.data
    );
// 검증 과정 입니다. 만약 일치 하지 않는다면 index에 더하면서 조건문의 해결해 갑니다.
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};

const addBlock = (candidateBlock: Block): void => {
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