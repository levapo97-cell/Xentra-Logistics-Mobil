import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SalesDocType = "quote" | "order" | "invoice";

export type SalesLine = {
    id: string;
    code: string;        // Código artículo
    description: string;
    qty: number;
    unitPrice: number;
    total: number;       // qty * unitPrice
};

export type SalesDocStatus =
    | "Borrador"
    | "Enviado"
    | "Aprobado"
    | "Rechazado"
    | "Facturado"
    | "Anulado";

export type SalesDoc = {
    id: string;
    number: string;
    client: string;
    date: string;
    notes?: string;
    status: SalesDocStatus;
    lines: SalesLine[];
    createdAt: string;
    // amount se calcula desde las líneas
};

// Utilidad: total desde líneas
export function calcTotal(lines: SalesLine[]): number {
    return lines.reduce((sum, l) => sum + l.total, 0);
}

type SalesContextType = {
    quotes: SalesDoc[];
    orders: SalesDoc[];
    invoices: SalesDoc[];
    addDocument: (type: SalesDocType, data: Omit<SalesDoc, "id" | "createdAt">) => SalesDoc;
    updateDocument: (type: SalesDocType, id: string, data: Partial<Omit<SalesDoc, "id" | "createdAt">>) => void;
    removeDocument: (type: SalesDocType, id: string) => void;
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

function line(id: string, code: string, description: string, qty: number, unitPrice: number): SalesLine {
    return { id, code, description, qty, unitPrice, total: qty * unitPrice };
}

const SEED_QUOTES: SalesDoc[] = [
    {
        id: "q1", number: "OFV-2026-001", client: "Transportes del Norte S.A.",
        date: "2026-02-10", status: "Aprobado",
        notes: "Incluye servicio de flete para 5 rutas.",
        createdAt: "2026-02-10T08:00:00Z",
        lines: [
            line("q1l1", "SRV-001", "Servicio de flete zona norte", 5, 1500.00),
            line("q1l2", "SRV-010", "Combustible incluido", 5, 1000.00),
        ],
    },
    {
        id: "q2", number: "OFV-2026-002", client: "Distribuidora Centro S.R.L.",
        date: "2026-02-18", status: "Enviado",
        notes: "Pendiente confirmación de cliente.",
        createdAt: "2026-02-18T10:30:00Z",
        lines: [
            line("q2l1", "PRD-045", "Caja de embalaje resistente", 100, 45.00),
            line("q2l2", "PRD-046", "Cinta de empaque industrial", 50, 25.10),
        ],
    },
    {
        id: "q3", number: "OFV-2026-003", client: "Logística Express CIA. LTDA.",
        date: "2026-03-01", status: "Borrador",
        createdAt: "2026-03-01T14:00:00Z",
        lines: [
            line("q3l1", "SRV-020", "Gestión logística mensual", 3, 8000.00),
            line("q3l2", "SRV-021", "Seguimiento GPS de flota", 3, 2400.00),
        ],
    },
    {
        id: "q4", number: "OFV-2026-004", client: "Comercial El Agro",
        date: "2026-03-05", status: "Rechazado",
        notes: "Cliente solicitó rediseño de propuesta.",
        createdAt: "2026-03-05T09:15:00Z",
        lines: [
            line("q4l1", "PRD-100", "Silo metálico 10 ton", 1, 5600.00),
        ],
    },
];

const SEED_ORDERS: SalesDoc[] = [
    {
        id: "o1", number: "ODV-2026-001", client: "Transportes del Norte S.A.",
        date: "2026-02-15", status: "Aprobado",
        notes: "Generado desde OFV-2026-001.",
        createdAt: "2026-02-15T09:00:00Z",
        lines: [
            line("o1l1", "SRV-001", "Servicio de flete zona norte", 5, 1500.00),
            line("o1l2", "SRV-010", "Combustible incluido", 5, 1000.00),
        ],
    },
    {
        id: "o2", number: "ODV-2026-002", client: "Grupo Industrial Pacífico",
        date: "2026-02-28", status: "Enviado",
        notes: "20 unidades de equipo pesado.",
        createdAt: "2026-02-28T11:00:00Z",
        lines: [
            line("o2l1", "EQP-200", "Montacargas eléctrico 2.5 ton", 2, 18500.00),
            line("o2l2", "EQP-201", "Pallet hidráulico 1 ton", 10, 800.00),
        ],
    },
    {
        id: "o3", number: "ODV-2026-003", client: "Ferretería Cosmos",
        date: "2026-03-03", status: "Aprobado",
        createdAt: "2026-03-03T08:45:00Z",
        lines: [
            line("o3l1", "PRD-300", "Tornillería industrial surtida", 20, 80.00),
            line("o3l2", "PRD-301", "Pintura anticorrosiva 4L", 20, 80.00),
        ],
    },
];

const SEED_INVOICES: SalesDoc[] = [
    {
        id: "i1", number: "FAC-2026-0001", client: "Transportes del Norte S.A.",
        date: "2026-02-20", status: "Facturado",
        notes: "Generado desde ODV-2026-001. Pago a 30 días.",
        createdAt: "2026-02-20T10:00:00Z",
        lines: [
            line("i1l1", "SRV-001", "Servicio de flete zona norte", 5, 1500.00),
            line("i1l2", "SRV-010", "Combustible incluido", 5, 1000.00),
        ],
    },
    {
        id: "i2", number: "FAC-2026-0002", client: "Ferretería Cosmos",
        date: "2026-03-04", status: "Enviado",
        notes: "Pago a 15 días.",
        createdAt: "2026-03-04T09:00:00Z",
        lines: [
            line("i2l1", "PRD-300", "Tornillería industrial surtida", 20, 80.00),
            line("i2l2", "PRD-301", "Pintura anticorrosiva 4L", 20, 80.00),
        ],
    },
    {
        id: "i3", number: "FAC-2026-0003", client: "MegaDistribuidora S.A.",
        date: "2026-03-06", status: "Anulado",
        notes: "Anulada por error de datos del cliente.",
        createdAt: "2026-03-06T16:00:00Z",
        lines: [
            line("i3l1", "SRV-050", "Distribución regional Q1", 1, 9100.00),
        ],
    },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const SalesContext = createContext<SalesContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SalesProvider({ children }: { children: ReactNode }) {
    const [quotes, setQuotes] = useState<SalesDoc[]>(SEED_QUOTES);
    const [orders, setOrders] = useState<SalesDoc[]>(SEED_ORDERS);
    const [invoices, setInvoices] = useState<SalesDoc[]>(SEED_INVOICES);

    const setterFor = (type: SalesDocType) => {
        if (type === "quote") return setQuotes;
        if (type === "order") return setOrders;
        return setInvoices;
    };

    const addDocument = (
        type: SalesDocType,
        data: Omit<SalesDoc, "id" | "createdAt">
    ): SalesDoc => {
        const doc: SalesDoc = {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setterFor(type)((prev) => [doc, ...prev]);
        return doc;
    };

    const updateDocument = (
        type: SalesDocType,
        id: string,
        data: Partial<Omit<SalesDoc, "id" | "createdAt">>
    ) => {
        setterFor(type)((prev) =>
            prev.map((d) => (d.id === id ? { ...d, ...data } : d))
        );
    };

    const removeDocument = (type: SalesDocType, id: string) => {
        setterFor(type)((prev) => prev.filter((d) => d.id !== id));
    };

    return (
        <SalesContext.Provider
            value={{ quotes, orders, invoices, addDocument, updateDocument, removeDocument }}
        >
            {children}
        </SalesContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSales(): SalesContextType {
    const ctx = useContext(SalesContext);
    if (!ctx) throw new Error("useSales debe usarse dentro de <SalesProvider>");
    return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const TYPE_LABELS: Record<SalesDocType, string> = {
    quote: "Oferta de Venta",
    order: "Orden de Venta",
    invoice: "Factura Cliente",
};

export const TYPE_ICONS: Record<SalesDocType, string> = {
    quote: "📋",
    order: "📦",
    invoice: "🧾",
};

export const TYPE_DESC: Record<SalesDocType, string> = {
    quote: "Propuesta comercial enviada al cliente.",
    order: "Pedido confirmado por el cliente.",
    invoice: "Factura emitida al cliente.",
};

export const STATUS_COLORS: Record<SalesDocStatus, string> = {
    "Borrador": "#9FB0D0",
    "Enviado": "#4F8CFF",
    "Aprobado": "#19C37D",
    "Rechazado": "#FF4D4D",
    "Facturado": "#A78BFA",
    "Anulado": "#FF4D4D",
};

export const ALL_STATUSES: SalesDocStatus[] = [
    "Borrador", "Enviado", "Aprobado", "Rechazado", "Facturado", "Anulado",
];
