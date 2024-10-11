export const cacheGroupChunkName = (module, chunks, cacheGroupKey) => {
  const moduleFileName = module
    .identifier()
    .split('/')
    .reduceRight((item) => item)

  const allChunksNames = chunks.map((item) => item.name).join('~')

  return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
}
