import NodeCache from "node-cache"

const aqiCache = new NodeCache({stdTTL:600})

export default aqiCache