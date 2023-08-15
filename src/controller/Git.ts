import { Deps } from "src/api/common/deps";
import { Lg2, LG2Event } from "src/libs/lg2";


export type CMDCloneType = [string, number]; 

export class GitController extends Lg2 {

  workDir = "/data";

  /** 关闭页面/窗口时的一些动作 */
  closeActions: Function[] = [];

  constructor(dep?: Deps) {
    super(dep);

    if (dep) {
      dep.awaitDeps().then(() => {
        this.mountFS();
      })
    }
  }

  setUser(name: string, email: string) {
    this._Module.FS.writeFile(
      "/home/web_user/.gitconfig",
`
[user]
name = ${name}
email = ${email}
`
    );
  }

  chRootDir() {
    this._Module.FS.chdir(this.workDir);
  }

  mountFS() {
    if (process.env.WECHAT) {
      this._mountNODEFS();
    } else {
      this._mountIDBFS();
    }

    this.chRootDir();
  }

  private _mountNODEFS() {
    const FS = this._Module.FS;      
    const NODEFS = FS.filesystems.NODEFS;

    FS.mkdir(this.workDir);
    FS.mount(NODEFS, { root: "."}, this.workDir);
  }

  private _mountIDBFS() {
    const FS = this._Module.FS;
    const IDBFS = FS.filesystems.IDBFS;

    FS.mkdir(this.workDir);
    FS.mount(IDBFS, { root: "." }, this.workDir);

    FS.syncfs(true, (err: string) => {
      if (err) throw new Error(err);
    });

    this.closeActions.push(() => {
      FS.syncfs(false, (err: string) => {
        if (err) throw new Error(err);
      });
    });
  }

  clone(url: string, depth = 0) {
    const argv = ["clone", url];
    if (depth) {
      argv.push(depth.toString());
    }
   
    return this.waitCMD(argv);
  }

  /** 
   * 通过 监听`Lg2Event.log_get` 获取单个log数据
   */
  log(skip: number = 0, limit: number = 0) {
    const argv: any[] = ["log"];
    
    if (skip) {
      argv.push("--skip="+skip);
      argv.push(limit);
    }
  
    return this.waitCMD(argv);
  }

  /**
   * 通过 监听`Lg2Event.status_get` 获取单个文件的status数据
   */
  status(files?: string[]) {
    const argv: any[] = ["status"];
    
    if (files) {
     argv.push(...files);
    }
 
    return this.waitCMD(argv);
  }

  init(dir: string = ".") {
    const argv = ["init", dir];
    return this.waitCMD(argv);
  }

}