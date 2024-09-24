import { ThemeContext } from "common/contexts/ThemeContext";
import CardTransaction from "common/interfaces/KentKart/CardTransaction";
import { dateCountdown, dateFromMessedKentKartDateFormat, deltaTime } from "common/util";
import Divider from "components/reusables/Divider";
import { router } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function TransactionTouchable(props:{transaction:CardTransaction<any>}) {
	const {transaction} = props
	const {theme} = useContext(ThemeContext)
	if (!transaction) return
	const date = transaction.datetime
	const delta = Date.now()-dateFromMessedKentKartDateFormat(transaction.formattedDate).getTime()
	const transactionType = transaction.type === "1" ? "usage" : "topup"
		return (<TouchableOpacity
			onPress={() => {
				alert(JSON.stringify(transaction,undefined,4))
			}}
			className="py-1 ml-2 flex-row pl-1"
			// temp solution USE SOME SORT OF LIST IN THE FEATURE
		>
			<View className="flex-[0.22] my-auto items-center ">
				<View
					className="px-2 h-6"
					style={{
						borderRadius: 6,
						backgroundColor: transaction.usageAmt === "0.00" ? theme.primaryDark :(transactionType==="topup" ? theme.success : theme.error)
					}}
				>
					<Text
						className="text-center my-auto"
						style={{
							fontWeight: "900",
							color:theme.text.white
						}}
					>
						{transaction.amount&&`${transaction.amount.split(".")[0]}.00` || transaction.usageAmt}
					</Text>
				</View>
			</View>
			<Divider className="ml-0.5 mr-0.5 self-center" />
			<Text
				className="my-auto ml-1 mr-4 flex-1"
				style={{
					color: theme.secondary,
					fontWeight: "500",
				}}
			>
					{(delta >= 24*60*60*1_000)?transaction.formattedDate : deltaTime(delta)}
					{" "}
					{transaction.routeCode && `(route ${transaction.routeCode})`}
					{" "}
					{transaction.refundAmount && `(refund ${transaction.refundAmount})`}
			</Text>
		</TouchableOpacity>)
}