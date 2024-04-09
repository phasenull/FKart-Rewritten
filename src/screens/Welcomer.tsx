import { useState } from "react"
import { InitialInfo } from "../components/welcomer/InitialInfo"

export default function WelcomerPage() {
	const [show, setShow] = useState<"initial_info" | "auth_page">("initial_info")

	if (show == "initial_info") {
		return <InitialInfo/>
	}
}
