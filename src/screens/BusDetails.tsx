import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Button, Clipboard, Image, Linking, RefreshControl, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from "react-native"
import Application from "../common/Application"
import React, { useContext, useEffect, useState } from "react"
import BusData from "../common/interfaces/KentKart/BusData"
import { useGetBusImages } from "../common/hooks/fkart/bus/useGetBusImages"
import CustomLoadingIndicator from "../components/root/CustomLoadingIndicator"
import * as ImagePicker from "expo-image-picker"

import { putBusImages } from "../common/hooks/fkart/bus/usePutBusImages"
import { Buffer } from "buffer"
import Animated from "react-native-reanimated"
import { ThemeContext } from "../common/contexts/ThemeContext"
export default function BusDetails(props: { route: { params: { bus: BusData } }; navigation: NativeStackNavigationProp<any> }) {
	const { theme } = useContext(ThemeContext)

	const [loading, setLoading] = useState(false)
	const { navigation } = props
	const { bus } = props.route.params
	const { data, isError, isLoading, isRefetching, error, refetch } = useGetBusImages(bus)

	useEffect(() => {
		navigation.setOptions({
			headerTitle: `${props.route?.params?.bus?.plateNumber || "unnamed bus"}`,
			headerTintColor: theme.secondary,
			headerTitleAlign: "left",
			headerTitleStyle: {
				fontWeight: "bold",
			},
		})
	}, [])
	const [token, setToken] = useState<string>("")
	useEffect(() => {
		;(async () => {
			const token = await Application.database.get("CDN_TOKEN")
			setToken(token)
		})()
	}, [])
	const [image, setImage] = useState<string | undefined>(undefined)

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
			// aspect: [80,36],
		})

		if (!result.canceled) {
			const asset = result.assets[0].uri
			if (!asset) {
				return
			}
			setImage(asset)
			// todo
		}
	}
	async function uploadImage() {
		if (!image) {
			return
		}
		let request
		const blobToBase64 = (blob: Blob) => {
			const reader = new FileReader()
			reader.readAsDataURL(blob)
			return new Promise((resolve) => {
				reader.onloadend = () => {
					resolve(reader.result)
				}
			})
		}
		try {
			request = await putBusImages(bus, image)
			refetch()
		} catch (error) {
			ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT)
			return
		}
		if (request?.status === 200) {
			ToastAndroid.show("Image uploaded!", ToastAndroid.SHORT)
			console.log("response", request?.data.data)
		}
	}

	if (!props?.route?.params?.bus) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: theme.error, fontSize: 24 }}>No card data found</Text>
			</View>
		)
	}
	if (isLoading || isRefetching) {
		return <CustomLoadingIndicator />
	}
	if (isError) {
		return (
			<Animated.ScrollView
				// tofix
				refreshControl={<RefreshControl refreshing={loading} onRefresh={() => refetch()} />}
				className="flex-col"
				contentContainerStyle={{
					alignItems: "center",
					padding: 20,
				}}
			>
				<Text style={{ color: theme.error, fontSize: 24 }}>{(error as { message: string })?.message}</Text>
				<TextInput onChangeText={setToken} placeholder={token} className="bg-slate-500 w-80 h-20 text-center"></TextInput>
				<TouchableOpacity
					className="bg-red-400 w-16 h-16"
					onPress={async () => {
						await Application.database.set("CDN_TOKEN", token)
						setToken("TOKEN SET!")
					}}
				/>
			</Animated.ScrollView>
		)
	}
	return (
		<Animated.ScrollView
			// tofix
			refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
			className="flex-col gap-y-5"
			contentContainerStyle={{
				alignItems: "center",
				padding: 20,
			}}
		>
			<View
				style={{
					backgroundColor: theme.white,
					borderRadius: 16,
					elevation: 10,
					shadowOffset: { height: 4, width: 4 },
					padding: 20,
				}}
				className="w-80 flex-col overflow-hidden"
			>
				<Text>{JSON.stringify(data?.data, undefined, 4)}</Text>
				<Text>Token: {token.slice(0, 8)}***</Text>
			</View>
			<View
				style={{
					backgroundColor: theme.white,
					borderRadius: 16,
					elevation: 10,
					shadowOffset: { height: 4, width: 4 },
				}}
				className="items-center py-4 w-80 flex-col gap-y-5 overflow-hidden"
			>
				<Button title="Pick an image from camera roll" onPress={pickImage} />
				{image && (
					<React.Fragment>
						<Image className="w-80 h-36" source={{ uri: image }} />
						<Button title="Upload" onPress={uploadImage}></Button>
					</React.Fragment>
				)}
			</View>

			<View
				style={{
					backgroundColor: theme.white,
					borderRadius: 16,
					elevation: 10,
					shadowOffset: { height: 4, width: 4 },
				}}
				className="items-center py-4 w-80 flex-col gap-y-5 overflow-hidden"
			>
				<Text>{JSON.stringify(bus, undefined, 4)}</Text>
			</View>
			{data?.data.data?.map((image_data: { url: string; uploadedAt: string; size: number }) => (
				<TouchableOpacity
					onPress={() => {
						Linking.openURL(image_data.url)
					}}
					onLongPress={() => {
						Clipboard.setString(bus.plateNumber)
						ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT)
						Vibration.vibrate(100)
					}}
					key={`${image_data.url}`}
					style={{
						backgroundColor: theme.white,
						borderRadius: 16,
						elevation: 10,
						shadowOffset: { height: 4, width: 4 },
					}}
					className="h-max w-80 flex-col overflow-hidden items-center"
				>
					<Text>
						{image_data.uploadedAt} {image_data.size}
					</Text>
					<Image
						source={{
							uri: image_data.url,
							// cache: "force-cache",
						}}
						style={{ objectFit: "contain", width: 80 * 4, height: 80 * 4 }}
					/>
					<Text>{image_data.url}</Text>
				</TouchableOpacity>
			))}
		</Animated.ScrollView>
	)
}
