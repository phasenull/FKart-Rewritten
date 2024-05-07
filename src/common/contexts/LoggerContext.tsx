import { createContext, useEffect, useMemo, useRef, useState } from "react"
import { View } from "react-native"
import SecondaryText from "../../components/root/SecondaryText"
import LogPop from "../../components/root/LogPop"
interface Log {
	uid:string
	title: string
	at: number
	description: string
	level?: "log" | "info" | "warn" | "error"
}
export const LoggerContext = createContext<{appendLog:(log: Omit<Omit<Log,"uid">,"at">)=>void}>({} as any)
export function LoggerContextProvider(props: { children: any }) {
	const [logs, setLogs] = useState<Log[]>([])
	function appendLog(log: Omit<Omit<Log,"uid">,"at">) {
		const uid = Math.floor(Math.random()*10000).toString()
		setLogs([{...log,uid:uid,at:Date.now(),level:log.level || "log"}, ...logs])
	}
	return (
		<LoggerContext.Provider value={{ appendLog }}>
			{props.children}
			<View className="flex-1 absolute self-center items-center py-2 flex-col" style={{}}>
				{logs.map((e, index) => (
					<LogPop
						key={e.uid}
						at={e.at}
						description={e.description}
						title={e.title}
						destroyLogPop={() => {
							setLogs(logs.filter((log) => log.uid !== e.uid))
						}}
					/>
				))}
			</View>
		</LoggerContext.Provider>
	)
}
