import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import axios from 'axios'
import { NextFunction } from 'express'

import { NODE_ENV, PLAUSIBLE_DOMAIN, PLAUSIBLE_HOST } from '../utils/configuration'

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    this.sendAnalyticsEvent(req.url, req.referrer)
    next()
  }

  sendAnalyticsEvent(pathName: string, referrer: string | undefined) {
    if (NODE_ENV === 'development' || !PLAUSIBLE_DOMAIN || !PLAUSIBLE_HOST) return
    try {
      const urlSearchParams = new URLSearchParams(pathName)
      const platform = this.getPlatform(pathName)
      if (!platform || !urlSearchParams.get('userId')) return
      axios
        .post(
          PLAUSIBLE_HOST + '/api/event',
          {
            name: 'generate',
            domain: PLAUSIBLE_DOMAIN,
            url: 'https://' + PLAUSIBLE_DOMAIN + pathName,
            referrer,
            props: {
              platform,
            },
          },
          { headers: { 'User-Agent': `cmsch-pass-generator-${urlSearchParams.get('userId')}` } }
        )
        .then(() => Logger.debug(`Sent analytics event`, AnalyticsMiddleware.name))
    } catch (e) {
      Logger.error('Could not send analytics event: ' + e, AnalyticsMiddleware.name)
    }
  }

  getPlatform(path: string): 'Google' | 'Apple' | undefined {
    if (path.includes('apple')) return 'Apple'
    if (path.includes('google')) return 'Google'
    return
  }
}
