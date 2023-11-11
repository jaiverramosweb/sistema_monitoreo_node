import fs from 'fs';
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, logSeverityLevel } from "../../domain/entities/log.entity";

export class FileSistemDatasource implements LogDatasource {

    private readonly logPath       = 'logs/';
    private readonly allLogPath    = 'logs/logs-all.log';
    private readonly mediumLogPath = 'logs/logs-medium.log';
    private readonly errorhLogPath = 'logs/logs-error.log';

    constructor () {
        this.createLogFiles();
    }

    private createLogFiles = () => {
        if( !fs.existsSync( this.logPath ) ){
            fs.mkdirSync( this.logPath );
        }

        [
            this.allLogPath,
            this.mediumLogPath,
            this.errorhLogPath
        ].forEach( path => {
            if( fs.existsSync( path ) ) return;
            
            fs.writeFileSync(path, '');
        } )
    }

    async saveLog(newLog: LogEntity): Promise<void> {

        const logAsJson = `${ JSON.stringify(newLog) }\n`

        fs.appendFileSync(this.allLogPath, logAsJson)

        if( newLog.level === logSeverityLevel.low ) return

        if( newLog.level === logSeverityLevel.medium ) {
            fs.appendFileSync( this.mediumLogPath, logAsJson )
        } else {
            fs.appendFileSync( this.errorhLogPath, logAsJson )
        }
    }

    async getLog(severityLevel: logSeverityLevel): Promise<LogEntity[]> {
        switch( severityLevel ){
            case logSeverityLevel.low:
                return this.getLogsFromFile( this.allLogPath )
            
            case logSeverityLevel.medium:
                return this.getLogsFromFile( this.mediumLogPath )

            case logSeverityLevel.high:
                return this.getLogsFromFile( this.errorhLogPath )

            default:
                throw new Error(`${ severityLevel } not implemented`)
        }
    }

    private getLogsFromFile = ( path: string ): LogEntity[] => {
        const content = fs.readFileSync(path, 'utf-8')
        const logs = content.split('\n').map( log => LogEntity.fromJson( log ) )

        return logs
    }

}
