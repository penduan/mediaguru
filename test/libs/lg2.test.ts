/**
 * lg2 Module test.
 */

import { Lg2, LG2Event } from "src/libs/lg2";
import { Deps } from "src/api/common/deps";
import assert from "assert";

let lg2_: Lg2;

before(function(done){
  let deps = new Deps();
  lg2_ = new Lg2(deps);
  deps.awaitDeps().then(() => done());
});

describe("Lg2 module test", function() {  

  it("Instance test", () => {
    assert(typeof lg2_ !== "undefined");
    assert(typeof lg2_._Module.FS !== "undefined");
    assert(typeof lg2_._Module.callMain !== "undefined");
  });

  describe("Instance callback test", () => {
    
    it("emit()", (done) => {
      let end = true;
      lg2_.once(LG2Event.git_processor_end, () => {
        end = true;
        assert(end === true);
        done();
      });

      lg2_.emit(LG2Event.git_processor_end);
    });


    it("_Module.on**()", (done) => {
      let end = false;
      lg2_.once(LG2Event.git_processor_end, () => {
        end = true;
        assert(end === true);
        done();
      });

      // emit() wrapper.
      lg2_._Module.onGitProcessorEnd(LG2Event.git_processor_end);
    });

    it("waitCMD() -> rejected", (done) => {
      lg2_.waitCMD(["clone"]).catch(() => done());
    });

    it("waitCMD() -> fulfilled", function(done) {
      let end = false;
      this.timeout(5000);
      lg2_.once(LG2Event.git_processor_end, () => {
        end = true;
      });

      lg2_.waitCMD(["clone","https://github.com/penduan/gitcmd.git", "1"]).then(() => {
        assert(end === true);
        done();
      });
    });

  });

  describe("clone command test", () => {
    it("unshallow clone");
    it("shallow clone with depth 1");
    it("shallow clone with depth 10");
  });
})

