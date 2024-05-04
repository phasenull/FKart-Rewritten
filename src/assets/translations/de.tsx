const TRANSLATIONS_DE = {
	languages: {
		locale: "Deutsch",
	},
	signin: "Anmelden",
	select_language: "Sprache auswählen",
	signup: "Registrieren",
	incognito_mode: "Inkognito-Modus",
	cancel: "Abbrechen",
	ok: "OK",
	input_fields: {
		phone: "Telefonnummer",
		email: "E-Mail",
		password: "Passwort",
		confirm_password: "Passwort bestätigen",
		use_phone: "Telefonnummer verwenden",
	},
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "Wir können Ihnen diese Seite nicht anzeigen",
	},
	screens: {
		welcomer: {
			last_update_check: "Letzte Aktualisierung:",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "inoffizielle öffentliche Verkehrs-App für ", mark: false },
				{ str: "Kocaeli", mark: true },
			],
			and_23_other_cities: "und 23 andere Städte!",
			next: "Weiter",
			lets_start: "Lass uns anfangen!",
			by_people_for_people: "von Menschen, für Menschen",
			guides_and_data_corrections: "Anleitungen, Fotos und Datenkorrekturen bereitgestellt von unseren ehrenamtlichen Redakteuren",
			full_transparency: "volle Transparenz",
			open_source: "Es ist Open Source! Sie können das Repository klonen, Fehler melden oder beheben!",
			unread_announcements: (args: { user_name?: string; announcement_count: number }) =>
				`${args.user_name ? `Hallo ${args.user_name}!\n` : ""}Sie haben ${args.announcement_count} ungelesene Ankündigungen seit Ihrem letzten Besuch`,
			announcement_types: {
				official: "offiziell",
				community: "Community",
				correction: "Korrektur",
			},
			dont_show_again: "Nicht mehr anzeigen",
		},
		auth: {
			signin: {
				signup_instead: [
					{ str: "Sie haben kein Konto? ", mark: false },
					{ str: "Registrieren Sie sich!", mark: true },
				],
				hello: "Willkommen zurück!",
			},
			signup: {
				signin_instead: [
					{ str: "Sie haben bereits ein Konto? ", mark: false },
					{ str: "Anmelden!", mark: true },
				],
				hello: "Willkommen!",
			},
		},
	},
	tabs: {
		editor: {
			name: "Editor",
		},
		search: {
			name: "Suche",
		},
		home: {
			name: "Startseite",
		},
		settings: {
			name: "Einstellungen",
		},
	},
}

export default TRANSLATIONS_DE