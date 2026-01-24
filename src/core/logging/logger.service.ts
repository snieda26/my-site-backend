import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common'

interface LogEntry {
	level: string
	timestamp: string
	context?: string
	message: string
	trace?: string
	data?: Record<string, unknown>
}

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements NestLoggerService {
	private context?: string

	setContext(context: string): void {
		this.context = context
	}

	log(message: string, context?: string): void {
		this.writeLog('info', message, context)
	}

	error(message: string, trace?: string, context?: string): void {
		this.writeLog('error', message, context, trace)
	}

	warn(message: string, context?: string): void {
		this.writeLog('warn', message, context)
	}

	debug(message: string, context?: string): void {
		if (process.env.NODE_ENV === 'development') {
			this.writeLog('debug', message, context)
		}
	}

	verbose(message: string, context?: string): void {
		this.writeLog('verbose', message, context)
	}

	logWithData(level: string, message: string, data: Record<string, unknown>, context?: string): void {
		const entry: LogEntry = {
			level,
			timestamp: new Date().toISOString(),
			context: context || this.context,
			message,
			data,
		}
		console.log(JSON.stringify(entry))
	}

	private writeLog(level: string, message: string, context?: string, trace?: string): void {
		const entry: LogEntry = {
			level,
			timestamp: new Date().toISOString(),
			context: context || this.context,
			message,
		}

		if (trace) {
			entry.trace = trace
		}

		const output = JSON.stringify(entry)

		switch (level) {
			case 'error':
				console.error(output)
				break
			case 'warn':
				console.warn(output)
				break
			case 'debug':
				console.debug(output)
				break
			default:
				console.log(output)
		}
	}
}
