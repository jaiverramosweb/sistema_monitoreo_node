import nodemailer from 'nodemailer'
import { envs } from '../../config/plugins/envs.plugin'
import { LogEntity, logSeverityLevel } from '../../domain/entities/log.entity'

interface SendMailOptions {
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: Attachment[]
}

interface Attachment {
    fimename: string,
    path: string
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })


    async sendEmail( options: SendMailOptions ): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options

        try {

            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            })

            return true
        } catch (error) {

            return false
        }
    }

    async SentEmailWithFileSystemLogs( to:string | string[] ) {
        const subject = 'Logs the server'
        const htmlBody = `
            <h3>Logs de sistema - NOC</h3>
            <p>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</p>
            
            <p>Ver logs</p>
        `
        const attachments: Attachment[] = [
            { fimename: 'logs-all.log', path: './logs/logs-all.log' },
            { fimename: 'logs-medium.log', path: './logs/logs-medium.log' },
            { fimename: 'logs-error.log', path: './logs/logs-error.log' }
        ]

        return this.sendEmail({
            to,
            subject,
            htmlBody,
            attachments
        })
    }
}