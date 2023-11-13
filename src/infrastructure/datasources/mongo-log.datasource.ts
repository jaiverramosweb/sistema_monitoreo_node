import { LogModel } from "../../data/mongo";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, logSeverityLevel } from "../../domain/entities/log.entity";


export class MongoLogDatasource implements LogDatasource {

    async saveLog(log: LogEntity): Promise<void> {
       const newLog = await LogModel.create(log)
       console.log('Mongo log created', newLog.id)
    }

    async getLog(severityLevel: logSeverityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLevel
        });

        return logs.map( log => LogEntity.fromObject( log ) )
    }

}