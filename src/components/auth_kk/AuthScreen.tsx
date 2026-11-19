import { normalizePhone } from "common/API"
import { ThemeContext } from "common/contexts/ThemeContext"
import { TranslationsContext } from "common/contexts/TranslationsContext"
import AuthTypes from "common/enums/LoginTypes"
import { useKentKartAuthStore } from "common/stores/KentKartAuthStore"
import { router } from "expo-router"
import { useContext, useEffect, useRef, useState } from "react"
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

type Mode = "password" | "otp"
type Intent = "signin" | "register"
type Step = "identity" | "code" | "profile"

const CODE_LENGTH = 5
const RESEND_SECONDS = 60

const STRINGS = {
	en: {
		title_signin: "Sign in",
		title_register: "Create account",
		subtitle_signin: "Use your KentKart account to see your cards, balance and trips.",
		subtitle_register: "Your phone number is all you need. We'll text you a code.",
		tab_password: "Password",
		tab_otp: "SMS code",
		phone: "Phone number",
		email: "E-mail",
		password: "Password",
		use_email: "Use e-mail instead",
		use_phone: "Use phone number instead",
		signin: "Sign in",
		send_code: "Send code",
		forgot: "Forgot your password? Sign in with a code",
		otp_hint: "No password needed. If this number has no KentKart account yet, one is created for you.",
		new_here: "New to KentKart?",
		create_account: "Create an account",
		have_account: "Already have an account?",
		code_title: "Enter the code",
		code_sent_to: (to: string) => `We sent a ${CODE_LENGTH}-digit code to ${to}.`,
		ref_no: "Reference no",
		verify: "Verify",
		resend: "Resend code",
		resend_in: (s: number) => `Resend in ${s}s`,
		change_number: "Change number",
		profile_title: "Almost done",
		profile_subtitle: "Tell KentKart your name. Set a password to sign in without SMS next time.",
		name: "Name",
		surname: "Surname",
		new_password: "Password (optional)",
		confirm_password: "Confirm password",
		save: "Save and continue",
		skip: "Skip for now",
		incognito: "Continue without an account",
		err_phone: "Enter a 10-digit mobile number (5XX XXX XX XX).",
		err_email: "Enter a valid e-mail address.",
		err_password: "Enter your password.",
		err_code: `Enter the ${CODE_LENGTH}-digit code.`,
		err_name: "Enter your name and surname.",
		err_mismatch: "Passwords don't match.",
	},
	tr: {
		title_signin: "Giriş yap",
		title_register: "Hesap oluştur",
		subtitle_signin: "Kartlarını, bakiyeni ve yolculuklarını görmek için KentKart hesabını kullan.",
		subtitle_register: "Sadece telefon numaran yeterli. Sana bir kod göndereceğiz.",
		tab_password: "Şifre",
		tab_otp: "SMS kodu",
		phone: "Telefon numarası",
		email: "E-posta",
		password: "Şifre",
		use_email: "E-posta ile devam et",
		use_phone: "Telefon numarası ile devam et",
		signin: "Giriş yap",
		send_code: "Kod gönder",
		forgot: "Şifreni mi unuttun? Kod ile giriş yap",
		otp_hint: "Şifre gerekmez. Bu numaranın KentKart hesabı yoksa senin için oluşturulur.",
		new_here: "KentKart'ta yeni misin?",
		create_account: "Hesap oluştur",
		have_account: "Zaten hesabın var mı?",
		code_title: "Kodu gir",
		code_sent_to: (to: string) => `${to} adresine ${CODE_LENGTH} haneli bir kod gönderdik.`,
		ref_no: "Referans no",
		verify: "Onayla",
		resend: "Kodu tekrar gönder",
		resend_in: (s: number) => `${s} sn sonra tekrar gönder`,
		change_number: "Numarayı değiştir",
		profile_title: "Az kaldı",
		profile_subtitle: "Adını yaz. Bir dahaki sefere SMS'siz girmek için şifre belirleyebilirsin.",
		name: "Ad",
		surname: "Soyad",
		new_password: "Şifre (isteğe bağlı)",
		confirm_password: "Şifre tekrar",
		save: "Kaydet ve devam et",
		skip: "Şimdilik geç",
		incognito: "Hesapsız devam et",
		err_phone: "10 haneli cep numaranı gir (5XX XXX XX XX).",
		err_email: "Geçerli bir e-posta adresi gir.",
		err_password: "Şifreni gir.",
		err_code: `${CODE_LENGTH} haneli kodu gir.`,
		err_name: "Adını ve soyadını gir.",
		err_mismatch: "Şifreler aynı değil.",
	},
}

