import TRANSLATIONS_EN from "./en"

const TRANSLATIONS_TR: typeof TRANSLATIONS_EN = {
	languages: {
		locale: "Türkçe",
	},
	or: "ya da",
	select_language: "Dili değiştir",
	signin: "Giriş Yap",
	signup: "Kayıt Ol",
	incognito_mode: "gizli mod",
	cancel: "iptal",
	ok: "tamam",
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "Onu gösteremiyoruz malesef!",
	},
	screens: {
		fkart: {
			editor:"Editör",
			auth: {
				welcomer: {
					what_is_an_editor_title: "İyi de Editör ne demek?",
					what_is_an_editor_desc:
						"TR Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ullamcorper tristique nibh, et porta sapien iaculis ac. Etiam eleifend, augue eu luctus porttitor, eros mi vehicula tellus, congue lobortis ex ligula sit amet augue.",
					what_do_i_need_to_be_an_editor_title: "Ben de Editör olmak istiyorum!",
					what_do_i_need_to_be_an_editor_desc:
						"TR Fusce aliquam, ante eu maximus tincidunt, urna elit maximus enim, quis fringilla lacus sem in diam. Donec tempor volutpat ultrices. Duis sit amet accumsan urna. Praesent placerat, ex a suscipit tristique.",
				},
			},
		},
		auth: {
			signup: {
				hello: "Hoşgeldin!",
				signin_instead: [
					{ str: "Zaten hesabın var mı? ", mark: false },
					{ str: "Giriş yap!", mark: true },
				],
			},

			signin: {
				hello: "Tekrar hoşgeldin!",
				signup_instead: [
					{ str: "Hesabın yok mu? ", mark: false },
					{ str: "Kayıt ol!", mark: true },
				],
			},
		},
		welcomer: {
			and_23_other_cities: "ve diğer 23 şehirde!",
			by_people_for_people: "toplum tarafından,\ntoplum için",
			dont_show_again: "Tekrar gösterme",
			full_transparency: "tam şeffaflık",
			guides_and_data_corrections: "Gönüllü editör'lerimiz tarafından sunulan yol tarifleri, fotoğraflar ve veri düzeltmeleri",
			last_update_check: "Son güncelleme kontrolü:",
			lets_start: "Başla!",
			next: "Sonraki",
			open_source: "açık-kaynak! repo'muzu forklayabilir, hataları raporlayabilir veya düzeltebilirsiniz!",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "Kocaeli", mark: true },
				{ str: " için resmi-olmayan toplu taşıma uygulaması", mark: false },
			],
			announcement_types: { community: "topluluk", correction: "düzeltme", official: "resmi" },
			unread_announcements: (args) => `${args.user_name ? `Selam ${args.user_name}!\n` : ""}Geçen seferden beri ${args.announcement_count} okunmamış duyurun var`,
		},
	},
	input_fields: {
		email: "e-posta",
		password: "şifre",
		confirm_password: "şifreyi onayla",
		phone: "telefon numarası",
		use_phone: "Telefon numarası kullan",
	},
	tabs: {
		editor: {
			name: "Editör",
			key: "Editor",
		},
		search: {
			name: "Ara",
			key: "Search",
		},
		home: {
			name: "Ana Sayfa",
			key: "Home",
		},
		settings: {
			name: "Ayarlar",
			key: "Settings",
		},
	},
}
export default TRANSLATIONS_TR
