
export class Deps {
  static INTERVAL_MS = 300;
  _deps = new Set<Symbol | string | number>();

  addDeps(tag: any) {
    this._deps.add(tag);
  }

  removeDeps(tag: any) {
    this._deps.delete(tag);
  }

  awaitDeps(): Promise<number> {
    return new Promise((resolve, reject) => {
      let num = 0;
      let intervalId = setInterval(() => {
        num++;
        if (!this._deps.size) {
          clearInterval(intervalId);
          resolve(num * Deps.INTERVAL_MS);
        }
        if (num === 200) console.warn("waited 1m...");
        else if (num === 400) console.warn("waited 2m...");
        else if (num === 600) {
          console.warn("waited 3m...");
          reject();
        }
      }, Deps.INTERVAL_MS);
    })
  }
}