/** 5XXXXXXXXX -> 5XX XXX XX XX */
function formatPhone(input: string) {
	const d = input.replace(/\D/g, "").slice(0, 10)
	const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean)
	return parts.join(" ")
}
function maskedPhone(digits: string) {
	if (digits.length < 7) return digits
	return `+90 ${digits.slice(0, 3)} *** ** ${digits.slice(-2)}`
}

// ---- small building blocks (module level so inputs keep focus across renders) ----
function Field(props: TextInputProps & { icon: string; right?: any; prefix?: string; busy?: boolean }) {
	const { theme } = useContext(ThemeContext)
	const { icon, right, prefix, style, busy, ...rest } = props
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				borderWidth: 1.5,
				borderColor: "#e2e8f0",
				backgroundColor: "#f8fafc",
				borderRadius: 14,
				paddingHorizontal: 14,
				height: 56,
				marginTop: 12,
			}}
		>
			<MaterialCommunityIcons name={icon} size={22} color={theme.secondary} style={{ opacity: 0.6 }} />
			{prefix ? <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: "700", color: theme.secondary }}>{prefix}</Text> : null}
			<TextInput
				placeholderTextColor="#94a3b8"
				style={[{ flex: 1, marginLeft: 10, fontSize: 17, fontWeight: "600", color: theme.secondaryDark }, style]}
				editable={!busy}
				{...rest}
			/>
			{right}
		</View>
	)
}
function PrimaryButton(props: { label: string; onPress: () => void; disabled?: boolean; busy?: boolean }) {
	const { theme } = useContext(ThemeContext)
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			disabled={props.busy || props.disabled}
			onPress={props.onPress}
			style={{
				marginTop: 20,
				height: 56,
				borderRadius: 14,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: theme.primary,
				opacity: props.disabled ? 0.5 : 1,
			}}
		>
			{props.busy ? (
				<ActivityIndicator color={theme.secondaryDark} />
			) : (
				<Text style={{ fontSize: 18, fontWeight: "800", color: theme.secondaryDark }}>{props.label}</Text>
			)}
		</TouchableOpacity>
	)
}
function LinkButton(props: { label: string; onPress: () => void; muted?: boolean; disabled?: boolean }) {
	const { theme } = useContext(ThemeContext)
	return (
		<TouchableOpacity disabled={props.disabled} onPress={props.onPress} style={{ paddingVertical: 10, alignSelf: "center" }}>
			<Text
				style={{
					fontSize: 15,
					fontWeight: "700",
					color: props.muted || props.disabled ? "#94a3b8" : theme.secondary,
					textAlign: "center",
				}}
			>
				{props.label}
			</Text>
		</TouchableOpacity>
	)
}

