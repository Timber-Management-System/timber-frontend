import {ReceiveTrip } from "@/modules/sawmill/fr-24-log-receiving";
import ReceiveLogs from "@/modules/sawmill/fr-24-log-receiving/components/ReceiveLogs";
export default function Page(props:{params:Promise<{tripId:string}>}){return <ReceiveLogs {...props}/>;}