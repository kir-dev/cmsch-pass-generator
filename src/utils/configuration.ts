import * as dotenv from 'dotenv'
import * as env from 'env-var'

dotenv.config()

export const BACKEND_PORT = env.get('BACKEND_PORT').required().asPortNumber()
export const PASS_TYPE_IDENTIFIER = env.get('PASS_TYPE_IDENTIFIER').required().asString()
export const ORG_NAME = env.get('ORG_NAME').required().asString()
export const TEAM_ID = env.get('TEAM_ID').required().asString()
export const ISSUER_ID = env.get('ISSUER_ID').required().asString()
export const PASSPHRASE = env.get('PASSPHRASE').required().asString()
export const SERVER_BASE_URL = env.get('SERVER_BASE_URL').required().asString()
