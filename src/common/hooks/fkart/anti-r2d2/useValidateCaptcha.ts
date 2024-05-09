import { useQuery } from "react-query"
import axios, { AxiosResponse } from "axios"
import Logger from "../../../Logger"
import Application from "../../../Application"
import BaseFKartResponse from "../../../interfaces/FKart/BaseFKartResponse"
import Captcha from "../../../interfaces/FKart/Captcha"

async function ValidateCaptcha(args:{session_id:string,code:string}): Promise<
	AxiosResponse<
		BaseFKartResponse & {
			captcha: Captcha
		}
	>
> {
	Logger.info("REQUEST validateCaptcha")
	return axios(`${Application.fkart_endpoints.antir2d2}/validate`,{method:"POST"})
}

export default function useValidateCaptcha(args:{session_id:string,code:string}) {
	return useQuery(["validateCaptcha",args.session_id,args.code], ()=>ValidateCaptcha(args), {staleTime:30*1000})
}
