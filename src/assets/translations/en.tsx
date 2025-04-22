const TRANSLATIONS_EN = {
	languages: {
		locale: "English",
	}, or: "or",
	select_language: "Select language",
	signin: "Sign In",
	signup: "Sign Up",
	incognito_mode: "incognito mode",
	cancel: "cancel",
	ok: "OK",
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
		fkart: {
			editor: "Editor",
			auth: {
				welcomer: {
					what_is_an_editor_title: "But, what is an Editor?",
					what_is_an_editor_desc: "EN Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ullamcorper tristique nibh, et porta sapien iaculis ac. Etiam eleifend, augue eu luctus porttitor, eros mi vehicula tellus, congue lobortis ex ligula sit amet augue.",
					what_do_i_need_to_be_an_editor_title: "I wanna be an Editor too!",
					what_do_i_need_to_be_an_editor_desc: "EN Fusce aliquam, ante eu maximus tincidunt, urna elit maximus enim, quis fringilla lacus sem in diam. Donec tempor volutpat ultrices. Duis sit amet accumsan urna. Praesent placerat, ex a suscipit tristique.",
				}
			}
		},
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
			key: "Editor",
		},
		search: {
			name: "Search",
			key: "Search",
		},
		home: {
			name: "Home",
			key: "Home",
		},
		settings: {
			name: "Settings",
			key: "Settings",
		},
	},
}

export default TRANSLATIONS_EN
