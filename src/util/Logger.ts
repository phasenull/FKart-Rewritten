export default abstract class Logger {
	public static log(stack: string, ...args: any[]) {
		const text = `${getPrefix("LOG", stack)} ${args}`
		console.log(text)
	}
	public static error(stack: string, ...args: any[]) {
		const text = `${getPrefix("ERROR", stack)} ${args}`
		console.log(text)
	}
	public static warning(stack: string, ...args: any[]) {
		const text = `${getPrefix("WARNING", stack)} ${args}`
		console.log(text)
	}

	public static info(stack: string, ...args: any[]) {
		const text = `${getPrefix("INFO", stack)} ${args}`
		console.log(text)
	}
}
function getTime() {
	const date = new Date()
	return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date
		.getDate()
		.toString()
		.padStart(2, "0")}/${date.getMonth().toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(4, "0")}`
}
function getLogColor(log_type: string) {
	switch (log_type) {
		case "LOG":
			return "\x1b[47m"
		case "ERROR":
			return "\x1b[41m"
		case "WARNING":
			return "\x1b[43m"
		case "INFO":
			return "\x1b[46m"
		default:
			return "\x1b[0m"
	}
}
function getPrefix(log_type: string, stack?: string) {
	return `${getTime()} ${getLogColor(log_type)}[${log_type}/${stack || "unknown"}]\x1b[0m`
}
