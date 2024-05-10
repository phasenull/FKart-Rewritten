import { TextInput as DefaultTextInput, TextInputProps } from "react-native"
import Application from "../../common/Application"
import { useContext } from "react"
import { ThemeContext } from "../../common/contexts/ThemeContext"

export default function TextInput(props: {} & TextInputProps) {
	const {theme} = useContext(ThemeContext)
	return (
		<DefaultTextInput
			inputMode="text"
			autoComplete={"password"}
			secureTextEntry={true}
			style={{ color: theme.secondary }}
			placeholderTextColor={theme.secondaryDark}
			passwordRules={"minlength: 8; required: true;"}
			placeholder={props.placeholder}
			className="mt-8 border-2 w-full h-16 border-slate-200 rounded-[10px] px-8 py-2 shadow-2xl"
			value={props.placeholder}
			onChangeText={props.onChangeText}
		/>
	)
}
