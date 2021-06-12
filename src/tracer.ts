import { tracer } from 'dd-trace'

tracer.init({
    experimental: {
        exporter: "log"
    }
})

export { tracer }
