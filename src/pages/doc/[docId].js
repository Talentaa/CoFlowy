import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";

export default function Doc() {
    const router = useRouter();
    const {docId} = router.query;
    return <h1>Document {docId}</h1>
}

Doc.Layout = Layout;