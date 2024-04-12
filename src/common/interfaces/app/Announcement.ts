export interface Announcement {
	id: number
	announcementType: "official" | "community"
	title: string
	description: string
	image?: string
	extra?: {
		validFrom?: Date
		validTo?: Date
		targetRoutes?:string[]
	}
}
