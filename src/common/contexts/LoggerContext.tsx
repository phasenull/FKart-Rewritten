import { createContext, useEffect, useMemo, useRef, useState } from "react"
import { View } from "react-native"
import SecondaryText from "../../components/root/SecondaryText"
import LogPop from "../../components/root/LogPop"
import * as Updates from "expo-updates"
export interface Log {
	uid: string
	title: string
	at: number
	description?: string
	level?: "log" | "info" | "warn" | "error"
}

export const LoggerContext = createContext<{ appendLog: (log: Omit<Omit<Log, "uid">, "at">) => void }>({} as any)
export function LoggerContextProvider(props: { children: any }) {
	const [logs, setLogs] = useState<Log[]>([])
	function appendLog(log: Omit<Omit<Log, "uid">, "at">) {
		console.log(`${logs.length} Append Log!`, log.title)
		const uid = Math.floor(Math.random() * 10000).toString()
		const updated = [...logs]
		updated.push({ ...log, at: Date.now(), uid: uid })
		setLogs(updated)
	}
	function destroyLog() {
		const filtered = [...logs].filter((log) => {
			const res = (log.at + 5000) > Date.now()
			return res
		})
		setLogs(filtered)
	}
	return (
		<LoggerContext.Provider value={{ appendLog }}>
			{props.children}
			<View className="flex-1 absolute self-center items-center py-2 flex-col" style={{}}>
				{logs.map((e, index) => (
					<LogPop key={e.uid} log={e} destroyLogPop={destroyLog} />
				))}
			</View>
		</LoggerContext.Provider>
	)
}
