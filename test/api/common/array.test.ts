import { binaryInsert, binaryRemove, binarySearch, binarySlice, compareFnLikeCMemcmp } from "src/api/common/array";
import { expect } from "chai";

describe("Ordered array binary search & insert api test", () => {

  const defaultArr = [
    'Alpha',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Foxtrot',
    'Golf',
    'Hotel',
    'India',
    'Juliet',
    'Kilo',
    'Lima',
    'Mike',
    'November',
    'Oscar',
    'Papa',
    'Quebec',
    'Romeo',
    'Sierra',
    'Tango',
    'Uniform',
    'Victor',
    'Whiskey',
    'X-Ray',
    'Yankee',
    'Zulu'
  ];

  describe("binarySearch", () => {

    const arr = [...defaultArr];

    it("Searched", () => {
      expect(binarySearch("Charlie", arr)).to.eq(2);
      expect(binarySearch("Zulu", arr)).to.eq(25);
    });

    it("Not found", () => {
      expect(binarySearch("Chinese", arr)).to.eq(-4);
      expect(binarySearch("Zhongguo", arr)).to.eq(-26);
    });

  });

  describe("binaryInsert", () => {

    it("Insert", () => {
      const arr = [...defaultArr];

      const insertStr = "Chinese";
      let searchEndIndex = binarySearch(insertStr, arr);

      binaryInsert(insertStr, arr);
      expect(binarySearch(insertStr, arr)).to.eq(Math.abs(searchEndIndex) - 1);
    });

    it("Insert existed value", () => {
      const arr = [...defaultArr];
      const originLen = arr.length;
      const insertStr = "Zulu";

      binaryInsert(insertStr, arr);

      expect(arr.length).to.eq(originLen, "Should not exec insert action.");
    });
  });

  describe("binarySlice", () => {
    const arr = [...defaultArr];
    it("Slice(0,Charlie)", () => {
      let newArr = binarySlice("A", "Charlie", arr);
      expect(newArr.length).to.eq(3);
    });

    it("Slice(X-Ray,len)", () => {
      let newArr = binarySlice("X-Ray", "Z", arr);
      expect(newArr.length).to.eq(3);
    });

    it("Slice(Charlie, X-Ray)", () => {
      let newArr = binarySlice("Charlie", "X-Ray", arr);
      expect(newArr.length).to.eq(22);
    });
  });

  describe("binaryRemove", () => {
    it("Remove Charlie", () => {
      const arr = [...defaultArr];
      binaryRemove("Charlie", arr);

      expect(arr.length).to.eq(defaultArr.length - 1);
      binaryInsert("Charlie", arr);
      expect(arr.length).to.eq(defaultArr.length);
    })
  })

  describe("compareFnLikeCMemcmp", () => {
    const arr = [
      "message",
      "message_123123",
      "message_123123123",
      "message_end",
    ];

    it("Insert", () => {

      let newArr: string[] = [];
      arr.forEach((item) => {
        binaryInsert(item, newArr, compareFnLikeCMemcmp);
      });

      expect(newArr.length).to.eq(arr.length);
      newArr.forEach((item, index) => {
        expect(item).to.eq(arr[index]);  
      });
    });

    it("Insert#1", () => {
      let newArr: string[] = [];

      [1,3, 0, 2].forEach((index) => {
        binaryInsert(arr[index], newArr, compareFnLikeCMemcmp);
      });

      expect(newArr.length).to.eq(arr.length);
      newArr.forEach((item, index) => {
        expect(item).to.eq(arr[index]);
      });
    });

  });
});