const TRANSLATIONS_AR = {
	languages: {
		locale: "العربية",
	},
	select_language: "اختر اللغة",
	signin: "تسجيل الدخول",
	signup: "التسجيل",
	incognito_mode: "وضع التصفح الخفي",
	cancel: "إلغاء",
	ok: "موافق",
	input_fields: {
		phone: "رقم الهاتف",
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		confirm_password: "تأكيد كلمة المرور",
		use_phone: "استخدام رقم الهاتف",
	},
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "لا يمكننا عرض هذه الصفحة لك",
	},
	screens: {
		welcomer: {
			last_update_check: "آخر تحقق من التحديث:",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "تطبيق النقل العام غير الرسمي لـ", mark: false },
				{ str: "كوجالي", mark: true },
			],
			and_23_other_cities: "و 23 مدينة أخرى!",
			next: "التالي",
			lets_start: "لنبدأ!",
			by_people_for_people: "من الناس، للناس",
			guides_and_data_corrections: "الإرشادات وتصحيحات البيانات المقدمة من قبل محررينا المتطوعين",
			full_transparency: "شفافية كاملة",
			open_source: "مفتوح المصدر! يمكنك فرع الريبو، تقديم تقرير أو إصلاح الأخطاء!",
			unread_announcements: (args: { user_name?: string; announcement_count: number }) =>
				`${args.user_name ? `مرحبًا ${args.user_name}!\n` : ""}لديك ${args.announcement_count} إعلانات غير مقروءة منذ غيابك`,
			announcement_types: {
				official: "رسمي",
				community: "مجتمع",
				correction: "تصحيح",
			},
			dont_show_again: "لا تظهر مرة أخرى",
		},
		auth: {
			signin: {
				signup_instead: [
					{ str: "ليس لديك حساب؟ ", mark: false },
					{ str: "سجل الآن!", mark: true },
				],
				hello: "مرحبًا مجددًا!",
			},
			signup: {
				signin_instead: [
					{ str: "هل لديك حساب بالفعل؟ ", mark: false },
					{ str: "تسجيل الدخول!", mark: true },
				],
				hello: "مرحبًا!",
			},
		},
	},
	tabs: {
		editor: {
			name: "المحرر",
		},
		search: {
			name: "البحث",
		},
		home: {
			name: "الصفحة الرئيسية",
		},
		settings: {
			name: "الإعدادات",
		},
	},
};

export default TRANSLATIONS_AR;