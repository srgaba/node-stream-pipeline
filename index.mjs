import { pipeline, Readable, Transform } from 'stream'
import { createWriteStream } from 'fs'
import { promisify } from 'util'
const pipelineAsync = promisify(pipeline)

{
  const readableStream = Readable({
    read ( ) {
        for( let index = 0; index < 1e3; index++) {
            const person = { id: Date.now() + index, name: `Gaba-${index}`}
            const data = JSON.stringify(person)
            this.push(data)
        }
        this.push(null)
    }
  })

  const writableMap = Transform({
      transform(chunk, enconding, cb) {
          const data = JSON.parse(chunk)
          const result = `${data.id},${data.name.toUpperCase()}\n`
          cb(null, result)
      }
  })
  await pipelineAsync(
      readableStream,
      writableMap,
      createWriteStream('my.csv')
  )
  console.log('finished')
}