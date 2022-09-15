const DEFAULT_NAME = 'Tzu Chi';
const BAKSOS_BACKEND_URL = process.env.BACKEND_HOST || 'http://localhost:8000';

const TYPE_IDENTITAS: TipeIdentitas[] = [
    { name: "KTP" },
    { name: "SIM" },
    { name: "KK" },
    { name: "PASPOR" },
]

export { DEFAULT_NAME, BAKSOS_BACKEND_URL, TYPE_IDENTITAS }