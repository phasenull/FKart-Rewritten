export function hideEmail(email: string | undefined) {
	if (!email) return ""
	return `${email?.slice(0, 5)}${"*".repeat(
		email?.split("@")[0].slice(5).length as number
	)}@${email?.split("@")[1]}`
}
export function hidePhone(phone: string | undefined) {
	if (!phone) return ""
	return `${"*".repeat(phone?.slice(0,phone.length-2).length as number)}${phone?.slice(-2)}`
}

export function formatAlias(alias:string | undefined) {
	const part1 : string = alias?.slice(0,5) as string
	const part2 : string = alias?.slice(5,10) as string
	const part3 : string = alias?.slice(10,11) as string
	return `${part1 + "X".repeat(5-(part1?.length as number))}-${part2 + "X".repeat(5-(part2?.length as number))}-${part3 + "X".repeat(1-(part3?.length as number))}`
}