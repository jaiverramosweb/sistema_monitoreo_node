import { EmailService } from "../../../presentation/email/email.service"
import { LogEntity, logSeverityLevel } from "../../entities/log.entity"
import { LogRepository } from "../../repository/log.repository"

interface SendLogEmalUseCase {
    execute: (to: string | string[]) => Promise<boolean>
}

export class SendEmailLogs implements SendLogEmalUseCase {

    constructor(
        private readonly emailService: EmailService,
        private readonly logResitpry: LogRepository
    ) {}

    async execute(to: string | string[]) {

        try {
            const sent = await this.emailService.SentEmailWithFileSystemLogs( to )

            if( !sent ) {
                throw new Error('Emal log not sent')
            }

            const newLog = new LogEntity({
                level: logSeverityLevel.high,
                message: 'Email sent',
                origin: 'send-logs.ts'
            })

            this.logResitpry.saveLog( newLog )

            return true

        } catch (error) {
            
            const newLog = new LogEntity({
                level: logSeverityLevel.high,
                message: `${error}`,
                origin: 'send-logs.ts'
            })

            this.logResitpry.saveLog( newLog )
            return false
        }

    }

}