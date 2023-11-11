import { LogEntity, logSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
    execute( url: string ):Promise<boolean>
}

type SuccessCallback = (() => void) | undefined
type ErrorCallback = (( error: string ) => void) | undefined

export class CheckService implements CheckServiceUseCase {

    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback,
    ) { }

    public async execute( url: string ): Promise<boolean> {

        try {
            const req = await fetch( url );

            if(!req.ok) throw new Error(`Error ok check service ${url}`);

            const newLog = new LogEntity(`Service ${ url } working`, logSeverityLevel.low)
            this.logRepository.saveLog( newLog )

            this.successCallback && this.successCallback()

            return true
                
        } catch (error) {
            const errorMesagge = ` ${ url } is not ok. ${ error }`
            const newLog = new LogEntity(errorMesagge, logSeverityLevel.high)
            this.logRepository.saveLog( newLog )
            this.errorCallback && this.errorCallback( errorMesagge )
            return false
        }

    }
}
