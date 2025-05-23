export function hideEmail(email: string | undefined) {
	if (!email) return ""
	return `${email?.slice(0, 5)}${"*".repeat(email?.split("@")[0].slice(5).length as number)}@${email?.split("@")[1]}`
}
export function hidePhone(phone: string | undefined) {
	if (!phone) return ""
	return `${"*".repeat(phone?.slice(0, phone.length - 2).length as number)}${phone?.slice(-2)}`
}

export function formatAlias(alias: string | undefined) {
	const part1: string = alias?.slice(0, 5) as string
	const part2: string = alias?.slice(5, 10) as string
	const part3: string = alias?.slice(10, 11) as string
	return `${part1 + "X".repeat(5 - (part1?.length as number))}-${part2 + "X".repeat(5 - (part2?.length as number))}-${part3 + "X".repeat(1 - (part3?.length as number))}`
}
export function dateCountdown(date: Date) {
	const diff = dateDiff(date, new Date())
	// just use new Date(diff).year ????
	const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
	const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))
	const hours = Math.floor(diff / (1000 * 60 * 60))
	const minutes = Math.floor(diff / (1000 * 60))
	const seconds = Math.floor(diff / 1000)
	return { years, months, days, hours, minutes, seconds }
}
export function convertToDate(date: string | undefined) {
	// no idea what it does
	if (!date) {
		return
	}
	return new Date(date)
}
export function dateToString(date: Date) {
	return date.toISOString()
}
export function dateDiff(date1: Date, date2: Date) {
	return date1.getTime() - date2.getTime()
}
export function deltaTime(diff: number, removeAgo?: boolean) {
	if (diff >= 24 * 60 * 60 * 1000) {
		return `${Math.round(diff / (24 * 60 * 60 * 1000))} days${removeAgo ? "" : " ago"}`
	}
	else if (diff >= 60 * 60 * 1000) {
		return `${Math.round(diff / (60 * 60 * 1000))} hours${removeAgo ? "" : " ago"}`
	} else if (diff > 60 * 1000) {
		return `${Math.ceil(diff / (60 * 1000))} mins${removeAgo ? "" : " ago"}`
	}
	return `now`
}
export function dateFromMessedKentKartDateFormat(input: string) {
	const [ddmmyyyy, hhmm] = input.split(" ")
	const [day, month, year] = ddmmyyyy.split("/")
	const [hour, minute] = hhmm.split(":")
	const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000+03:00`)
	return date
}
export function groupBy<T>(array: T[], keyOrFn: (e: T, i: number) => string) {
	const results: Record<string, T[]> = {}
	array.forEach((e, i) => {
		const key: keyof typeof results = keyOrFn(e, i)
		if (!results[key]) {
			results[key] = []
		}
		results[key].push(e)
	})
	return results
}
export type ProperErrorHandling<SUCCESS> = [SUCCESS] | [false, string]