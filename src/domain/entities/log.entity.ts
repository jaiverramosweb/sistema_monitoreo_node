
export enum logSeverityLevel {
    low    = 'low',
    medium = 'medium',
    high   = 'high'
} 

export interface LogEntityOptions {
    level: logSeverityLevel
    message: string
    origin: string
    createdAt?: Date
}

export class LogEntity {

    public level: logSeverityLevel
    public message: string
    public createdAt: Date
    public origin: string

    constructor( options: LogEntityOptions) {
        const { message, level, origin, createdAt = new Date() } = options

        this.message = message
        this.level = level
        this.origin = origin
        this.createdAt = createdAt

    }

    static fromJson = ( json: string ): LogEntity => {

        json = ( json === '' ) ? '{}' : json

        const { message, level, origin, createdAt } = JSON.parse( json )
        if( !message ) throw new Error('Message is required')

        const log = new LogEntity({ message, level, origin, createdAt })
        return log
    }

    static fromObject = ( object: { [key: string]: any } ): LogEntity => {
        const { message, level, origin, createdAt } = object

        const log = new LogEntity({ message, level, origin, createdAt })
        return log
    }

}