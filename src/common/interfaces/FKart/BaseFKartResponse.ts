export default interface BaseFKartResponse {
	result: {
		cmd: string
		time: number
		fTime: string
		status: number
		success: boolean
		error?: string
	}
}
