import "test/adapter";
import { LikeLevelDB } from "src/api/common/likeLevelDBStorage";
import { expect } from "chai";
import randomWords from "random-words";

describe("LikeLevelDB class", () => {

  it("LikeLevelDB.prototype.open", async () => {
    let db = new LikeLevelDB();

    let dbName = "/abcd";
    db.open(dbName);

    expect(db.count).to.eq(0);

    await db.put("abcd", "1");
    await db.put("bbcd", "2");
    await db.put("cbcd", "3");
    expect(db.count).to.eq(3);
    
    let db1 = new LikeLevelDB();
    await db.open(dbName);
  
    expect(db.count).to.eq(3); 
  });

  it("LikeLevelDB.prototype.put", async function () {
    let db = new LikeLevelDB();

    let dbName = "test-words";
    db.open(dbName);
    // let db
    // console.time("put.randomWords");
    let lists = randomWords(100000);
    let noSameSet = new Set(lists);
    // console.timeEnd("put.randomWords");

    // console.time("put.insertData");
    noSameSet.forEach((word) => {
      db.put(word, word);
    });
    // console.timeEnd("put.insertData");

    expect(db.count).to.eq(noSameSet.size);
  });

  describe("LikeLevelDB iterator test", async function() {
    let db = new LikeLevelDB();
    let dbName = "like-words";
    db.open(dbName);
    let data: string[];

    this.beforeAll(async () => {
      
      let lists = randomWords(1000).sort();
      let noSameSet = new Set(lists);
      data = new Array(...noSameSet);
      
      for (let word of data) {
        await db.put(word, word);
      }
    });


    it(".seekToFirstOrLast()", async function() {

      let iterator = db.createIterator();
      db.seekToFirstOrLast(iterator);

      let count = 1;
      while(await db.prev(iterator)) {
        count--;
      }

      expect(count).to.eq(0);
      expect(iterator.pointer).to.eq(-1);

      count = 1;
      db.seekToFirstOrLast(iterator, false);
      while(await db.next(iterator)) {
        count--;
      }

      expect(count).to.eq(0);
      expect(iterator.pointer).to.eq(data.length);


    });

    it(".seek()", async function() {
      let key1 = data[2];
      let key2 = data[data.length - 3];
      let key3 = data[data.length >>> 1];

      let iterator = db.createIterator();
      db.seek(iterator, key1);
      expect(iterator.pointer).to.eq(2);

      db.seek(iterator, key2);
      expect(iterator.pointer).to.eq(data.length - 3);

      db.seek(iterator, key3);
      expect(iterator.pointer).to.eq(data.length >>> 1);
      
    });

    it(".setIteratorLimit()", async function() {
      let key1 = data[2];
      let key2 = data[5];

      let iterator = db.createIterator();
      db.seekToFirstOrLast(iterator);
      db.setIteratorLimit(iterator, key1);

      let count = 0;
      while(await db.next(iterator)) {
        count++;
      }

      expect(count).to.eq(3);
      db.seek(iterator, key2);
      db.setIteratorLimit(iterator, key1);
      
      count = 0;
      while(await db.prev(iterator)) {
        count++;
      }

      expect(count).to.eq(4);

    });
  })
});