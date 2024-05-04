const TRANSLATIONS_AZ = {
	languages: {
		locale: "Azərbaycanca",
	},
	select_language:"Dil seçin",
	signin: "Giriş",
	signup: "Qeydiyyat",
	incognito_mode: "gizli rejim",
	cancel:"ləğv et",
	ok:"OK",
	input_fields: {
		phone: "telefon nömrəsi",
		email: "e-Poçt",
		password: "şifrə",
		confirm_password: "şifrəni təsdiqlə",
		use_phone: "Telefon nömrəsi istifadə et",
	},
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "Biz bu səhifəni sizə göstərmək imkanına malik deyilik",
	},
	screens: {
		welcomer: {
			last_update_check: "Son yeniləmə yoxlanışı:",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "resmi olmayan umumi nəqliyyat tətbiqi ", mark: false },
				{ str: "Kocaeli", mark: true },
			],
			and_23_other_cities: "və 23 digər şəhər!",
			next: "Növbəti",
			lets_start: "Başlayaq!",
			by_people_for_people: "insanlar tərəfindən, insanlar üçün",
			guides_and_data_corrections: "Təlimlər, şəkillər və məlumat düzəlişləri gönüllü redaktorlarımız tərəfindən təqdim olunur",
			full_transparency: "tam şəffaf",
			open_source: "O, açıq mənbəlidir! Repo, bugları bildirin və düzəltin!",
			unread_announcements: (args: { user_name?: string; announcement_count: number }) =>
				`${args.user_name ? `Salam ${args.user_name}!\n` : ""}Siz gedən vaxtdan bəri ${args.announcement_count} oxunmamış elanınız var`,
			announcement_types: {
				official: "rəsmi",
				community: "cəmiyyət",
				correction: "düzəliş",
			},
			dont_show_again: "Bir daha göstərmə",
		},
		auth: {
			signin: {
				signup_instead: [
					{ str: "Hesabınız yoxdur? ", mark: false },
					{ str: "Qeydiyyatdan keçin!", mark: true },
				],
				hello: "Xoş gəlmisiniz!",
			},
			signup: {
				signin_instead: [
					{ str: "Hesabınız var? ", mark: false },
					{ str: "Giriş edin!", mark: true },
				],
				hello: "Xoş gəlmişsiniz!",
			},
		},
	},
	tabs: {
		editor: {
			name: "Redaktor",
		},
		search: {
			name: "Axtarış",
		},
		home: {
			name: "Ana səhifə",
		},
		settings: {
			name: "Parametrlər",
		},
	},
}

export default TRANSLATIONS_AZ
