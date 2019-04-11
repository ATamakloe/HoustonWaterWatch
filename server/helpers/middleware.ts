import * as mcache from 'memory-cache';

export function cache(duration: number = 10) {
  return (req: any, res: any, next: any) => {
    let key: string = `__express__${req.url}`
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      console.log(`${req.url} has been cached`)
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        console.log(`Caching ${req.url}`)
        mcache.put(key, body, duration * 1000 * 60);
        res.sendResponse(body)
      }
      next()
    }
  }
}