export default function AuthScreen() {
	const { theme } = useContext(ThemeContext)
	const { lang } = useContext(TranslationsContext)
	const t = (lang as string) === "tr" ? STRINGS.tr : STRINGS.en
	const insets = useSafeAreaInsets()
	const codeInput = useRef<TextInput>(null)

	const login = useKentKartAuthStore((s) => s.login)
	const sendOtp = useKentKartAuthStore((s) => s.sendOtp)
	const loginWithOtp = useKentKartAuthStore((s) => s.loginWithOtp)
	const updateProfile = useKentKartAuthStore((s) => s.updateProfile)

	const [intent, setIntent] = useState<Intent>("signin")
	const [mode, setMode] = useState<Mode>("password")
	const [step, setStep] = useState<Step>("identity")
	const [authType, setAuthType] = useState<AuthTypes>(AuthTypes.phone)
	const [phone, setPhone] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [code, setCode] = useState("")
	const [refNo, setRefNo] = useState<string | undefined>()
	const [cooldown, setCooldown] = useState(0)
	const [profile, setProfile] = useState({ name: "", surname: "", password: "", confirm: "" })
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState<string | undefined>()

	useEffect(() => {
		if (cooldown <= 0) return
		const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
		return () => clearTimeout(timer)
	}, [cooldown])

	const isPhone = authType === AuthTypes.phone
	const username = isPhone ? normalizePhone(phone) : email.trim()

	function validateIdentity() {
		if (isPhone && !/^5\d{9}$/.test(username)) return t.err_phone
		if (!isPhone && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) return t.err_email
	}
	/** back to the screen that asked for a sign in (incognito mode), or Home if there is none */
	function goHome() {
		if (router.canGoBack()) router.back()
		else router.replace({ pathname: "/RootScreen" })
	}
	async function run(task: () => Promise<void>) {
		if (busy) return
		setError(undefined)
		setBusy(true)
		try {
			await task()
		} catch (e: any) {
			setError(e?.message || `${e}`)
		} finally {
			setBusy(false)
		}
	}

	const onPasswordSignIn = () =>
		run(async () => {
			const invalid = validateIdentity() || (!password ? t.err_password : undefined)
			if (invalid) return setError(invalid)
			const [ok, err] = await login({ username, password, auth_type: authType })
			if (!ok) return setError(err)
			goHome()
		})
	const onSendCode = () =>
		run(async () => {
			const invalid = validateIdentity()
			if (invalid) return setError(invalid)
			const [ref, err] = await sendOtp({ username, auth_type: authType })
			if (!ref) return setError(err)
			setRefNo(ref)
			setCode("")
			setCooldown(RESEND_SECONDS)
			setStep("code")
		})
	const onVerify = (value = code) =>
		run(async () => {
			if (value.length !== CODE_LENGTH || !refNo) return setError(t.err_code)
			const [ok, err] = await loginWithOtp({ username, auth_type: authType, otp_code: value, ref_no: refNo })
			if (!ok) return setError(err)
			const user = useKentKartAuthStore.getState().user
			if (intent === "register" || !user?.name) {
				setProfile((p) => ({ ...p, name: user?.name || "", surname: user?.surname || "" }))
				setStep("profile")
				return
			}
			goHome()
		})
	const onSaveProfile = () =>
		run(async () => {
			if (!profile.name.trim() || !profile.surname.trim()) return setError(t.err_name)
			if (profile.password && profile.password !== profile.confirm) return setError(t.err_mismatch)
			const [ok, err] = await updateProfile({
				name: profile.name,
				surname: profile.surname,
				password: profile.password || undefined,
			})
			if (!ok) return setError(err)
			goHome()
		})

	function switchMode(next: Mode) {
		setMode(next)
		setError(undefined)
	}
	function switchIntent(next: Intent) {
		setIntent(next)
		setMode(next === "register" ? "otp" : "password")
		setStep("identity")
		setError(undefined)
	}

	const identityFields = (
		<>
			{isPhone ? (
				<Field
					busy={busy}
					key="phone"
					icon="cellphone"
					prefix="+90"
					placeholder="5XX XXX XX XX"
					inputMode="tel"
					keyboardType="phone-pad"
					autoComplete="tel"
					textContentType="telephoneNumber"
					value={formatPhone(phone)}
					onChangeText={(text) => setPhone(normalizePhone(text).slice(0, 10))}
				/>
			) : (
				<Field
					busy={busy}
					key="email"
					icon="email-outline"
					placeholder={t.email}
					inputMode="email"
					keyboardType="email-address"
					autoCapitalize="none"
					autoComplete="email"
					textContentType="emailAddress"
					value={email}
					onChangeText={setEmail}
				/>
			)}
		</>
	)

	const header = (() => {
		if (step === "code") return { icon: "message-text-lock-outline", title: t.code_title, subtitle: t.code_sent_to(isPhone ? maskedPhone(username) : username) }
		if (step === "profile") return { icon: "account-check-outline", title: t.profile_title, subtitle: t.profile_subtitle }
		if (intent === "register") return { icon: "account-plus-outline", title: t.title_register, subtitle: t.subtitle_register }
		return { icon: "card-account-details-outline", title: t.title_signin, subtitle: t.subtitle_signin }
	})()

	return (
		<KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.white }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
				{/* header */}
				<View
					style={{
						backgroundColor: theme.secondary,
						paddingTop: insets.top + 12,
						paddingBottom: 56,
						paddingHorizontal: 24,
						borderBottomLeftRadius: 32,
						borderBottomRightRadius: 32,
					}}
				>
					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<TouchableOpacity
							hitSlop={12}
							onPress={() => {
								if (step === "code") return setStep("identity")
								if (router.canGoBack()) router.back()
								else goHome()
							}}
							style={{ opacity: step === "profile" ? 0 : 1 }}
							disabled={step === "profile"}
						>
							<MaterialCommunityIcons name="arrow-left" size={26} color={theme.white} />
						</TouchableOpacity>
						<Text style={{ color: theme.primary, fontWeight: "900", fontSize: 16, letterSpacing: 1 }}>KENTKART</Text>
					</View>
					<View
						style={{
							marginTop: 20,
							width: 64,
							height: 64,
							borderRadius: 20,
							backgroundColor: theme.primary,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<MaterialCommunityIcons name={header.icon} size={34} color={theme.secondaryDark} />
					</View>
					<Text style={{ marginTop: 16, color: theme.white, fontSize: 32, fontWeight: "900" }}>{header.title}</Text>
					<Text style={{ marginTop: 6, color: "#cbd5e1", fontSize: 15, fontWeight: "600", lineHeight: 21 }}>{header.subtitle}</Text>
				</View>

				{/* card */}
				<View
					style={{
						marginTop: -32,
						marginHorizontal: 16,
						padding: 20,
						borderRadius: 24,
						backgroundColor: theme.white,
						shadowColor: "#000",
						shadowOpacity: 0.12,
						shadowRadius: 16,
						shadowOffset: { width: 0, height: 6 },
						elevation: 6,
					}}
				>
					{step === "identity" && (
						<>
							{intent === "signin" && (
								<View style={{ flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 14, padding: 4 }}>
									{(["password", "otp"] as Mode[]).map((m) => (
										<Pressable
											key={m}
											onPress={() => switchMode(m)}
											style={{
												flex: 1,
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "center",
												paddingVertical: 10,
												borderRadius: 10,
												backgroundColor: mode === m ? theme.white : "transparent",
												elevation: mode === m ? 2 : 0,
											}}
										>
											<MaterialCommunityIcons
												name={m === "password" ? "lock-outline" : "message-processing-outline"}
												size={18}
												color={mode === m ? theme.secondary : "#94a3b8"}
											/>
											<Text style={{ marginLeft: 6, fontWeight: "800", fontSize: 15, color: mode === m ? theme.secondary : "#94a3b8" }}>
												{m === "password" ? t.tab_password : t.tab_otp}
											</Text>
										</Pressable>
									))}
								</View>
							)}
							{identityFields}
							{mode === "password" ? (
								<>
									<Field
										busy={busy}
										icon="lock-outline"
										placeholder={t.password}
										secureTextEntry={!showPassword}
										autoCapitalize="none"
										autoComplete="password"
										textContentType="password"
										value={password}
										onChangeText={setPassword}
										onSubmitEditing={onPasswordSignIn}
										right={
											<TouchableOpacity hitSlop={10} onPress={() => setShowPassword(!showPassword)}>
												<MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#94a3b8" />
											</TouchableOpacity>
										}
									/>
									<LinkButton label={isPhone ? t.use_email : t.use_phone} onPress={() => setAuthType(isPhone ? AuthTypes.email : AuthTypes.phone)} muted />
									<PrimaryButton busy={busy} label={t.signin} onPress={onPasswordSignIn} />
									<LinkButton disabled={busy} label={t.forgot} onPress={() => switchMode("otp")} />
								</>
							) : (
								<>
									<View style={{ flexDirection: "row", marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "#fefce8" }}>
										<MaterialCommunityIcons name="information-outline" size={18} color="#a16207" />
										<Text style={{ flex: 1, marginLeft: 8, color: "#713f12", fontSize: 13, fontWeight: "600", lineHeight: 18 }}>{t.otp_hint}</Text>
									</View>
									<LinkButton label={isPhone ? t.use_email : t.use_phone} onPress={() => setAuthType(isPhone ? AuthTypes.email : AuthTypes.phone)} muted />
									<PrimaryButton busy={busy} label={t.send_code} onPress={onSendCode} />
								</>
							)}
						</>
					)}

					{step === "code" && (
						<>
							<Pressable onPress={() => codeInput.current?.focus()} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
								{Array.from({ length: CODE_LENGTH }).map((_, i) => {
									const active = i === code.length || (i === CODE_LENGTH - 1 && code.length === CODE_LENGTH)
									return (
										<View
											key={i}
											style={{
												width: 52,
												height: 62,
												borderRadius: 14,
												borderWidth: 2,
												borderColor: active ? theme.primaryDark : "#e2e8f0",
												backgroundColor: "#f8fafc",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Text style={{ fontSize: 26, fontWeight: "900", color: theme.secondaryDark }}>{code[i] || ""}</Text>
										</View>
									)
								})}
								<TextInput
									ref={codeInput}
									value={code}
									autoFocus
									maxLength={CODE_LENGTH}
									keyboardType="number-pad"
									autoComplete={Platform.OS === "android" ? ("sms-otp" as any) : "one-time-code"}
									textContentType="oneTimeCode"
									onChangeText={(text) => {
										const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH)
										setCode(digits)
										if (digits.length === CODE_LENGTH) onVerify(digits)
									}}
									caretHidden
									style={{ position: "absolute", width: "100%", height: "100%", opacity: 0 }}
								/>
							</Pressable>
							{refNo ? (
								<Text style={{ marginTop: 12, textAlign: "center", color: "#94a3b8", fontWeight: "700" }}>
									{t.ref_no}: {refNo}
								</Text>
							) : null}
							<PrimaryButton busy={busy} label={t.verify} onPress={() => onVerify()} disabled={code.length !== CODE_LENGTH} />
							<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
								<LinkButton label={t.change_number} onPress={() => setStep("identity")} muted />
								<LinkButton label={cooldown > 0 ? t.resend_in(cooldown) : t.resend} onPress={onSendCode} disabled={cooldown > 0} />
							</View>
						</>
					)}

					{step === "profile" && (
						<>
							<Field busy={busy} icon="account-outline" placeholder={t.name} autoComplete="name-given" textContentType="givenName" value={profile.name} onChangeText={(name) => setProfile({ ...profile, name })} />
							<Field busy={busy} icon="account-outline" placeholder={t.surname} autoComplete="name-family" textContentType="familyName" value={profile.surname} onChangeText={(surname) => setProfile({ ...profile, surname })} />
							<Field
										busy={busy}
								icon="lock-outline"
								placeholder={t.new_password}
								secureTextEntry
								autoCapitalize="none"
								autoComplete="password-new"
								textContentType="newPassword"
								value={profile.password}
								onChangeText={(password) => setProfile({ ...profile, password })}
							/>
							{profile.password ? (
								<Field
										busy={busy}
									icon="lock-check-outline"
									placeholder={t.confirm_password}
									secureTextEntry
									autoCapitalize="none"
									textContentType="newPassword"
									value={profile.confirm}
									onChangeText={(confirm) => setProfile({ ...profile, confirm })}
								/>
							) : null}
							<PrimaryButton busy={busy} label={t.save} onPress={onSaveProfile} />
							<LinkButton label={t.skip} onPress={goHome} muted />
						</>
					)}

					{error ? (
						<View style={{ flexDirection: "row", marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: "#fef2f2" }}>
							<MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.error} />
							<Text style={{ flex: 1, marginLeft: 8, color: "#991b1b", fontWeight: "600", lineHeight: 19 }}>{error}</Text>
						</View>
					) : null}
				</View>

				{/* footer */}
				<View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingTop: 24, paddingBottom: insets.bottom + 16 }}>
					{step === "identity" && (
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={{ color: "#64748b", fontWeight: "600", fontSize: 15 }}>{intent === "signin" ? t.new_here : t.have_account} </Text>
							<TouchableOpacity hitSlop={8} onPress={() => switchIntent(intent === "signin" ? "register" : "signin")}>
								<Text style={{ color: theme.secondary, fontWeight: "900", fontSize: 15 }}>{intent === "signin" ? t.create_account : t.title_signin}</Text>
							</TouchableOpacity>
						</View>
					)}
					{step !== "profile" && (
						<TouchableOpacity onPress={goHome} style={{ flexDirection: "row", alignItems: "center", marginTop: 18, opacity: 0.45 }}>
							<MaterialCommunityIcons name="incognito" size={22} color={theme.secondaryDark} />
							<Text style={{ marginLeft: 6, color: theme.secondaryDark, fontWeight: "700" }}>{t.incognito}</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
