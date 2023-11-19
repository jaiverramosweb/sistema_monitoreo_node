import { LogDatasource } from "../../domain/datasources/log.datasource";
import { PrismaClient, SeverityLevel } from '@prisma/client';
import { LogEntity, logSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();

const severityEnum = {
    low: SeverityLevel.LOW,
    high: SeverityLevel.HIGH,
    medium: SeverityLevel.MEDIUM,
}

export class PostgreLogDatasource implements LogDatasource {

    async saveLog(log: LogEntity): Promise<void> {

        const level = severityEnum[log.level]

        const newLog = await prismaClient.logModel.create({
            data: {
                ...log,
                level
            }
        })
        console.log('Postgre created', newLog)
    }

    async getLog(severityLevel: logSeverityLevel): Promise<LogEntity[]> {

        const level = severityEnum[severityLevel]

        const getLogs = await prismaClient.logModel.findMany({
            where: { level }
        })

        return getLogs.map( LogEntity.fromObject )
    }

}