export function ModalFilesShow({ files }) {
    const downloadOrOpen = (url, name) => {
        const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(name);
        if (isImage) {
            // Отваря се в нов таб
            window.open(url, "_blank", "noopener,noreferrer");
            return;
        }

        // За всички други файлове – изтегляне
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
    };
    return (
        <>
            {files.length === 0 ? (
                <p className="text-gray-500 text-sm">Няма качени материали.</p>
            ) : (
                <ul className="space-y-2 w-60">
                    {files.map((f, i) => (
                        <li
                            key={i}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 underline truncate"
                            onClick={() => downloadOrOpen(f.url, f.name)}
                        >
                            {f.name}
                        </li>
                    ))}
                </ul>
            )
            }
        </>
    )
}