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