import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";

export default function Folder() {
    const router = useRouter();
    const {folderId} = router.query;
    return <h1>Folder {folderId}</h1>

}

Folder.Layout = Layout;