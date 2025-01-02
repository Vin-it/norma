import { useEffect, useState } from "react";
import { loadMetadata, loadSupportedMethods } from "./api";
import { makeReq } from "../../utils/api.utils";
import { UrlStore } from "../../utils/url.store";

interface Metadata {
    name: string;
    pubkey: string;
    description: string;
    icon: string;
}

export default function Metadata() {
    const [metadata, setMetadata] = useState<Metadata>({ name: '', pubkey: '', description: '', icon: '' });
    const [supportedMethods, setSupportedMethods] = useState<string[]>([]);
    const [api, setApi] = useState({
        MANAGER_API_BASE_URL: UrlStore.getBaseUrlUnsafe(),
        MANAGER_API_ENDPOINT: UrlStore.getManagerEndpointUnsafe()
    })

    const loadData = async () => {
        const supportedMethods = await loadSupportedMethods();
        const metadata = await loadMetadata();
        setMetadata(metadata);
        setSupportedMethods(supportedMethods);
    }

    useEffect(() => {
        loadData();
    }, [api.MANAGER_API_BASE_URL, api.MANAGER_API_ENDPOINT]);

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

    const handleIconUpdate = async (iconUrl: string) => {
        const res = await makeReq({ method: "changerelayicon", params: [iconUrl] });
        if (res.ok) {
            const result = await res.json();
            if (result.error) return false;
            return true;
        }
        return false;
    }

    const handleBaseUrlUpdate = async (baseUrl: string) => {
        setApi(prevState => ({
            ...prevState,
            MANAGER_API_BASE_URL: baseUrl,
        }));
        return true;
    }
    const handleEndpointUpdate = async (endpoint: string) => {
        setApi(prevState => ({
            ...prevState,
            MANAGER_API_ENDPOINT: endpoint,
        }));
        return true;
    }

    const handleSaveUrl = (baseUrl: string, endpoint: string) => {
        if (!baseUrl || !endpoint) {
            return false;
        }

        UrlStore.setBaseUrl(baseUrl);
        UrlStore.setEndpoint(endpoint);
        setApi({
            MANAGER_API_BASE_URL: baseUrl,
            MANAGER_API_ENDPOINT: endpoint,
        });
        return true;
    }

    if (!api.MANAGER_API_BASE_URL || !api.MANAGER_API_ENDPOINT) {
        return <InitializeApp handleSaveUrl={handleSaveUrl} />
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
                <EditableInput
                    display="Icon Url" value={metadata.icon}
                    func={handleIconUpdate} />
                <EditableInput
                    display="Relay Management API URL" value={api.MANAGER_API_BASE_URL ?? ''}
                    func={handleBaseUrlUpdate} />
                <EditableInput
                    display="Relay Management API Endpoint" value={api.MANAGER_API_ENDPOINT ?? ''}
                    func={handleEndpointUpdate} />
                <span><b>Owner:</b> {metadata.pubkey}</span>
                <div className="supported-methods">
                    <span><b>Supported Methods:</b></span>
                    {supportedMethods.map((s, idx) => <span key={idx}>{' '}✅ {s} {idx === supportedMethods.length ? ',' : ''}</span>)}
                </div>
                <button onClick={() => {
                    const confirmed = confirm("are you sure?");
                    if (confirmed) {
                        localStorage.clear();
                        setApi({
                            MANAGER_API_BASE_URL: null,
                            MANAGER_API_ENDPOINT: null,
                        });
                    }
                }}>⚠️ RESET</button>
            </div>
        </>
    )
}

function InitializeApp({ handleSaveUrl }: { handleSaveUrl: (baseUrl: string, endpoint: string) => boolean }) {
    const [baseUrl, setBaseUrl] = useState('');
    const [endpoint, setEndpoint] = useState('');

    return (
        <div>
            Relay Base Url: <input type="text" value={baseUrl}
                onChange={(e) => setBaseUrl(e.currentTarget.value)} placeholder="Example, http://myrelay.com"
            />
            Relay management endpoint: <input type="text" value={endpoint}
                onChange={(e) => setEndpoint(e.currentTarget.value)} placeholder="Example, /admin/manager"
            />
            <button onClick={() => {
                if (!baseUrl || !endpoint) return;
                handleSaveUrl(baseUrl, endpoint)
            }}>Save</button>
        </div>
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
                    <span>
                        <b>{display}: </b>
                        {inputValue.includes('http') ?
                            <a href={inputValue} >{inputValue}</a> :
                            inputValue}
                    </span>
                    <span style={{ cursor: 'pointer' }}
                        onClick={() => setEditing(prevState => !prevState)}>
                        ✎
                    </span>
                </>
            }

        </div>
    )
}