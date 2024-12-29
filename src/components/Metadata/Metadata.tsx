import { useEffect, useState } from "react";
import { loadMetadata, loadSupportedMethods } from "./api";
import { makeReq } from "../../utils/api.utils";

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

    const handleRelayNameUpdate = async (name: string) => {
        const res = await makeReq({ method: "changerelayname", params: [name] });
        if (res.ok) {
            const result = await res.json();
            if (result.error) return false;
            return true;
        }
        return false;
    }

    const handleDescriptionUpdate = async (description: string) => {
        const res = await makeReq({ method: "changerelaydescription", params: [description] });
        if (res.ok) {
            const result = await res.json();
            if (result.error) return false;
            return true;
        }
        return false;
    }

    return (
        <>
            <div className="metadata">
                <EditableInput
                    display="Name" value={metadata.name}
                    func={handleRelayNameUpdate} />
                <EditableInput
                    display="Description" value={metadata.description}
                    func={handleDescriptionUpdate} />
                <span><b>Relay:</b> {RELAY_URL}</span>
                <span><b>Owner:</b> {metadata.pubkey}</span>
                <span><b>Supported Methods:</b></span>
                <ul> {supportedMethods.map(s => <li key={s}>{s}</li>)}</ul>
            </div>
        </>
    )
}

interface EditableInputProps {
    display: string;
    value: string;
    func: (value: string) => Promise<boolean>;
}

function EditableInput({ display, value, func }: EditableInputProps) {
    const [editing, setEditing] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(value);

    useEffect(() => {
        if (!inputValue)
            setInputValue(value);
    }, [value])

    const handleSaveClick = async () => {
        setEditing(false);
        const result = await func(inputValue);
        if (!result) setInputValue(value);
    }

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {editing ?
                <>
                    <input
                        type="text"
                        placeholder={display}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.currentTarget.value)}
                    />
                    <button
                        onClick={handleSaveClick}
                        className="column column-offset-10 column-10">
                        Save
                    </button>
                </> :
                <>
                    <span><b>{display}:</b> {inputValue}</span>
                    <span style={{ cursor: 'pointer' }}
                        onClick={() => setEditing(prevState => !prevState)}>
                        ✎
                    </span>
                </>
            }

        </div>
    )
}