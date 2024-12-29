import { useEffect, useState } from "react";
import { loadMetadata, loadSupportedMethods } from "./api";

const RELAY_URL = process.env.RELAY_URL || '';

interface Metadata {
    name: string;
    pubkey: string;
    description: string;
}

export default function Metadata() {
    const [metadata, setMetadata] = useState<Metadata>({ name: '', pubkey: '', description: '' });
    const [supportedMethods, setSupportedMethods] = useState<string[]>([]);

    const loadData = async () => {
        const supportedMethods = await loadSupportedMethods();
        const metadata = await loadMetadata();
        setMetadata(metadata);
        setSupportedMethods(supportedMethods);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className="metadata">
                <span><b>Relay:</b> {RELAY_URL}</span>
                <span><b>Name:</b> {metadata.name}</span>
                <span><b>Owner:</b> {metadata.pubkey}</span>
                <span><b>Description:</b> {metadata.description}</span>
                <span><b>Supported Methods:</b></span>
                <ul> {supportedMethods.map(s => <li>{s}</li>)}</ul>
            </div>
        </>
    )
}