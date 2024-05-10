const TRANSLATIONS_PIRATE = {
	languages: {
		locale: "Pirate",
	},
	or:"or",
	select_language:"Select yer language",
	signin: "Find yer ship!",
	signup: "Get a ship!",
	incognito_mode: "dead man mode, arrr",
	cancel:"abandon ship",
	ok:"Aye, aye",
	input_fields: {
		phone: "ship's signal number",
		email: "e-Sparrow",
		password: "treasure coordinates",
		confirm_password: "confirm the treasure coordinates",
		use_phone: "Use a ship's signal number",
	},
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "We be not able to show this page to ye",
	},
	screens: {
		welcomer: {
			last_update_check: "Last Plunder Check:",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "unofficial transit app for ", mark: false },
				{ str: "Kocaeli", mark: true },
			],
			and_23_other_cities: "and 23 other ports!",
			next: "aye",
			lets_start: "Hoist the colors!",
			by_people_for_people: "by pirates, for pirates",
			guides_and_data_corrections: "Guides, doubloons and data corrections provided by our crew o' volunteers",
			full_transparency: "full transparency, arrr",
			open_source: "It be open-source! Ye can fork the repo, report or fix bugs!",
			unread_announcements: (args: { user_name?: string; announcement_count: number }) =>
				`${args.user_name ? `Ahoy ${args.user_name}!\n` : ""}Ye have ${args.announcement_count} unread proclamations since ye were off plundering`,
			announcement_types: {
				official: "official",
				community: "crew",
				correction: "correction",
			},
			dont_show_again: "Don't show again, or ye walk the plank",
		},
		auth: {
			signin: {
				signup_instead: [
					{ str: "Don't have a ship? ", mark: false },
					{ str: "get one!", mark: true },
				],
				hello: "Welcome Back to the Crew!",
			},
			signup: {
				signin_instead: [
					{ str: "Already have a ship? ", mark: false },
					{ str: "find yer flag!", mark: true },
				],
				hello: "Welcome aboard, Matey!",
			},
		},
	},
	tabs: {
		editor: {
			name: "Editor",
		},
		search: {
			name: "Open Waters",
		},
		home: {
			name: "Home Port",
		},
		settings: {
			name: "Treasure",
		},
	},
}

export default TRANSLATIONS_PIRATE
