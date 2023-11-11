import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSistemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service"

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSistemDatasource()
)


export class Server {

    public static start() {
        console.log('server started...')

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                const url = 'https://google.com'
                new CheckService(
                    fileSystemLogRepository,
                    () => console.log('success'),
                    ( error ) => console.log(error)
                ).execute( url )
            }
        );

    }
    
}