export const DEV = !!process.env.DEV;

let logManager = {
  ...console,
  error1: console.error
}

if (!DEV) {
  let cacheLogManager: Optional<typeof console> = {}
  let realtimeLogManager: Optional<typeof console> = {}
  if (process.env.WECHAT) {
    cacheLogManager = wx.getLogManager({});
    realtimeLogManager = wx.getRealtimeLogManager();
  } else { // web/extension

  }

  logManager =  {
    ...logManager,
    ...cacheLogManager
  }

  if (realtimeLogManager.info) {
    logManager.info = realtimeLogManager.info
  }

  if (realtimeLogManager.error) {
    logManager.error1 = realtimeLogManager.error
  }
}

export default logManager;