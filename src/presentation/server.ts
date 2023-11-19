import { CheckService } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/email/send-logs";
import { FileSistemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgreLogDatasource } from "../infrastructure/datasources/postgre-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service"
import { EmailService } from "./email/email.service";

const LogRepository = new LogRepositoryImpl(
    // new FileSistemDatasource(),
    // new MongoLogDatasource(),
    new PostgreLogDatasource()
)
const emailService = new EmailService()

export class Server {

    public static start() {
        console.log('server started...')

        //TODO: Mander email
        // new SendEmailLogs(
        //     emailService,
        //     fileSystemLogRepository
        // ).execute(['jaiver.ramos7942@gmail.com'])


        //TODO: cron de logs
        CronService.createJob(
            '*/5 * * * * *',
            () => {
                const url = 'https://google.com'

                new CheckService(
                    LogRepository,
                    () => console.log('success'),
                    ( error ) => console.log(error)
                ).execute( url )
            }
        );

    }
    
}