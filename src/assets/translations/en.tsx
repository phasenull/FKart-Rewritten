const TRANSLATIONS_EN = {
	languages: {
		locale: "English",
	},
	select_language:"Select language",
	signin: "Sign In",
	signup: "Sign Up",
	incognito_mode: "incognito mode",
	cancel:"cancel",
	ok:"OK",
	input_fields: {
		phone: "phone number",
		email: "e-Mail",
		password: "password",
		confirm_password: "confirm password",
		use_phone: "Use a phone number",
	},
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "We are not able to show this page to you",
	},
	screens: {
		welcomer: {
			last_update_check: "Last Update Check:",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "unofficial public transit app for ", mark: false },
				{ str: "Kocaeli", mark: true },
			],
			and_23_other_cities: "and 23 other cities!",
			next: "Next",
			lets_start: "Lets start!",
			by_people_for_people: "by people, for people",
			guides_and_data_corrections: "Guides, photos and data corrections provided by our volunteer editors",
			full_transparency: "full transparency",
			open_source: "Its open-source! You can fork the repo, report or fix bugs!",
			unread_announcements: (args: { user_name?: string; announcement_count: number }) =>
				`${args.user_name ? `Hi ${args.user_name}!\n` : ""}You have ${args.announcement_count} unread announcements since you were gone`,
			announcement_types: {
				official: "official",
				community: "community",
				correction: "correction",
			},
			dont_show_again: "Don't show again",
		},
		auth: {
			signin: {
				signup_instead: [
					{ str: "Don't have an account? ", mark: false },
					{ str: "Sign up!", mark: true },
				],
				hello: "Welcome Back!",
			},
			signup: {
				signin_instead: [
					{ str: "Already have an account? ", mark: false },
					{ str: "Sign in!", mark: true },
				],
				hello: "Welcome!",
			},
		},
	},
	tabs: {
		editor: {
			name: "Editor",
		},
		search: {
			name: "Search",
		},
		home: {
			name: "Home",
		},
		settings: {
			name: "Settings",
		},
	},
}

export default TRANSLATIONS_EN
