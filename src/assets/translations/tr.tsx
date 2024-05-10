import TRANSLATIONS_EN from "./en"

const TRANSLATIONS_TR: typeof TRANSLATIONS_EN = {
	languages: {
		locale: "Türkçe",
	},
	or:"ya da",
	select_language:"Dili değiştir",
	signin: "Giriş Yap",
	signup: "Kayıt Ol",
	incognito_mode:"gizli mod",
	cancel:"iptal",
	ok:"TM",
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "Onu gösteremiyoruz malesef!",
	},
	screens: {
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
		email:"e-posta",
		password:"şifre",
		confirm_password:"şifreyi onayla",
		phone:"telefon numarası",
		use_phone:"Telefon numarası kullan"
	},
	tabs: {
		editor: {
			name: "Editör",
		},
		search: {
			name: "Ara",
		},
		home: {
			name: "Ana Sayfa",
		},
		settings: {
			name: "Ayarlar",
		},
	},
}
export default TRANSLATIONS_TR
