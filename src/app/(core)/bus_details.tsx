import ApplicationConfig from "common/ApplicationConfig"
import { useGetBusImages } from "common/hooks/fkart/bus/useGetBusImages"
import BusData from "common/interfaces/KentKart/BusData"
import CustomLoadingIndicator from "components/reusables/CustomLoadingIndicator"
import * as ImagePicker from "expo-image-picker"
import React, { useContext, useEffect, useState } from "react"
import { Button, Clipboard, Image, Linking, RefreshControl, Text, TextInput, ToastAndroid, TouchableOpacity, Vibration, View } from "react-native"

import { ThemeContext } from "common/contexts/ThemeContext"
import { putBusImages } from "common/hooks/fkart/bus/usePutBusImages"
import { Stack, useLocalSearchParams } from "expo-router"
import Animated from "react-native-reanimated"
export default function BusDetails() {
	const { theme } = useContext(ThemeContext)
	const { bus64 } = useLocalSearchParams<{ bus64: string }>()
	const bus = JSON.parse(unescape(atob(bus64))) as BusData
	const { data, isError, isLoading, isRefetching, error, refetch } = useGetBusImages(bus)
	const [uploadPercentage, setUploadPercentage] = useState<undefined | number>(undefined)
	const [token, setToken] = useState<string>("")
	// %refactor react-query
	useEffect(() => {
		;(async () => {
			const token = await ApplicationConfig.database.get("CDN_TOKEN")
			setToken(token)
		})()
	}, [])
	const [image, setImage] = useState<string | undefined>(undefined)
	// %refactor react-query
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
			request = await putBusImages(bus, image, {
				onUploadProgress: (e) => {
					setUploadPercentage(Math.floor((e?.progress || 0) * 100))
				},
			})
			refetch()
		} catch (error) {
			ToastAndroid.show(`Error: ${request?.request.error.data.result.error}`, ToastAndroid.SHORT)
			return
		}
		if (request?.status === 200) {
			ToastAndroid.show("Image uploaded!", ToastAndroid.SHORT)
			console.log("response", request?.data.data)
		}
	}

	if (!bus) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text style={{ color: theme.error, fontSize: 24 }}>No data found</Text>
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
				refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
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
						await ApplicationConfig.database.set("CDN_TOKEN", token)
						setToken("TOKEN SET!")
					}}
				/>
			</Animated.ScrollView>
		)
	}
	return (
		<Animated.ScrollView
			// tofix
			refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
			className="flex-col gap-y-5"
			contentContainerStyle={{
				alignItems: "center",
				padding: 20,
			}}
		>
			<Stack.Screen
				options={{
					headerTitleStyle: {
						color: theme.secondary,
						fontWeight: "900",
					},
					headerShown:true,
					headerTintColor:theme.secondary,
					headerTitle: `${bus.plateNumber}` || "bus.plateNumber is undefined",
				}}
			/>
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
						<Button title={`Upload${uploadPercentage !== undefined ? ` %${uploadPercentage}` : ""}`} onPress={uploadImage}></Button>
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
