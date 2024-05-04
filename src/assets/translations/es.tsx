const TRANSLATIONS_ES = {
	languages: {
		locale: "Español",
	},
	select_language:"Seleccionar idioma",
	signin: "Iniciar sesión",
	signup: "Registrarse",
	incognito_mode: "modo incógnito",
	cancel:"cancelar",
	ok:"OK",
	input_fields: {
		phone: "número de teléfono",
		email: "correo electrónico",
		password: "contraseña",
		confirm_password: "confirmar contraseña",
		use_phone: "Usar un número de teléfono",
	},
	authwall: {
		we_are_not_able_to_show_this_page_to_you: "No podemos mostrar esta página",
	},
	screens: {
		welcomer: {
			last_update_check: "Última comprobación de actualización:",
			unofficial_public_transit_app_for_kocaeli: [
				{ str: "aplicación de tránsito no oficial para ", mark: false },
				{ str: "Kocaeli", mark: true },
			],
			and_23_other_cities: "¡y otras 23 ciudades!",
			next: "Siguiente",
			lets_start: "¡Comencemos!",
			by_people_for_people: "por personas, para personas",
			guides_and_data_corrections: "Guías, fotos y correcciones de datos proporcionadas por nuestros editores voluntarios",
			full_transparency: "total transparencia",
			open_source: "¡Es de código abierto! Puedes bifurcar el repositorio, informar o corregir errores",
			unread_announcements: (args: { user_name?: string; announcement_count: number }) =>
				`${args.user_name ? `¡Hola ${args.user_name}!\n` : ""}Tienes ${args.announcement_count} anuncios sin leer desde que te fuiste`,
			announcement_types: {
				official: "oficial",
				community: "comunitario",
				correction: "corrección",
			},
			dont_show_again: "No volver a mostrar",
		},
		auth: {
			signin: {
				signup_instead: [
					{ str: "¿No tienes una cuenta? ", mark: false },
					{ str: "¡Regístrate!", mark: true },
				],
				hello: "¡Bienvenido de nuevo!",
			},
			signup: {
				signin_instead: [
					{ str: "¿Ya tienes una cuenta? ", mark: false },
					{ str: "¡Inicia sesión!", mark: true },
				],
				hello: "¡Bienvenido!",
			},
		},
	},
	tabs: {
		editor: {
			name: "Editor",
		},
		search: {
			name: "Buscar",
		},
		home: {
			name: "Inicio",
		},
		settings: {
			name: "Configuración",
		},
	},
}

export default TRANSLATIONS_ES