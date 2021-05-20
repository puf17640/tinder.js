export default class FacebookInfo {
  connectionCount: number

  commonConnections: any[]

  commonInterests: any[]

  constructor(facebook: { connection_count: number; common_connections: any; common_interests: any }) {
    this.connectionCount = facebook.connection_count
    this.commonConnections = facebook.common_connections
    this.commonInterests = facebook.common_interests
  }
}
